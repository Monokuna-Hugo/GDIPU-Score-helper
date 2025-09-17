import { Layout } from 'antd';
import { BarChartOutlined, UserOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import React, { Component } from 'react';
const { Sider } = Layout;
const items = [
    {
        key: '1',
        icon: <BarChartOutlined />,
        label: 'Chart',
    },
    {
        key: '2',
        icon: <UserOutlined />,
        label: 'User',
    }
];

const siderStyle = {
    background: '#fff',
    borderRight: '1px solid #eee',
    paddingTop: '20px',
    width: '25%',
};

class mySider extends Component {
    render() {
        return (
            <Sider style={siderStyle}>
                <Menu items={items} />
            </Sider>
        )
    }
}

export default mySider;