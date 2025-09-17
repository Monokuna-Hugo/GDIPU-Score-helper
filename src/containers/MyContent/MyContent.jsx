import React, { Component } from "react"
import { Flex, Splitter, Typography } from 'antd';
import DemoRadar from "../Charts/Charts";

const Desc = props => (
    <Flex justify="center" align="center" style={{ height: '100%' }}>
        <Typography.Title type="secondary" level={5} style={{ whiteSpace: 'nowrap' }}>
            {props.text}
        </Typography.Title>
    </Flex>
);

class MyContent extends Component {

    render() {
        return (
            <Splitter style={{ height: 200, boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', height: '500px' }}>
                <Splitter.Panel defaultSize="40%" min="20%" max="70%">
                    <DemoRadar />
                </Splitter.Panel>
                <Splitter.Panel>
                    <Desc text="Second" />
                </Splitter.Panel>
            </Splitter>
        )
    }
}

export default MyContent;

