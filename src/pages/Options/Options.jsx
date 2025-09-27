import React, { useState, useEffect } from 'react';
import { Flex, Layout, Statistic, Switch, Typography, ConfigProvider, theme } from 'antd';
import { HashRouter as Router } from 'react-router-dom';
import MySider from '../../containers/MySider/MySider';
import AppRoutes from '../../containers/Routes/AppRoutes';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import MyHeader from '../../containers/MyHeaders/MyHeader';

const { Header, Footer, Content } = Layout;



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



const Options = () => {

  const [themeValue, setThemeValue] = useState('default');

  const handleThemeChange = (checked) => {
    setThemeValue(checked);
  };


  return (
    <Router>
      <ConfigProvider
        theme={{
          algorithm: themeValue === 'default' ?  theme.defaultAlgorithm : theme.darkAlgorithm,
        }}
      >
        <Layout style={layoutStyle}>
          <MySider />
          <Layout>
            <MyHeader />
            <Content style={contentStyle}>
              <AppRoutes />
            </Content>
          </Layout>
        </Layout>
      </ConfigProvider>
    </Router>
  );
};

export default Options;
