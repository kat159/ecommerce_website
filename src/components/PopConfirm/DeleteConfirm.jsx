import { Popconfirm } from 'antd'
import React from 'react'

export default function DeleteConfirm(props) {

    const {children, onConfirm, itemName} = props
    return (
        <Popconfirm
            title="Are you sure to delete?"
            onConfirm={onConfirm}
            okText="Yes"
            cancelText="No"
            onCancel={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
        >
            {children}
        </Popconfirm>
    )
}
