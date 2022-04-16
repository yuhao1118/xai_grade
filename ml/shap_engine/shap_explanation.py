import pandas as pd
import numpy as np

class SHAPExplanation:
    """A class to store shap explanations"""

    def __init__(self, values, base_values, data, feature_names, pred_class_name):
        self._values = values
        self._base_values = base_values
        self._data = data
        self._features = feature_names
        self._pred_class = pred_class_name
        self._meta = {
            'base_value': self._base_values,
            'pred_class': self._pred_class
        }

    def all(self):
        """Return all features and their associated shap values"""
        res = {}
        res['values'] = self._values.tolist()
        res['features'] = self._features
        res['data'] = self._data.tolist()

        return {**self._meta, **res}

    def top_k(self, k):
        """Return top k features + other_features' shap values"""
        if k > len(self._features):
            raise ValueError("K is larger than total number of features!")

        res = {}
        top_k_mask = np.abs(self._values).argsort()[::-1]

        top_k_values = self._values[top_k_mask[:k]]
        rest_k_values_sum = self._values[top_k_mask[k:]].sum()
        res['values'] = np.concatenate((top_k_values, [rest_k_values_sum])).tolist()

        top_k_features = [self._features[i] for i in top_k_mask[:k]]
        rest_k_feature = "{:d} other features".format(len(self._features) - k)
        res['features'] = top_k_features + [rest_k_feature]

        top_k_data = self._data[top_k_mask[:k]]
        rest_k_data = None # we don't care data of "other" feature
        res['data'] = np.concatenate((top_k_data, [rest_k_data])).tolist()

        return {**self._meta, **res}