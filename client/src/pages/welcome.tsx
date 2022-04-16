import React from 'react';
import './welcome.less';
import { Typography, Button } from 'antd';

const { Title } = Typography;

const WelcomePage: React.FC = () => {
  return (
    <div className="welcome">
      <div className="welcome-content">
        <Title style={{ color: '#fff' }}>
          Explainable Student Grade Prediction System
        </Title>
        <Title level={5} style={{ color: '#fff' }}>
          A web application that predicts and explains student grades based on
          their background.
        </Title>
        <div className="btn-row">
          <Button type="primary" href={'/main'}>
            Get Start
          </Button>
          <Button>User Manual</Button>
          <Button>License and agreement</Button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
