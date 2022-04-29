import React, { useContext } from 'react';

const CommonContext = React.createContext({
  state: {
    queryInstance: {
      age: 17,
      sex: 'F',
      school: 'GP',
      address: 'R',
      Mjob: 'at_home',
      Fjob: 'services',
      guardian: 'father',
      traveltime: 1,
      studytime: 3,
      paid: 'yes',
      nursery: 'no',
      internet: 'yes',
      absences: 0,
      G1: 11,
      G2: 11,
    },
    prediction: {
      prediction: '--',
      predictionProb: [0, 0, 0, 0],
      accuracy: NaN,
    },
    dataMeta: {},
  },
  setQueryInstance: (queryInstance: any) => {},
  setPrediction: (prediction: any) => {},
  setDataMeta: (dataMeta: any) => {},
});

const CMContextComp: React.FC = ({ children }) => {
  const [state, setState] = React.useState({
    queryInstance: {
      age: 17,
      sex: 'F',
      school: 'GP',
      address: 'R',
      Mjob: 'at_home',
      Fjob: 'services',
      guardian: 'father',
      traveltime: 1,
      studytime: 3,
      paid: 'yes',
      nursery: 'no',
      internet: 'yes',
      absences: 0,
      G1: 11,
      G2: 11,
    },
    prediction: {
      prediction: '--',
      predictionProb: [0, 0, 0, 0],
      accuracy: NaN,
    },
    dataMeta: {},
  });

  const setQueryInstance = (queryInstance: any) => {
    setState({
      ...state,
      queryInstance,
    });
  };

  const setPrediction = (prediction: any) => {
    setState({
      ...state,
      prediction,
    });
  };

  const setDataMeta = (dataMeta: any) => {
    setState({
      ...state,
      dataMeta,
    });
  };

  return (
    <CommonContext.Provider
      value={{
        state,
        setQueryInstance,
        setPrediction,
        setDataMeta,
      }}
    >
      {children}
    </CommonContext.Provider>
  );
};

export default CMContextComp;
export const useCommonContext = () => useContext(CommonContext);
