import React, { useCallback, useEffect, useState } from 'react';
import { Button, Card, InputNumber, Row, Select } from 'antd';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import './index.less';
import { getData } from '@src/__mock__/data';
import Column from 'antd/lib/table/Column';
import { FundFilled, InfoCircleOutlined } from '@ant-design/icons';
const { Option } = Select;

interface Feature {
  name: string;
  type: 'numerical' | 'categorical';
  min?: number;
  max?: number;
  interval?: number;
  classes?: string[];
}

const getInputComp = (
  feature: Feature,
  onValueChange: (feature: string, value: string | number) => void
): JSX.Element => {
  if (feature.type === 'numerical') {
    return (
      <InputNumber
        min={feature.min!}
        max={feature.max!}
        defaultValue={Math.floor((feature.max! + feature.min!) / 2)}
        onChange={(value) => onValueChange(feature.name, value)}
      />
    );
  } else if (feature.type === 'categorical') {
    return (
      <Select
        defaultValue={feature.classes![0]}
        style={{ width: 120 }}
        onChange={(value) => onValueChange(feature.name, value)}
      >
        {feature.classes!.map((item) => (
          <Option key={item} value={item}>
            {item}
          </Option>
        ))}
      </Select>
    );
  }
  return <></>;
};

const DataBrick: React.FC = () => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  const options: any = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };
  const [data, setData] = useState<ChartData<'bar', number[], unknown>[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);

  const onValueChange = useCallback(
    (feature: string, value: string | number) => {
      console.log(feature, value);
    },
    []
  );

  useEffect(() => {
    getData().then((res: any) => {
      const _datasets: ChartData<'bar', number[], unknown>[] = res.map(
        (resItem: any) => {
          const bgColors = (resItem.values as number[]).map(
            () => 'rgba(53, 162, 235, 0.5)'
          );

          let labels = null;
          if (resItem.type === 'numerical') {
            labels = [];
            for (let i = 0; i < resItem.classes.length - 1; i++) {
              labels.push(`${resItem.classes[i]}-${resItem.classes[i + 1]}`);
            }
          } else if (resItem.type === 'categorical') {
            labels = resItem.classes;
          }

          const dataset = {
            labels: resItem.classes,
            datasets: [
              {
                label: resItem.name,
                data: resItem.values,
                backgroundColor: 'rgba(154, 208, 245)',
              },
            ],
          };

          return dataset;
        }
      );

      setFeatures(res);
      setData(_datasets);
    });
  }, []);

  return (
    <Card title="Information and Results" className="data-brick">
      <div className="information">
        <div className="data-row">
          <div>Age</div>
          <Button type="link" size="small">
            32
            <FundFilled className="icon" />
          </Button>
        </div>
        <div className="data-row">
          <div>Age</div>
          <Button type="link" size="small">
            32
            <FundFilled className="icon" />
          </Button>
        </div>
        <div className="data-row">
          <div>Age</div>
          <Button type="link" size="small">
            32
            <FundFilled className="icon" />
          </Button>
        </div>
      </div>
      <div className="prediction">
        <div className="chart">
          <Bar
            options={options}
            data={{
              labels: ['Grade D', 'Grade C', 'Grade B', 'Grade A'],
              datasets: [
                {
                  label: 'Grade class',
                  data: [0.09, 0.97, 0.34, 0.21],
                  backgroundColor: 'rgba(154, 208, 245)',
                },
              ],
            }}
          />
        </div>
        <div className="predict-content">
          <InfoCircleOutlined className="icon" />
          <div className="predict-title">G3 Grade Prediction</div>
          <div className="predict-class">C</div>
          <div className="model-info">Probability: 94.9%</div>
          <div className="model-info">Confidence: 67.7%</div>
        </div>
      </div>
      {/* {data.map((item, index) => (
        <Row>
          <Card
            size="small"
            title={features.length > 0 ? features[index].name : ''}
            extra={
              features.length > 0
                ? getInputComp(features[index], onValueChange)
                : ''
            }
            style={{ width: 300 }}
          >
            <Bar options={options} data={item} />
          </Card>
        </Row>
      ))} */}
    </Card>
  );
};

export default DataBrick;
