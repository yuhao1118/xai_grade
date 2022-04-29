import React, { useEffect, useState } from 'react';
import { Card, Divider, Radio, Tooltip as ATooltip } from 'antd';
import {
  UpCircleFilled,
  DownCircleFilled,
  InfoCircleOutlined,
} from '@ant-design/icons';
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
// import { getSHAPExplanation as _getSHAPExplanation } from '@src/__mock__/shap';
import { getSHAPExplanation } from '@src/api';
import './index.less';
import { useCommonContext } from '@src/context/common';
import { accumSumArray } from '@src/utils/common';

const TextShap: React.FC<{
  featureName: string;
  featureValue: string | number;
  shapValue: number;
}> = ({ featureName, featureValue, shapValue }) => {
  let _shapValue = Math.abs(shapValue * 100).toFixed(2);
  return (
    <div className="shap-text-container">
      <div className="shap-text">
        <div className="shap-text-title">{featureName}</div>
        <div className="shap-text-content">
          {featureName} being {featureValue}{' '}
          {shapValue > 0 ? 'increases' : 'decreases'} the prediction probability
          by {_shapValue}%.
        </div>
      </div>

      <div className={`indicator ${shapValue > 0 ? 'red' : 'green'}`}>
        {shapValue > 0 ? <UpCircleFilled /> : <DownCircleFilled />}
        {_shapValue}%
      </div>
    </div>
  );
};

const SHAPBrick: React.FC = () => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  const options = {
    indexAxis: 'y' as const,
    responsive: true,
    scales: {
      xAxes: { beginAtZero: false },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const [data, setData] = useState<ChartData<'bar', number[], unknown>>({
    labels: [],
    datasets: [],
  });

  const {
    state: { queryInstance, prediction },
  } = useCommonContext();

  const [chartType, setChartType] = useState<'bar' | 'waterfall'>('bar');
  const [shapValues, setShapValues] = useState<{
    base_value: number;
    pred_class: string;
    values: number[];
    features: string[];
    all_features: string[];
    data: any;
  }>({
    base_value: 0,
    pred_class: '--',
    values: [],
    features: [],
    all_features: [],
    data: {},
  });

  useEffect(() => {
    getSHAPExplanation(queryInstance).then((res: any) => {
      setShapValues(res);
    });
  }, [queryInstance]);

  useEffect(() => {
    const features = (shapValues.features as string[]).map((item, index) =>
      shapValues.data[index] != null
        ? `${item}=${shapValues.data[index]}`
        : item
    );
    const bgColors = (shapValues.values as number[]).map((item) =>
      item > 0 ? 'rgba(255, 99, 132, 0.5)' : 'rgba(53, 162, 235, 0.5)'
    );
    let dataset = {
      labels: [] as string[],
      datasets: [] as any[],
    };

    if (chartType === 'bar') {
      dataset = {
        labels: features,
        datasets: [
          {
            label: 'Shap Values',
            data: shapValues.values,
            backgroundColor: bgColors,
          },
        ],
      };
    } else if (chartType === 'waterfall') {
      const accumSHAPValues = accumSumArray(
        [shapValues['base_value']].concat([...shapValues.values].reverse())
      );

      const topSHAPValues = accumSHAPValues
        .slice(1, accumSHAPValues.length)
        .reverse();
      const bottomSHAPValues = accumSHAPValues
        .slice(0, accumSHAPValues.length - 1)
        .reverse();

      dataset = {
        labels: features,
        datasets: [
          {
            label: 'Shap Values',
            data: topSHAPValues.map((item, index) => [
              bottomSHAPValues[index],
              item,
            ]),
            backgroundColor: bgColors,
          },
        ],
      };
    }
    setData(dataset);
  }, [shapValues, chartType]);

  return (
    <Card
      // title="Factors that contribute to student grade"
      title={
        <div>
          <ATooltip title="The SHAP explains WHY the model give such prediction probability. The value of each feature indicates the postive/negative impact on prediction probability.">
            <InfoCircleOutlined className="icon" />
          </ATooltip>
          Factors that contribute to student grade
        </div>
      }
      className="shap-brick"
    >
      <div className="shap-left">
        <Radio.Group
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}
          onChange={(e) => {
            setChartType(e.target.value);
          }}
          defaultValue="bar"
        >
          <Radio value={'bar'}>Bar chart</Radio>
          <Radio value={'waterfall'}>Waterfall chart</Radio>
        </Radio.Group>
        {chartType === 'bar' && <Bar options={options} data={data} />}
        {chartType === 'waterfall' && (
          <Bar
            options={
              {
                ...options,
                plugins: {
                  legend: {
                    display: false,
                  },
                  tooltip: {
                    display: false,
                    callbacks: {
                      label: (tooltipItem: any) => {
                        return tooltipItem.raw[1] - tooltipItem.raw[0];
                      },
                    },
                  },
                },
              } as any
            }
            data={data}
          />
        )}
      </div>
      <div className="shap-right">
        <div className="shap-general">
          • The probabilty of being Grade {shapValues['pred_class']} is{' '}
          {(Math.max(...prediction.predictionProb) * 100).toFixed(2)}% whereas
          the average probability on this grade is{' '}
          {(shapValues['base_value'] * 100).toFixed(2)}%.
        </div>
        <div className="shap-general">
          • {shapValues['all_features'][0]}, {shapValues['all_features'][1]} and{' '}
          {shapValues['all_features'][2]} are the three most important features.
        </div>
        <div className="shap-general">
          • {shapValues['all_features'][shapValues['all_features'].length - 3]},{' '}
          {shapValues['all_features'][shapValues['all_features'].length - 2]}{' '}
          and{' '}
          {shapValues['all_features'][shapValues['all_features'].length - 1]}{' '}
          are the three least important features.
        </div>
        <Divider />
        <TextShap
          featureName={shapValues['all_features'][0]}
          featureValue={(queryInstance as any)[shapValues['all_features'][0]]}
          shapValue={shapValues['values'][0]}
        />
        <TextShap
          featureName={shapValues['all_features'][1]}
          featureValue={(queryInstance as any)[shapValues['all_features'][1]]}
          shapValue={shapValues['values'][1]}
        />
        <TextShap
          featureName={shapValues['all_features'][2]}
          featureValue={(queryInstance as any)[shapValues['all_features'][2]]}
          shapValue={shapValues['values'][2]}
        />
      </div>
    </Card>
  );
};

export default SHAPBrick;
