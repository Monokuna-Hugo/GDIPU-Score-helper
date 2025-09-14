import React from 'react';
import './Popup.css';
import { Button, Flex, Layout, Typography } from 'antd';
import { Content, Header } from 'antd/es/layout/layout';
import { BarChartOutlined, CalendarOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';

const { Title } = Typography;
const Popup = () => {

  const onPersonCenter = () => {
    chrome.tabs.create({
      url:'https://my.gdip.edu.cn/homePage/homePage-PersonCenter'
    })
  }
  const onActivityList = () => {
    chrome.tabs.create({
      url:'https://study.gdip.edu.cn/CloudPortal/CloudSquare'
    })
  }
  const onAccessScore = () => {
    chrome.tabs.create({
      url:'https://my.gdip.edu.cn/studentIntegration-compositEassess/studentIntegration-compositEassess-AssessInforQuery'
    })
  }
  const onOverView = () => {
    chrome.tabs.create({
      url:chrome.runtime.getURL('options.html')
    })
  }

  return (
    <div className="popup">
      <Header className="App-header">
        <Title className="App-title">智慧3.0助手</Title>
      </Header>
      <Content className="App-content">
        <Flex gap="small" wrap>
          <Button type="primary" icon={<BarChartOutlined />} onClick={onOverView}>综测总览</Button>
          <Button type="primary" icon={<UserOutlined />} onClick={onPersonCenter}>个人中心</Button>
          <Button type="primary" icon={<CalendarOutlined />} onClick={onActivityList}>活动列表</Button>
          <Button type="primary" icon={<SearchOutlined />} onClick={onAccessScore}>3.0综测查询</Button>
        </Flex>
      </Content>
    </div>
  );
};

export default Popup;
