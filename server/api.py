import logging

from flask.json import JSONEncoder
from flask import request, jsonify, Blueprint, current_app, Response

from .helpers import trans_data_meta
import numpy as np

api = Blueprint('api', __name__)

logger = logging.getLogger('api')


class ApiError(Exception):
    """
    API error handler Exception
    See: http://flask.pocoo.org/docs/0.12/patterns/apierrors/
    """
    status_code = 400

    def __init__(self, message, status_code=None, payload=None):
        Exception.__init__(self)
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        rv = dict(self.payload or ())
        rv['message'] = self.message
        return rv


@api.errorhandler(ApiError)
def handle_invalid_usage(error):
    logging.exception(error)
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response


class BetterJSONEncoder(JSONEncoder):
    """
    JSONEncoder subclass that knows how to encode numpy.ndarray.
    """

    def default(self, o):
        if hasattr(o, 'tolist'):
            return o.tolist()
        return super().default(o)


# inject a more powerful jsonEncoder
api.json_encoder = BetterJSONEncoder


@api.route('/data_meta', methods=['GET'])
def get_data_meta():
    data_meta = trans_data_meta(current_app.dir_manager.dataset_meta)
    return jsonify(data_meta)


@api.route('/data', methods=['GET'])
def get_data():
    dataset = current_app.dataset
    data_df = dataset.data
    features = dataset.features
    res = {}

    for feature in features:
        if feature in dataset.numerical_features:
            feat_min = data_df[feature].min()
            feat_max = data_df[feature].max()

            feat_bins = 4
            labels = list(range(feat_min, feat_max + 1, int((feat_max + 1 - feat_min) / feat_bins)))
            if feat_max not in labels:
                labels.append(feat_max)
            
            feat_obj = {
            'name': feature,
            'type': 'numerical',
            'min': feat_min,
            'max': feat_max,
            'classes': labels,
            'values': data_df[feature].value_counts(bins = labels).tolist()
            }

        elif feature in dataset.categorical_features:
            category_value_count = data_df[feature].value_counts()
            feat_obj = {
            'name': feature,
            'type': 'categorical',
            'classes': category_value_count.index.tolist(),
            'values': category_value_count.values.tolist()
            }

        res[feature] = feat_obj
        
    return jsonify(res)


@api.route('/predict', methods=['POST'])
def predict_instance():
    request_params = request.get_json()
    query_instance = request_params['queryInstance']
    report_df, pred_prob = current_app.model.report(x=[query_instance])
    pred = report_df[current_app.dataset.prediction]

    return {
        'prediction': pred[0],
        'predictionProb': pred_prob[0],
        'accuracy': current_app.dir_manager.model_meta['train_accuracy']
    }


@api.route('/counterfactuals', methods=['GET', 'POST'])
def get_cf_instance():
    request_params = request.get_json()
    X = request_params['queryInstance']
    k = request_params.get('k', -1)
    num = request_params.get('cfNum', 1)
    attr_mask = request_params.get('attrFlex', None)
    if attr_mask is not None:
        changeable_attr = [current_app.dataset.features[i] for i, t in enumerate(attr_mask) if t]
    else:
        changeable_attr = 'all'
    range_list = request_params.get('attrRange', [])
    for r in range_list:
        if 'extent' in r:
            r['min'], r['max'] = r['extent'][0], r['extent'][1]
    cf_range = {r["name"]: {**r} for r in range_list}
    desired_class = current_app.dataset.target + "_" + request_params['desiredClass']
    desired_class = (np.array(current_app.dataset.dummy_target) == desired_class) * 1
    desired_class = np.repeat([desired_class], repeats=num, axis=0).tolist()

    setting = {'changeable_attr': changeable_attr, 'cf_range': cf_range,
               'num': num, 'k': k, 'desired_class': desired_class}


    cfs = current_app.cf_engine.generate_counterfactual_examples([X], setting).all[
        current_app.dataset.features + [current_app.dataset.prediction]]
    return jsonify(cfs.values.tolist())


@api.route('/shap_values', methods=['GET', 'POST'])
def get_shap_values():
    request_params = request.get_json()
    X = request_params['queryInstance']
    shap_values = current_app.shap_engine.generate_shap_explanations([X])
    return shap_values[0].top_k(12)

def display_shap_explan():
    f = open("./shap.html", 'r')
    return f.read()