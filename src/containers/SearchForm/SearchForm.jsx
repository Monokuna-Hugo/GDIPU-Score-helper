import { SearchOutlined } from '@ant-design/icons';
import { Form, Input, DatePicker, Button } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import React from 'react'

const { RangePicker } = DatePicker;
const SearchForm = () => {
    return (
        <div style={{ marginBottom: '16px' }}>

            <Form layout='inline'>
                <FormItem label="活动名称" name="activityName">
                    <Input placeholder="填写活动名称" />
                </FormItem>
                <FormItem label="活动时间" name="occurrenceTime">
                    <DatePicker placeholder='填写活动时间' />
                </FormItem>
                <FormItem>
                    <Button icon={<SearchOutlined />} type="primary" iconPosition='start' />
                </FormItem>
            </Form>
        </div>
    )
}

export default SearchForm;