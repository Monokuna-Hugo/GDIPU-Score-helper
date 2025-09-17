import React from 'react';
import { Flex, Layout, Typography } from 'antd';
import { Menu } from 'antd';
import MySider from '../../containers/MySider/MySider';
const { Header, Footer, Sider, Content, } = Layout;
import { BarChartOutlined, UserOutlined } from '@ant-design/icons';
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
  marginBottom: '28px',
};

const footerStyle = {
  textAlign: 'center',
  color: '#fff',
  backgroundColor: '#4096ff',
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
    <Layout style={layoutStyle}>
      <MySider />
      <Layout>
        <Header style={headerStyle}>
          <div className='header-content' style={headerContentStyle}>
            <Title className='header-title' style={titleStyle}>Ant Design</Title>
          </div>
        </Header>
        <Content style={contentStyle}>Content</Content>
        <Footer style={footerStyle}>Footer</Footer>
      </Layout>
    </Layout>
  );
};


export default Options;
