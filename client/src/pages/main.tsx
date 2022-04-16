import { Layout, Row, Col, Steps, Button } from 'antd';
import React from 'react';
import {
  SHAPBrick,
  CFBrick,
  PerformanceBrick,
  DataBrick,
  QueryBrick,
} from '../bricks';
import './main.less';
import { useHistory } from 'react-router-dom';

const { Content, Header } = Layout;
const { Step } = Steps;

const MainPage: React.FC = () => {
  const [currentStep, setCurrentStep] = React.useState(0);
  const history = useHistory();

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
        {currentStep === 1 && <DataBrick />}
        {currentStep === 2 && <SHAPBrick />}
        {currentStep === 3 && <CFBrick />}

        {/* <Row justify="center" align="top">
          <Col
            span={6}
            style={{
              height: '100vh',
              overflowY: 'scroll',
            }}
          >
            <DataBrick />
          </Col>
          <Col span={18}>
            <Row gutter={[24, 24]}>
              <Col span={24}>
                <PerformanceBrick />
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <SHAPBrick />
              </Col>
              <Col span={12}>
                <CFBrick />
              </Col>
            </Row>
          </Col>
        </Row> */}
      </Content>
    </Layout>
  );
};

export default MainPage;
