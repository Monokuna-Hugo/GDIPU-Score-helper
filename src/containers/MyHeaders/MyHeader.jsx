import { Layout, Switch, Typography } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
const { Header, Footer, Content } = Layout;
const { Title } = Typography;

const headerStyle = {
    paddingInline: '20px',
    background: '#fff',
    color: 'unset',
    marginBottom: '1px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
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

const myHeader = () => {
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
        <Header style={headerStyle}>
            <div className='header-content' style={headerContentStyle}>
                <Title className='header-title' style={titleStyle}>智慧3.0助手</Title>
            </div>
            <div style={TimerStyle}>
                {formatTime(currentTime)}
            </div>
        </Header>
    )

}

export default myHeader;