import React from 'react';
import { Card, Select, Tooltip as ATooltip, Button } from 'antd';
import './index.less';
import { InfoCircleOutlined, SettingOutlined } from '@ant-design/icons';

const { Option } = Select;

const CFBrick: React.FC = () => {
  const CFHeadExtra = (
    <div className="cf-header-extra">
      <div className="extra-text">Desire Grade: </div>
      <Select className="extra-select">
        <Option value="A">A</Option>
        <Option value="B">B</Option>
        <Option value="C">C</Option>
        <Option value="D">D</Option>
      </Select>
      <Button type="text" className="setting-btn">
        <SettingOutlined className="setting-icon" />
      </Button>
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
    ></Card>
  );
};

export default CFBrick;
