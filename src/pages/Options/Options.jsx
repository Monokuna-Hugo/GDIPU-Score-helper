import React from 'react';
import { Flex, Layout, Typography } from 'antd';
import { HashRouter as Router } from 'react-router-dom';
import MySider from '../../containers/MySider/MySider';
import AppRoutes from '../../containers/Routes/AppRoutes';

const { Header, Footer, Content } = Layout;
const { Title } = Typography;

const headerStyle = {
  paddingInline: '20px',
  background: '#fff',
  color: 'unset',
  marginBottom: '1px',
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

const Options = () => {
  return (
    <Router>
      <Layout style={layoutStyle}>
        <MySider />
        <Layout>
          <Header style={headerStyle}>
            <div className='header-content' style={headerContentStyle}>
              <Title className='header-title' style={titleStyle}>智慧3.0助手</Title>
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
