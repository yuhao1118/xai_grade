import React, { useCallback, useEffect, useState } from 'react';
import { Button, Card, InputNumber, Popover, Row, Select } from 'antd';
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
import { useCommonContext } from '@src/context/common';
import { getDataDescription, getPrediction } from '@src/api';
import { isNumber } from '@src/utils/common';
const { Option } = Select;

interface Feature {
  name: string;
  type: 'numerical' | 'categorical';
  min?: number;
  max?: number;
  values?: any[];
  classes?: string[];
}

const options: any = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
};

const parsePredictGrade = (predictGrade: string) => {
  let semantic: string = '';
  let markRange: string = '';
  switch (predictGrade) {
    case 'A':
      semantic = 'Excellent';
      markRange = '>=14';
      break;
    case 'B':
      semantic = 'Good';
      markRange = '11-13';
      break;
    case 'C':
      semantic = 'Fair';
      markRange = '8-10';
      break;
    case 'D':
      semantic = 'Poor';
      markRange = '<8';
      break;
  }

  return {
    grade: predictGrade,
    semantic,
    markRange,
  };
};

const PopOverContent: React.FC<{
  feature: Feature;
}> = ({ feature }) => {
  if (!feature) return <></>;

  let classes = feature.classes!;

  if (feature.type === 'numerical') {
    const tempClasses = [];

    for (var i = 0; i < feature.classes!.length - 1; i++) {
      tempClasses.push(`${feature.classes![i]}-${feature.classes![i + 1]}`);
    }

    classes = tempClasses;
  }

  return (
    <Bar
      options={{
        ...options,
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: feature.name,
          },
        },
      }}
      data={{
        labels: classes,
        datasets: [
          {
            label: feature.name,
            data: feature.values,
            backgroundColor: 'rgba(154, 208, 245)',
          },
        ],
      }}
    />
  );
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

  const {
    state: { queryInstance },
    setPrediction: setContextPrediction,
  } = useCommonContext();
  const [prediction, setPrediction] = useState<{
    prediction: string;
    predictionProb: number[];
    accuracy: number;
  }>({
    prediction: '--',
    predictionProb: [0, 0, 0, 0],
    accuracy: NaN,
  });

  const [features, setFeatures] = useState<{
    [key: string]: Feature;
  }>({});

  useEffect(() => {
    getDataDescription().then((res: any) => {
      setFeatures(res);
    });
  }, []);

  useEffect(() => {
    if (queryInstance !== null) {
      console.log('queryInstance', JSON.stringify(queryInstance));
      getPrediction(queryInstance).then((res: any) => {
        setPrediction(res);
        setContextPrediction(res);
      });
    }
  }, [queryInstance]);

  return (
    <Card title="Information and Results" className="data-brick">
      <div className="information">
        {queryInstance &&
          Object.entries(queryInstance).map(([key, value]) => {
            return (
              <div className="data-row" key={key}>
                <div>{key}</div>
                <Popover content={<PopOverContent feature={features[key]} />}>
                  <Button type="link" size="small">
                    {isNumber(value) ? (value as number).toFixed(2) : value}
                    <FundFilled className="icon" />
                  </Button>
                </Popover>
              </div>
            );
          })}
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
                  data: prediction.predictionProb,
                  backgroundColor: 'rgba(154, 208, 245)',
                },
              ],
            }}
          />
        </div>
        <div className="predict-content">
          <InfoCircleOutlined className="icon" />
          <div className="predict-title">G3 Grade Prediction</div>
          <div className="predict-class">
            {`${parsePredictGrade(prediction.prediction).grade}: ${
              parsePredictGrade(prediction.prediction).semantic
            }`}
          </div>
          <div className="model-info" style={{ marginTop: '10px' }}>
            Grade Range:
            {`${parsePredictGrade(prediction.prediction).markRange}`}
          </div>
          <div className="model-info">
            Probability:
            {(Math.max(...prediction.predictionProb) * 100).toFixed(2)}%
          </div>
          <div className="model-info">
            Accuracy: {(prediction.accuracy * 100).toFixed(2)}%
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DataBrick;
