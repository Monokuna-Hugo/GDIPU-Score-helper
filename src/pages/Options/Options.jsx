import React, { useState, useEffect } from 'react';
import { Flex, Layout, Statistic, Typography } from 'antd';
import { HashRouter as Router } from 'react-router-dom';
import MySider from '../../containers/MySider/MySider';
import AppRoutes from '../../containers/Routes/AppRoutes';

const { Header, Footer, Content } = Layout;
const { Title } = Typography;
const { Timer } = Statistic;

const headerStyle = {
  paddingInline: '20px',
  background: '#fff',
  color: 'unset',
  marginBottom: '1px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const contentStyle = {
  padding: '20px',
  background: 'linear-gradient(to right, #fefefe, #fff)',
  minHeight: 'calc(100vh - 64px - 64px)', // 减去header和footer的高度
};

const footerStyle = {
  textAlign: 'center',
  color: '#fff',
  backgroundColor: '#4096ff',
  height: '64px',
  lineHeight: '64px',
};

const layoutStyle = {
  minHeight: '100vh',
};

const titleStyle = {
  color: 'black',
  fontSize: '18px',
  marginLeft: '20px',
};

const headerContentStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  height: '64px',
};

const TimerStyle = {
  fontSize: '14px',
  fontWeight: 'bold',
  color: 'black',
}

const Options = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const Timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(Timer)
  }, []);

  const formatTime = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes().toString().padStart(2, '0');
    const second = date.getSeconds().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }

  return (
    <Router>
      <Layout style={layoutStyle}>
        <MySider />
        <Layout>
          <Header style={headerStyle}>
            <div className='header-content' style={headerContentStyle}>
              <Title className='header-title' style={titleStyle}>智慧3.0助手</Title>
            </div>
            <div style={TimerStyle}>
              {formatTime(currentTime)}
            </div>
          </Header>
          <Content style={contentStyle}>
            <AppRoutes />
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
};

export default Options;
