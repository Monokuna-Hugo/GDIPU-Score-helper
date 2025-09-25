import { Layout } from 'antd';
import { DashboardOutlined, TableOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import React, { Component } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const { Sider } = Layout;

// 菜单项配置
const menuItems = [
    {
        key: '/dashboard',
        icon: <DashboardOutlined />,
        label: '数据总览',
    },
    {
        key: '/charts',
        icon: <TableOutlined />,
        label: '测评记录',
    },
];

const siderStyle = {
    background: '#fff',
    borderRight: '1px solid #eee',
    paddingTop: '20px',
    width: '25%',
};

// 函数式组件版本，支持路由导航
const MySider = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleMenuClick = ({ key }) => {
        navigate(key);
    };

    return (
        <Sider style={siderStyle}>
            <Menu
                items={menuItems}
                selectedKeys={[location.pathname]}
                onClick={handleMenuClick}
                mode="inline"
            />
        </Sider>
    );
};

export default MySider;