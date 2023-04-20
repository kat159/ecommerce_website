import React from 'react'
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import { Form, Input, InputNumber, message, Switch, Upload } from 'antd';
import { useState } from 'react';
import constant from '../../utils/constant';
import { useMemo } from 'react';
import { useEffect } from 'react';
import MyCRUDDataDisplayerHandler from './MyCRUDDataDisplayerHandler';
import { MinusCircleOutlined, } from "@ant-design/icons";
import { Divider, Button, Select, } from "antd";
import MySpace from '../Layout/MySpace';


export default function MyDataEntryHandler({
    editableField,
    form,
    editingNode,
    reRender,
    ...props
}) {
    const {
        type,
        dataFieldName, // field name in the data
        label, // label displayed in the form
        rules = [{
            required: true,
            message: 'Could not be empty',
        }],
        isRelationalData,
        shouldDisplay,
        displayerProps,
        formItemRender,
        triggerRender,
    } = editableField
    
    let result;
    if (isRelationalData) {
        if (!editingNode || !shouldDisplay || shouldDisplay(editingNode)) {
            result = (
                MyCRUDDataDisplayerHandler({
                    ...displayerProps,
                    formItemLabel: label,
                    crudManager: props.crudManager,
                    primaryId: editingNode.id
                })
            )
        } else { // not display
        }
    } else if (formItemRender) {
        const itemProps = {
            label, name: dataFieldName, rules
        }
        result = formItemRender({ form, dataFieldName, 
            ...itemProps, ...props, 
            reRender: triggerRender ? reRender : () => {},
            form,
         }, form.getFieldsValue())
    } else {
        console.error('editableField must have type or isRelationalData')
    }
    return result
}