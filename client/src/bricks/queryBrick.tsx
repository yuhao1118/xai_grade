import React from 'react';
import {
  Card,
  Typography,
  Form,
  Input,
  Button,
  InputNumber,
  Radio,
} from 'antd';
import { IdcardFilled } from '@ant-design/icons';
import './index.less';

const { Title } = Typography;

const QueryBrick: React.FC = () => {
  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  return (
    <Card title="Tell us about yourself..." className="query-brick">
      <Title level={5} style={{ fontWeight: 500 }}>
        <IdcardFilled className="icon" />
        Your General Information
      </Title>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        autoComplete="off"
        onFinish={onFinish}
      >
        <Form.Item
          label="Age"
          name="age"
          rules={[{ required: true, message: 'Please input your age!' }]}
        >
          <InputNumber min={0} max={100} />
        </Form.Item>

        <Form.Item
          label="Gender"
          name="gender"
          rules={[{ required: true, message: 'Please input your gender!' }]}
        >
          <Radio.Group>
            <Radio.Button value="f">Female</Radio.Button>
            <Radio.Button value="m">Male</Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="G1"
          name="G1"
          rules={[{ required: true, message: 'Please input your g1 score!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="G2"
          name="G2"
          rules={[{ required: true, message: 'Please input your g2 score!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default QueryBrick;
