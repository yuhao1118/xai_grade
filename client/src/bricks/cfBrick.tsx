import React, { useEffect, useState } from 'react';
import {
  Card,
  Select,
  Tooltip as ATooltip,
  Radio,
  Typography,
  Form,
  Slider,
  Checkbox,
  Row,
  Button,
  Col,
  Switch,
  Spin,
  Table,
  Divider,
  Pagination,
} from 'antd';
import './index.less';
import { InfoCircleOutlined } from '@ant-design/icons';
import { useCommonContext } from '@src/context/common';
import { getCFExplanation } from '@src/api';
import { capitaliseFirstLetter } from '@src/utils/common';

const { Title } = Typography;
const { Option } = Select;

const DEFAULT_CF_CONSTRAINT = {
  ageCheck: true,
  age: [8, 30],
  sexCheck: true,
  sex: ['F', 'M'],
  schoolCheck: true,
  school: ['GP', 'MS'],
  addressCheck: true,
  address: ['U', 'R'],
  MjobCheck: true,
  Mjob: ['at_home', 'health', 'services', 'teacher', 'other'],
  FjobCheck: true,
  Fjob: ['at_home', 'health', 'services', 'teacher', 'other'],
  guardianCheck: true,
  guardian: ['mother', 'father', 'other'],
  traveltimeCheck: true,
  traveltime: [0, 60],
  studytimeCheck: true,
  studytime: [0, 10],
  paidCheck: true,
  paid: ['yes', 'no'],
  nurseryCheck: true,
  nursery: ['yes', 'no'],
  internetCheck: true,
  internet: ['yes', 'no'],
  absencesCheck: true,
  absences: [0, 100],
  G1Check: true,
  G1: [0, 20],
  G2Check: true,
  G2: [0, 20],
};

const preprocessCFRequest = (
  form: any,
  queryInstance: any,
  dataMeta: any,
  desireGrade: string
) => {
  // const features = Object.keys(queryInstance);
  const attrRange = [] as any[];
  const attrFlex = [] as boolean[];

  (dataMeta.features as any[]).forEach((item) => {
    attrFlex.push(form[item.name + 'Check'] as boolean);

    if (item.type === 'numerical') {
      let extent = form[item.name];

      if (item.name === 'traveltime') {
        extent = extent.map((item: number) => item / 15);
      }

      if (item.name === 'studytime') {
        extent = extent.map((item: number) => item / 2.5);
      }

      if (form[item.name + 'Check'] === false) {
        extent = [queryInstance[item.name], queryInstance[item.name]];
      }

      attrRange.push({
        name: item.name,
        extent,
      });
    } else if (item.type === 'categorical') {
      attrRange.push({
        name: item.name,
        categories: form[item.name],
      });
    }
  });

  return {
    attrFlex,
    attrRange,
    queryInstance,
    cfNum: 12,
    k: 9,
    desiredClass: desireGrade,
  };
};

const CFBrick: React.FC = () => {
  const [desireGrade, setDesireGrade] = useState('A');
  const [chartType, setChartType] = useState<'diff' | 'table'>('diff');
  const [form, setForm] = useState(DEFAULT_CF_CONSTRAINT);
  const [loading, setLoading] = useState<boolean>(false);
  const [counterfactualInstances, setCounterfactualInstances] = useState<any[]>(
    []
  );
  const [tableColumns, setTableColumns] = useState<any[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);
  const [currentCF, setCurrentCF] = useState<any>({});

  const {
    state: {
      queryInstance,
      dataMeta,
      prediction: { prediction },
    },
  } = useCommonContext();

  const getCounterfactuals = async () => {
    const cfReq = preprocessCFRequest(
      form,
      queryInstance,
      dataMeta,
      desireGrade
    );

    setLoading(true);
    const counterfactuals = await getCFExplanation(cfReq);
    setLoading(false);
    setCounterfactualInstances(counterfactuals);
    setCurrentCF(counterfactuals[0]);
  };

  const onFinish = (form: any) => {
    getCounterfactuals();
  };

  const onChange = (changedValues: any, values: any) => {
    setForm(values);
  };

  useEffect(() => {
    getCounterfactuals();
  }, [desireGrade]);

  useEffect(() => {
    const allFeatures = (dataMeta as any).features.concat([
      (dataMeta as any).target,
    ]);

    if (chartType === 'table') {
      const columns = [
        {
          title: 'Index',
          dataIndex: 'index',
          key: 'index',
          width: 80,
          fixed: 'left',
        },
      ].concat(
        allFeatures.map((item: any) => {
          return {
            title: capitaliseFirstLetter(item.name as string),
            dataIndex: item.name,
            key: item.name,
            width: 100,
          };
        })
      );

      const data = counterfactualInstances.map((item: any, index: number) => {
        const instance = {} as any;
        allFeatures.forEach((feature: any, index: number) => {
          instance[feature.name] = item[index];
        });

        return {
          index: index + 1,
          key: index,
          ...instance,
        };
      });

      setTableColumns(columns);
      setTableData(data);
    }
  }, [chartType, counterfactualInstances]);

  useEffect(() => {
    const allFeatures = (dataMeta as any).features.concat([
      (dataMeta as any).target,
    ]);

    if (chartType === 'diff') {
      const columns = [
        {
          title: 'Features',
          dataIndex: 'feature',
          key: 'feature',
          fixed: 'left',
          width: 100,
        },
        {
          title: 'Original Instance',
          dataIndex: 'original',
          key: 'original',
          width: 150,
        },
        {
          title: 'Counterfactual Instance',
          dataIndex: 'counterfactual',
          key: 'counterfactual',
        },
      ];

      const data = allFeatures.map((item: any, index: number) => {
        return {
          key: index,
          feature: capitaliseFirstLetter(item.name as string),
          original:
            item.name === 'G3' ? prediction : (queryInstance as any)[item.name],
          counterfactual: (currentCF as any)[index],
        };
      });

      setTableColumns(columns);
      setTableData(data);
    }
  }, [chartType, currentCF, prediction, queryInstance]);

  const CFHeadExtra = (
    <div className="cf-header-extra">
      <div className="extra-text">Desire Grade: </div>
      <Select
        className="extra-select"
        defaultValue={desireGrade}
        onChange={(value) => {
          setDesireGrade(value);
        }}
      >
        <Option value="A">A</Option>
        <Option value="B">B</Option>
        <Option value="C">C</Option>
        <Option value="D">D</Option>
      </Select>
    </div>
  );

  return (
    <Card
      title={
        <div>
          <ATooltip title="The Counterfactual explains HOW obtain a desire prediction.">
            <InfoCircleOutlined className="icon" />
          </ATooltip>
          Action Impact
        </div>
      }
      extra={CFHeadExtra}
      className="cf-brick"
    >
      <div
        className="cf-brick-inner"
        style={{
          marginRight: '10px',
        }}
      >
        <Card title="Counterfactual Presentations" size="small">
          {loading ? (
            <div
              style={{
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Spin />
            </div>
          ) : (
            <>
              <div className="cf-stick-top">
                <Radio.Group
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                  onChange={(e) => {
                    setChartType(e.target.value);
                  }}
                  defaultValue={chartType}
                >
                  <Radio value={'diff'}>Diff view</Radio>
                  <Radio value={'table'}>Table view</Radio>
                </Radio.Group>
                {chartType === 'diff' && (
                  <Pagination
                    simple
                    defaultCurrent={1}
                    defaultPageSize={1}
                    total={counterfactualInstances.length}
                    onChange={(page, pageSize) => {
                      setCurrentCF(counterfactualInstances[page - 1]);
                    }}
                  />
                )}
              </div>
              <Table
                pagination={chartType === 'diff' ? false : { pageSize: 10 }}
                columns={tableColumns}
                dataSource={tableData}
                scroll={{
                  x: 'max-content',
                  y: chartType === 'diff' ? 550 : 490,
                  // ...(chartType === 'diff' ? { y: 550 } : {}),
                }}
                rowClassName={(record: any) => {
                  if (
                    chartType === 'diff' &&
                    record.feature !== 'G3' &&
                    record.counterfactual !== record.original
                  ) {
                    return 'cf-diff-row';
                  }
                  return '';
                }}
              />
            </>
          )}
        </Card>
      </div>

      <div className="cf-brick-inner cf-constraints">
        <Card title="Counterfactual Feature Constraints" size="small">
          <Form
            name="basic"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 16 }}
            onFinish={onFinish}
            onValuesChange={onChange}
            labelAlign="left"
            initialValues={DEFAULT_CF_CONSTRAINT}
          >
            <Row gutter={8}>
              <Col span={2}>
                <Form.Item name="ageCheck" valuePropName="checked">
                  <Switch size="small" />
                </Form.Item>
              </Col>
              <Col span={22} offset={0}>
                <Form.Item label="Age" name="age">
                  <Slider
                    disabled={form['ageCheck'] === false}
                    range
                    min={8}
                    max={30}
                    marks={{
                      8: '8',
                      30: '30',
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={8}>
              <Col span={2}>
                <Form.Item name="sexCheck" valuePropName="checked">
                  <Switch size="small" />
                </Form.Item>
              </Col>
              <Col span={22} offset={0}>
                <Form.Item label="Sex" name="sex">
                  <Checkbox.Group disabled={form['sexCheck'] === false}>
                    <Checkbox value="F">Female</Checkbox>
                    <Checkbox value="M">Male</Checkbox>
                  </Checkbox.Group>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={8}>
              <Col span={2}>
                <Form.Item name="schoolCheck" valuePropName="checked">
                  <Switch size="small" />
                </Form.Item>
              </Col>
              <Col span={22} offset={0}>
                <Form.Item label="School" name="school">
                  <Checkbox.Group disabled={form['schoolCheck'] === false}>
                    <Checkbox value="GP">Gabriel Pereira</Checkbox>
                    <Checkbox value="MS">Mousinho da Silveira</Checkbox>
                  </Checkbox.Group>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={8}>
              <Col span={2}>
                <Form.Item name="addressCheck" valuePropName="checked">
                  <Switch size="small" />
                </Form.Item>
              </Col>
              <Col span={22} offset={0}>
                <Form.Item label="Address" name="address">
                  <Checkbox.Group disabled={form['addressCheck'] === false}>
                    <Checkbox value="U">Urban</Checkbox>
                    <Checkbox value="R">Rural</Checkbox>
                  </Checkbox.Group>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={8}>
              <Col span={2}>
                <Form.Item name="MjobCheck" valuePropName="checked">
                  <Switch size="small" />
                </Form.Item>
              </Col>
              <Col span={22} offset={0}>
                <Form.Item label="Mother's Job" name="Mjob">
                  <Checkbox.Group disabled={form['MjobCheck'] === false}>
                    <Row>
                      <Checkbox value="at_home">At home</Checkbox>
                      <Checkbox value="health">Health care related</Checkbox>
                    </Row>
                    <Row>
                      <Checkbox value="services">
                        Civil 'services' (e.g. administrative or police)
                      </Checkbox>
                    </Row>
                    <Row>
                      <Checkbox value="teacher">Teacher</Checkbox>
                      <Checkbox value="other">Other</Checkbox>
                    </Row>
                  </Checkbox.Group>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={8}>
              <Col span={2}>
                <Form.Item name="FjobCheck" valuePropName="checked">
                  <Switch size="small" />
                </Form.Item>
              </Col>
              <Col span={22} offset={0}>
                <Form.Item label="Father's Job" name="Fjob">
                  <Checkbox.Group disabled={form['FjobCheck'] === false}>
                    <Row>
                      <Checkbox value="at_home">At home</Checkbox>
                      <Checkbox value="health">Health care related</Checkbox>
                    </Row>
                    <Row>
                      <Checkbox value="services">
                        Civil 'services' (e.g. administrative or police)
                      </Checkbox>
                    </Row>
                    <Row>
                      <Checkbox value="teacher">Teacher</Checkbox>
                      <Checkbox value="other">Other</Checkbox>
                    </Row>
                  </Checkbox.Group>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={8}>
              <Col span={2}>
                <Form.Item name="guardianCheck" valuePropName="checked">
                  <Switch size="small" />
                </Form.Item>
              </Col>
              <Col span={22} offset={0}>
                <Form.Item
                  label="Guardian"
                  name="guardian"
                  tooltip="Student's guardian"
                >
                  <Checkbox.Group disabled={form['guardianCheck'] === false}>
                    <Checkbox value="mother">Mother</Checkbox>
                    <Checkbox value="father">father</Checkbox>
                    <Checkbox value="other">other</Checkbox>
                  </Checkbox.Group>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={8}>
              <Col span={2}>
                <Form.Item name="traveltimeCheck" valuePropName="checked">
                  <Switch size="small" />
                </Form.Item>
              </Col>
              <Col span={22} offset={0}>
                <Form.Item
                  label="Travel Time"
                  name="traveltime"
                  tooltip="Home to school travel time"
                >
                  <Slider
                    disabled={form['traveltimeCheck'] === false}
                    min={0}
                    max={60}
                    range
                    marks={{
                      0: '0 min',
                      15: '15 min',
                      30: '30 min',
                      60: '60 min',
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={8}>
              <Col span={2}>
                <Form.Item name="studytimeCheck" valuePropName="checked">
                  <Switch size="small" />
                </Form.Item>
              </Col>
              <Col span={22} offset={0}>
                <Form.Item
                  label="Study Time"
                  name="studytime"
                  tooltip="Weekly study time"
                >
                  <Slider
                    disabled={form['studytimeCheck'] === false}
                    min={0}
                    max={10}
                    range
                    marks={{
                      0: '0 hour',
                      2: '2 hours',
                      5: '5 hours',
                      10: '10 hours',
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={8}>
              <Col span={2}>
                <Form.Item name="paidCheck" valuePropName="checked">
                  <Switch size="small" />
                </Form.Item>
              </Col>
              <Col span={22} offset={0}>
                <Form.Item
                  label="Paid Class"
                  name="paid"
                  tooltip="Extra paid classes within the course subject"
                >
                  <Checkbox.Group disabled={form['paidCheck'] === false}>
                    <Checkbox value="yes">yes</Checkbox>
                    <Checkbox value="no">no</Checkbox>
                  </Checkbox.Group>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={8}>
              <Col span={2}>
                <Form.Item name="nurseryCheck" valuePropName="checked">
                  <Switch size="small" />
                </Form.Item>
              </Col>
              <Col span={22} offset={0}>
                <Form.Item
                  label="Nursery School"
                  name="nursery"
                  tooltip="Attended nursery school"
                >
                  <Checkbox.Group disabled={form['nurseryCheck'] === false}>
                    <Checkbox value="yes">yes</Checkbox>
                    <Checkbox value="no">no</Checkbox>
                  </Checkbox.Group>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={8}>
              <Col span={2}>
                <Form.Item name="internetCheck" valuePropName="checked">
                  <Switch size="small" />
                </Form.Item>
              </Col>
              <Col span={22} offset={0}>
                <Form.Item
                  label="Internet Access"
                  name="internet"
                  tooltip="Internet access at home"
                >
                  <Checkbox.Group disabled={form['internetCheck'] === false}>
                    <Checkbox value="yes">yes</Checkbox>
                    <Checkbox value="no">no</Checkbox>
                  </Checkbox.Group>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={8}>
              <Col span={2}>
                <Form.Item name="absencesCheck" valuePropName="checked">
                  <Switch size="small" />
                </Form.Item>
              </Col>
              <Col span={22} offset={0}>
                <Form.Item label="Absences" name="absences">
                  <Slider
                    disabled={form['absencesCheck'] === false}
                    range
                    min={0}
                    max={100}
                    marks={{
                      0: '0 time',
                      100: '100 times',
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={8}>
              <Col span={2}>
                <Form.Item name="G1Check" valuePropName="checked">
                  <Switch size="small" />
                </Form.Item>
              </Col>
              <Col span={22} offset={0}>
                <Form.Item
                  label="G1"
                  name="G1"
                  tooltip="First period grade (from 0 to 20)"
                >
                  <Slider
                    disabled={form['G1Check'] === false}
                    range
                    min={0}
                    max={20}
                    marks={{
                      0: '0 grade',
                      20: '20 grade',
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={8}>
              <Col span={2}>
                <Form.Item name="G2Check" valuePropName="checked">
                  <Switch size="small" />
                </Form.Item>
              </Col>
              <Col span={22} offset={0}>
                <Form.Item
                  label="G2"
                  name="G2"
                  tooltip="Second period grade (from 0 to 20)"
                >
                  <Slider
                    disabled={form['G2Check'] === false}
                    range
                    min={0}
                    max={20}
                    marks={{
                      0: '0 grade',
                      20: '20 grade',
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Apply
              </Button>
              <Button htmlType="button">Reset</Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </Card>
  );
};

export default CFBrick;
