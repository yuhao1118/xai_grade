import React from 'react';
import {
  Card,
  Typography,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Switch,
  Slider,
} from 'antd';
import { IdcardFilled } from '@ant-design/icons';
import './index.less';
import { useCommonContext } from '@src/context/common';

const { Title } = Typography;
const { Option } = Select;

const parseQueryInstance = (queryInstance: any) => {
  const _queryInstance = JSON.parse(JSON.stringify(queryInstance));

  _queryInstance['traveltime'] /= 15;
  _queryInstance['studytime'] /= 2.5;
  _queryInstance['paid'] = queryInstance['paid'] ? 'yes' : 'no';
  _queryInstance['nursery'] = queryInstance['nursery'] ? 'yes' : 'no';
  _queryInstance['internet'] = queryInstance['internet'] ? 'yes' : 'no';

  return _queryInstance;
};

const inverseParseQueryInstance = (queryInstance: any) => {
  const _queryInstance = JSON.parse(JSON.stringify(queryInstance));

  _queryInstance['traveltime'] *= 15;
  _queryInstance['studytime'] *= 2.5;
  _queryInstance['paid'] = queryInstance['paid'] === 'yes';
  _queryInstance['nursery'] = queryInstance['nursery'] === 'yes';
  _queryInstance['internet'] = queryInstance['internet'] === 'yes';

  return _queryInstance;
};

const QueryBrick: React.FC = () => {
  const {
    setQueryInstance,
    state: { queryInstance },
  } = useCommonContext();

  const onChange = (changedValue: any, values: any) => {
    setQueryInstance(parseQueryInstance(values));
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
        initialValues={inverseParseQueryInstance(queryInstance)}
        autoComplete="off"
        onValuesChange={onChange}
      >
        <Form.Item
          label="Age"
          name="age"
          rules={[{ required: true, message: 'Please input your age!' }]}
        >
          <InputNumber min={0} max={100} />
        </Form.Item>

        <Form.Item
          label="Sex"
          name="sex"
          rules={[{ required: true, message: 'Please input your sex!' }]}
        >
          <Radio.Group>
            <Radio.Button value="F">Female</Radio.Button>
            <Radio.Button value="M">Male</Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="School"
          name="school"
          rules={[{ required: true, message: 'Please input your school!' }]}
        >
          <Radio.Group>
            <Radio.Button value="GP">Gabriel Pereira</Radio.Button>
            <Radio.Button value="MS">Mousinho da Silveira</Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="Address"
          name="address"
          rules={[{ required: true, message: 'Please input your address!' }]}
        >
          <Radio.Group>
            <Radio.Button value="U">Urban</Radio.Button>
            <Radio.Button value="R">Rural</Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="Mother's Job"
          name="Mjob"
          rules={[
            { required: true, message: "Please input your mother's job!" },
          ]}
        >
          <Select>
            <Option value="at_home">At home</Option>
            <Option value="health">Health care related</Option>
            <Option value="services">
              Civil 'services' (e.g. administrative or police)
            </Option>
            <Option value="teacher">Teacher</Option>
            <Option value="other">Other</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Father's Job"
          name="Fjob"
          rules={[
            { required: true, message: "Please input your father's job!" },
          ]}
        >
          <Select>
            <Option value="at_home">At home</Option>
            <Option value="health">Health care related</Option>
            <Option value="services">
              Civil 'services' (e.g. administrative or police)
            </Option>
            <Option value="teacher">Teacher</Option>
            <Option value="other">Other</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Guardian"
          name="guardian"
          tooltip="Student's guardian"
          rules={[{ required: true, message: 'Please input your guardian!' }]}
        >
          <Radio.Group>
            <Radio.Button value="mother">Mother</Radio.Button>
            <Radio.Button value="father">father</Radio.Button>
            <Radio.Button value="other">other</Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="Travel Time"
          name="traveltime"
          tooltip="Home to school travel time"
          rules={[
            { required: true, message: 'Please input your travel time!' },
          ]}
        >
          <Slider
            min={0}
            max={60}
            marks={{
              0: '0 min',
              15: '15 min',
              30: '30 min',
              60: '60 min',
            }}
          />
        </Form.Item>

        <Form.Item
          label="Study Time"
          name="studytime"
          tooltip="Weekly study time"
          rules={[{ required: true, message: 'Please input your study time!' }]}
        >
          <Slider
            min={0}
            max={10}
            marks={{
              0: '0 hour',
              2: '2 hours',
              5: '5 hours',
              10: '10 hours',
            }}
          />
        </Form.Item>

        <Form.Item
          label="Paid Class"
          name="paid"
          tooltip="Extra paid classes within the course subject"
          valuePropName="checked"
          rules={[
            {
              required: true,
              message: 'Please input whether you have attended paid classes!',
            },
          ]}
        >
          <Switch />
        </Form.Item>

        <Form.Item
          label="Nursery School"
          name="nursery"
          valuePropName="checked"
          tooltip="Attended nursery school"
          rules={[
            {
              required: true,
              message:
                'Please input whether you have attended a nursery school!',
            },
          ]}
        >
          <Switch />
        </Form.Item>

        <Form.Item
          label="Internet Access"
          name="internet"
          valuePropName="checked"
          tooltip="Internet access at home"
          rules={[
            {
              required: true,
              message: 'Please input whether you have internet access at home!',
            },
          ]}
        >
          <Switch />
        </Form.Item>

        <Form.Item
          label="Absences"
          name="absences"
          rules={[
            { required: true, message: 'Please input your abence times!' },
          ]}
        >
          <InputNumber min={0} max={100} />
        </Form.Item>

        <Form.Item
          label="G1"
          name="G1"
          rules={[{ required: true, message: 'Please input your g1 score!' }]}
          tooltip="First period grade (from 0 to 20)"
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="G2"
          name="G2"
          rules={[{ required: true, message: 'Please input your g2 score!' }]}
          tooltip="Second period grade (from 0 to 20)"
        >
          <Input />
        </Form.Item>
      </Form>
    </Card>
  );
};

export default QueryBrick;
