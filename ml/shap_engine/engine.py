from shap import Explainer, Explanation
import numpy as np
import pandas as pd
import torch


class SHAPEnginePytorch:
    def __init__(self, dataset, model_manager):
        self._dataset = dataset
        self._mm = model_manager
        self._description = dataset.description
        self._features = dataset.features
        self._dummy_features = dataset.dummy_features


    def _predict_prob(self, X):
        """scikit-learn like wrap of probability estimates of each class"""
        if isinstance(X, pd.DataFrame):
            _X = X.values
        elif isinstance(X, np.ndarray):
            _X = X
        else:
            raise ValueError("X should be either a DataFrame or a ndarray matrix!")
        
        _X = torch.from_numpy(_X).float()
        pred =  self._mm.forward(_X).detach().numpy()

        return pred

    def _from_dummy(self, data, inplace=True):
        """Giving a shap value dataframe of dummy features, return shap value dataframe of original features."""
        data = data.copy()
        for col in self._features:
            if not self._dataset.is_num(col):
                cats = self._description[col]['categories']
                dummy_cols = ['{}_{}'.format(col, cat) for cat in cats]
                intersection_cols = [col for col in dummy_cols if col in data.columns]
                if len(intersection_cols) > 0:
                    data[col] = self._stack_dummy(data[intersection_cols], col)
                    if inplace:
                        for col in intersection_cols:
                            data.pop(col)

        cols = [col for col in self._features if col in data.columns]

        return data[cols]

    def _stack_dummy(self, data, original_column):
        """Shap value of each original feature is the summation of its dummy features"""
        cats = self._description[original_column]['categories']
        dummy_col = ['{}_{}'.format(original_column, cat) for cat in cats]
        category_value = data.loc[:, dummy_col].values.sum(axis=1)
        return category_value

    def _format_shap_values(self, X, shap_values, pred_classes):
        """Return an array of shap.Explanation associated with X instances"""
        values = []
        base_values = []
        data = self._dataset.inverse_preprocess_X(X).values

        for i in range(len(X)):
            x = X.iloc[i]
            pred_class = pred_classes[i]
            shap_explanation = shap_values[i][:, pred_class] # explanation for dummy features

            values.append(shap_explanation.values)
            base_values.append(shap_explanation.base_values)

        values_df = pd.DataFrame(values, columns=self._dummy_features)
        values = self._from_dummy(values_df).values
        pred_class_names = [self._dataset.dummy_target[i] for i in pred_classes]

        res = [Explanation(values[i], base_values=base_values[i], data=data[i], feature_names=self._features) for i in range(len(X))]
        return res

    def generate_shap_explanations(self, X, preprocess=True):
        if preprocess:
            # json to DataFrame
            X = self._dataset.preprocess_X(X)

        pred_classes = self._predict_prob(X).argmax(axis=1)
        X_train = self._dataset.get_train_X()
        explainer = Explainer(self._predict_prob, X_train)
        
        shap_values = explainer(X)    # Raw shap values
        shap_values = self._format_shap_values(X, shap_values, pred_classes)    # Formatted shap explanations array

        return shap_values
        