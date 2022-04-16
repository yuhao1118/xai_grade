import React from 'react';
import { Card, Form, Input, InputNumber, Row, Slider } from 'antd';

const CFBrick: React.FC = () => {
  return (
    <Card title="Student Grade Prediction">
      <Row>
        <Form
          name="basic"
          initialValues={{ remember: true }}
          autoComplete="off"
        >
          <Form.Item
            label="Train/ Test Ratio"
            name="Train Test Split Ratio"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Slider defaultValue={80} max={100} min={0} />
          </Form.Item>

          <Form.Item
            label="No. features of h1"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <InputNumber defaultValue={16} />
          </Form.Item>

          <Form.Item
            label="No. features of h2"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <InputNumber defaultValue={8} />
          </Form.Item>

          <Form.Item
            label="Learning rate"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <InputNumber defaultValue={0.02} />
          </Form.Item>
        </Form>
      </Row>
    </Card>
  );
};

export default CFBrick;
