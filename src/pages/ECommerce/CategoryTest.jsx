import React from 'react'
import MyEditableTree from '../../components/Tree/MyEditableTree'
import { useState, useEffect } from 'react'
import productService from '../../services/ecommerce-dbms-product-service/index'
import { Input } from 'antd';
import { Radio } from 'antd';
import MyCRUDDataPresentationHandler from '../../components/RelationalCRUD/MyCRUDDataPresentationHandler';

export default function () {

    const service = productService.categoryController;

    const childrenFieldName = 'children';
    const idFieldName = 'id';
    const titleFieldName = 'name';

    const editableFields = [
        {
            dataFieldName: 'name',
            formFieldName: 'Category Name',
            parentIdFieldName: 'parentId',
            // formFieldType: 'text',
            dataEntryRender: (props) => <Radio.Group>
                <Radio value="1">Option 1</Radio>
                <Radio value="2">Option 2</Radio>
                <Radio value="3">Option 3</Radio>
            </Radio.Group>
            
        }
    ]

    return (
        <div>
            <MyCRUDDataPresentationHandler

                service={service}

                // serviceSave={serviceSave}
                // serviceUpdate={serviceUpdate}
                // serviceDelete={serviceDelete}
                // serviceGetAll={serviceGetAll}

                childrenFieldName={childrenFieldName}
                idFieldName={idFieldName}
                titleFieldName={titleFieldName}

                editableFields={editableFields}
            />
        </div>
    )
}
