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
import { getSHAPExplaination } from '@src/__mock__/shap';
import './index.less';

const TextShap: React.FC<{
  featureName: string;
  featureValue: string | number;
  shapValue: number;
}> = ({ featureName, featureValue, shapValue }) => {
  return (
    <div className="shap-text-container">
      <div className="shap-text">
        <div className="shap-text-title">{featureName}</div>
        <div className="shap-text-content">
          {featureName} being {featureValue}{' '}
          {shapValue > 0 ? 'increases' : 'decreases'} the prediction probability
          by {Math.abs(shapValue * 100)}%.
        </div>
      </div>

      <div className={`indicator ${shapValue > 0 ? 'red' : 'green'}`}>
        {shapValue > 0 ? <UpCircleFilled /> : <DownCircleFilled />}
        {Math.abs(shapValue * 100)}%
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
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        color: '#36A2EB',
      },
    },
  };

  const [data, setData] = useState<ChartData<'bar', number[], unknown>>({
    labels: [],
    datasets: [],
  });

  const [chartType, setChartType] = useState<'bar' | 'waterfall' | 'force'>(
    'bar'
  );

  useEffect(() => {
    getSHAPExplaination().then((res: any) => {
      const features = (res.features as string[]).map((item, index) =>
        res.data[index] != null ? `${item}=${res.data[index]}` : item
      );
      const bgColors = (res.values as number[]).map((item) =>
        item > 0 ? 'rgba(255, 99, 132, 0.5)' : 'rgba(53, 162, 235, 0.5)'
      );
      const dataset = {
        labels: features,
        datasets: [
          {
            label: 'Shap Values',
            data: res.values,
            backgroundColor: bgColors,
          },
        ],
      };
      console.log('Dataset', dataset);
      setData(dataset);
    });
  }, []);

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
        >
          <Radio value={'bar'}>Bar chart</Radio>
          <Radio value={'waterfall'}>Waterfall chart</Radio>
          <Radio value={'force'}>Force chart</Radio>
        </Radio.Group>
        {chartType === 'bar' && <Bar options={options} data={data} />}
        {chartType === 'waterfall' && <Bar options={options} data={data} />}
        {chartType === 'force' && (
          <iframe
            style={{
              display: 'block',
              width: '100%',
              height: '100%',
              border: 'none',
            }}
            title="shap_force"
            src="http://localhost:7777/api/shap_values"
          ></iframe>
        )}
      </div>
      <div className="shap-right">
        <div className="shap-general">
          The probabilty of being Grade C is 94.9%. G1, Fjob and G2 are the
          three most important factors.
        </div>
        <Divider />
        <TextShap featureName="G1" featureValue={72} shapValue={0.22} />
        <TextShap featureName="Fjob" featureValue="teacher" shapValue={0.19} />
        <TextShap featureName="G2" featureValue={68} shapValue={0.15} />
      </div>
    </Card>
  );
};

export default SHAPBrick;
