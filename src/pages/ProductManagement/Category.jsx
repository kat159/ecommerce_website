import React from 'react'
import MyEditableTree from '../../components/Tree/MyEditableTree'
import { useState, useEffect } from 'react'
import productService from '../../services/dbms-product/index'
import { Input } from 'antd';
import { Radio } from 'antd';
import MyImageUploader from '../../components/Form/MyImageUploader';
import { saveCategoryIcon } from '../../services/third-party-service/googleCloudStorage';
import constant from '../../utils/constant';
import MyCRUDTagGroup from '../../components/Form/MyCRUDTagGroup';

export default function () {

    const catogoryService = productService.categoryController;
    const attrGroupService = productService.attributeGroupController;

    const service = {
        get: catogoryService.get,
        add: catogoryService.add10,
        update: catogoryService.update10,
        remove: catogoryService.delete10,
        forest: catogoryService.forest,
    }
    const childrenFieldName = 'children';
    const idFieldName = 'id';
    const titleFieldName = 'name';
    const parentIdFieldName = 'parentId';

    const editableFields = [
        {
            dataFieldName: 'name',
            formFieldName: 'Category Name',
            // dataRender: (text, record, index) => <>{text}</>,
            dataEntryRender: (props) => <Input />
        },
        {
            dataFieldName: '-1',
            formFieldName: 'Attribute Groups',
            isRelationalData: true,
            relationship: constant.ONE_TO_MANY,
            shouldDisplay: (record) => record.level === 3,
            service: {
                getAll: catogoryService.listAttrGroup,
                add: catogoryService.addAttrGroup,
                addAll: catogoryService.addAttrGroupList,
                update: attrGroupService.update12,
                remove: attrGroupService.delete12,

            },
            // dataRender: (text, record, index) => <>{text}</>,
            dataEntryRender: (props) => <MyCRUDTagGroup {...props} service={service} />
        }
    ]

    return (
        <div>
            <MyEditableTree
                service={service}

                childrenFieldName={childrenFieldName}
                idFieldName={idFieldName}
                titleFieldName={titleFieldName}
                parentIdFieldName={parentIdFieldName}

                editableFields={editableFields}
            />
        </div>
    )
}
