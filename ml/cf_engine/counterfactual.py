import pandas as pd


class CounterfactualExample:
    """A class to store counterfactual examples"""

    def __init__(self, data_meta, cfs=None):
        self._target = data_meta["target"]
        self._prediction = data_meta["prediction"]
        self._features = data_meta["features"]

        self._cfs = pd.DataFrame(cfs, columns=self._features + [self._target, self._prediction])

    @property
    def all(self):
        return self._cfs

    @all.setter
    def all(self, cfs):
        self._cfs = pd.DataFrame(cfs, columns=self._features + [self._target, self._prediction])
        self._cfs["{}_target".format(self._target)] = self._cfs.pop(self._prediction)

    @property
    def valid(self):
        return self._cfs[self._cfs[self._target] == self._cfs[self._prediction]]

    @property
    def invalid(self):
        return self._cfs[self._cfs[self._target] != self._cfs[self._prediction]]

    def query(self, index):
        return self._cfs.loc[index, :]

