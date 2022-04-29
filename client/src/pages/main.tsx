import { Layout, Steps, Button } from 'antd';
import React, { useEffect } from 'react';
import { SHAPBrick, CFBrick, DataBrick, QueryBrick } from '../bricks';
import './main.less';
import { useHistory } from 'react-router-dom';
import { getUrlParams } from '@src/utils/common';
import { useCommonContext } from '@src/context/common';
import { getDataMeta } from '@src/api';

const { Content, Header } = Layout;
const { Step } = Steps;

const stepABTest = (
  currentStep: number,
  desireStep: number,
  enable: boolean
) => {
  if (enable) {
    return currentStep === desireStep;
  } else {
    return currentStep >= desireStep;
  }
};

const MainPage: React.FC = () => {
  const [currentStep, setCurrentStep] = React.useState(0);
  const history = useHistory();
  const { setDataMeta } = useCommonContext();

  useEffect(() => {
    getDataMeta().then((data) => {
      setDataMeta(data);
    });
  }, []);

  const CLEAR_PREV_RES = getUrlParams('CLEAR_PREV_RES', window.location.href);
  const CLEAR_PREV_RES_FLAG =
    CLEAR_PREV_RES === '1' || CLEAR_PREV_RES === 'true';

  return (
    <Layout className="layout">
      <Header className="header">
        <Steps current={currentStep} className="steps">
          <Step
            title="Input User Data"
            description="Input your information to make a grade prediction."
          />
          <Step title="View Model Prediction" description="Predict G3 score." />
          <Step
            title="View WHY Explanations"
            description="Present WHY explanations using SHAP."
          />
          <Step
            title="View HOW Explanations"
            description="Present HOW explanations using Counterfactual."
          />
        </Steps>
        <div className="control-btn">
          <Button
            style={{
              marginRight: '8px',
            }}
            onClick={() => {
              if (currentStep === 0) {
                history.goBack();
              }
              setCurrentStep((i) => (i <= 0 ? i : i - 1));
            }}
          >
            Back
          </Button>
          <Button
            type="primary"
            onClick={() => {
              setCurrentStep((i) => (i >= 3 ? i : i + 1));
            }}
          >
            Next
          </Button>
        </div>
      </Header>
      <Content className="content">
        {currentStep === 0 && <QueryBrick />}
        {stepABTest(currentStep, 1, CLEAR_PREV_RES_FLAG) && <DataBrick />}
        {stepABTest(currentStep, 2, CLEAR_PREV_RES_FLAG) && <SHAPBrick />}
        {stepABTest(currentStep, 3, CLEAR_PREV_RES_FLAG) && <CFBrick />}
      </Content>
    </Layout>
  );
};

export default MainPage;
