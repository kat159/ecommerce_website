import { DeleteOutlined, EditOutlined, PlusCircleFilled, PlusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import React from 'react'
import MyCRUDDataPresentationHandler from '../../components/RelationalCRUD/MyCRUDDataDisplayerHandler'

import MyEditableTree from '../../components/Tree/MyEditableTree'
import { useState, useEffect } from 'react'
import productService from '../../services/dbms-product/index'
import { Input } from 'antd';
import { Radio } from 'antd';
import MyImageUploader from '../../components/Form/MyImageUploader';
import { saveCategoryIcon } from '../../services/third-party-service/googleCloudStorage';
import constant from '../../utils/constant';
import MyCRUDTagGroup from '../../components/Form/MyCRUDTagGroup';
import RelationalCRUDEntry from '../../components/RelationalCRUD/RelationalCRUDEntry'
import googleCloudStorage from '../../services/third-party-service/googleCloudStorage'


export default function Test() {
    /**
     * tree / table / tag-group 本质上都是一种CRUD，
     *      1. 如果没有primaryId， 就通过service.fetch() 获取 dataList 表现； 如果传入了primaryId，就service.fetch(primaryId)获取dataList，
     *      2. 每个dataList中的元素都是一个node/record，每个node/record边上都有insert/edit/delete按钮，
     *          当点击insert/edit，就获取点击的node/record的id，然后通过service.fetch(id)获取该node/record的详细信息，
     *          然后弹出form，form中的字段都是editableFields，点击save后，通过service.update(id, data)更新该node/record，
     *      3. 此时如果form的editableFields中有relationalField，**就再创建一个MyRelationCRUD**，（通常是tag-group）， 
     *          传入primaryId到MyRelationCRUD，MyRelationCRUD就会通过service.fetch(primaryId)获取dataList，
     *          **然后跳回到step1，直到没有relationalField为止**，
        
            TODO: 上面解决了ONE_TO_MANY， many_to_many怎么办？
    *                
    */
    const catogoryService = productService.categoryController;
    const attrGroupService = productService.attributeGroupController;
    const attrService = productService.attributeController;
    // props example for tree
    const displayerProps = {
        type: constant.TREE,  // table / tag-group / ...
        entityName: 'Category',
        // props for specific type(tree)
        titleFieldName: 'name', // the response data field name that will be displayed as the title of the node  
        childrenFieldName: 'children',      // the response data(database) field name that will be displayed as the children of the node
        idFieldName: 'id',   // the reponse data field name that will be displayed as the id of the node
        parantIdFieldName: 'parentId',  // the reponse data(database) field name that will be displayed as the parentId of the node
        levelFieldName: 'level', // the reponse data(database) field name that will be displayed as the level of the node
        sortOrderFieldName: 'sort',
        maxLevel: 3,
        service: { // the service interface that provides the CRUD operations
            get: catogoryService.get10,
            getAll: catogoryService.getAll,
            addAll: catogoryService.addAll10,
            updateAll: catogoryService.updateAll10,
            removeAll: catogoryService.removeAll10,
        },
        // insertIconRender: (props) => <PlusOutlined {...props} />,       // Optional, the icon for insert
        // editIconRender: (props) => <EditOutlined {...props} />,         // Optional, the icon for edit
        // deleteIconRender: (props) => <DeleteOutlined {...props} />,       // Optional, the icon for delete
        bulkEdit: false,
        fakeSubmit: false,

        formProps: {
            type: constant.POP_FORM,
            // title: 'Category',  // the title of the form
        },
        formType: constant.POP_FORM,
        editableFields: [       // the fields props for the editing form
            {
                // subTitle: 'Category Info',  // the title of the field group
                dataFieldName: 'name',  // the response data(database) field name that will be displayed as the title of the node
                label: 'Name', // the label of the field
                type: constant.TEXT,  // type of the compoent
            },
            {
                dataFieldName: 'icon',  // the response data(database) field name that will be displayed as the title of the node
                label: 'Icon', // the label of the field
                type: constant.ICON,  // type of the compoent
                singleFile: true,
                addFile: googleCloudStorage.addBrandLogo,// **required**, categoryIcon and brandIcon has different upload path
                deleteFile: googleCloudStorage.deleteFile
            },
            {
                // dataFieldName: '-2',
                label: 'Attribute Groups',
                shouldDisplay: (record) => record.level === 3,
                isRelationalData: true,

                displayerProps: {
                    type: constant.TAG_GROUP,
                    // type: constant.LIST,
                    entityName: 'Attribute Groups',
                    relationship: constant.ONE_TO_MANY,
            
                    titleFieldName: 'name',
                    sortOrderFieldName: 'sort',
            
                    fakeSubmit: true,
                    service: {
                        get: attrGroupService.get12,
                        getAll: catogoryService.getAllAttrGroup,
                        addAll: catogoryService.addAllAttrGroup,
                        updateAll: attrGroupService.updateAll12,
                        removeAll: attrGroupService.removeAll12,
                    },
            
                    formType: constant.POP_FORM,
                    editableFields: [
                        {
                            dataFieldName: 'name',  // the response data(database) field name that will be displayed as the title of the node
                            label: 'Name', // the label of the field
                            type: constant.TEXT,  // type of the compoent
                        },
                        // {
                        //     dataFieldName: 'icon',  // the response data(database) field name that will be displayed as the title of the node
                        //     label: 'Icon', // the label of the field
                        //     type: constant.ICON,  // type of the compoent
                        //     entityName: 'Attribute Groups',
                        //     singleFile: true,
                        //     addFile: googleCloudStorage.addBrandLogo,// **required**, categoryIcon and brandIcon has different upload path
                        //     deleteFile: googleCloudStorage.deleteFile
                        // },
                        {
                            dataFieldName: 'sort',
                            label: 'Sort Order',
                            type: constant.POSTIVE_INTEGER,
                        },
                        // {
                        //     label: 'Attribute Groups',
                        //     shouldDisplay: (record) => record.level === 3,
                        //     isRelationalData: true,
            
                        // }
                    ],
                },
            }
        ],
    }
    const attibuteDisplayerProps = {
        type: constant.TAG_GROUP,
        // type: constant.LIST,
        entityName: 'Attributes',
        relationship: constant.ONE_TO_MANY,

        titleFieldName: 'name',
        sortOrderFieldName: 'sort',

        fakeSubmit: true,
        service: {
            get: attrService.get13,
            getAll: attrGroupService.getAllAttribute,
            addAll: attrGroupService.addAllAttribute,
            updateAll: attrService.updateAll13,
            removeAll: attrService.removeAll13,
        },

        formType: constant.POP_FORM,
        editableFields: [
            {
                dataFieldName: 'name',  // the response data(database) field name that will be displayed as the title of the node
                label: 'Name', // the label of the field
                type: constant.TEXT,  // type of the compoent
            },
            {
                dataFieldName: 'searchStatus',
                label: 'Can be filter to search',
                type: constant.POSTIVE_INTEGER,
            },
            {
                dataFieldName: 'selective',
                label: 'Is Selective Value',
                type: constant.POSTIVE_INTEGER,
            },
            {
                dataFieldName: 'selectableValueList',
                label: 'Selective Value List',
                type: constant.POSTIVE_INTEGER,
            },
            {
                dataFieldName: 'type',
                label: 'Attribute Type',
                type: constant.POSTIVE_INTEGER,
            },
            {
                dataFieldName: 'status',
                label: 'Effective Status',
                type: constant.POSTIVE_INTEGER,
            },
        ],
    }
    const attrGroupDisplayerProps = {
        type: constant.TAG_GROUP,
        // type: constant.LIST,
        entityName: 'Attribute Groups',
        relationship: constant.ONE_TO_MANY,

        titleFieldName: 'name',
        sortOrderFieldName: 'sort',

        fakeSubmit: true,
        service: {
            get: attrGroupService.get12,
            getAll: catogoryService.getAllAttrGroup,
            addAll: catogoryService.addAllAttrGroup,
            updateAll: attrGroupService.updateAll12,
            removeAll: attrGroupService.removeAll12,
        },

        formType: constant.POP_FORM,
        editableFields: [
            {
                dataFieldName: 'name',  // the response data(database) field name that will be displayed as the title of the node
                label: 'Name', // the label of the field
                type: constant.TEXT,  // type of the compoent
            },
            {
                dataFieldName: 'sort',
                label: 'Sort Order',
                type: constant.POSTIVE_INTEGER,
            },
            {
                label: 'Attribute Groups',
                isRelationalData: true,
                
                displayerProps: attibuteDisplayerProps,
            }
        ],
    }
    const categoryDisplayerProps = {
        type: constant.TREE,  // table / tag-group / ...
        entityName: 'Category',
        // props for specific type(tree)
        titleFieldName: 'name', // the response data field name that will be displayed as the title of the node  
        childrenFieldName: 'children',      // the response data(database) field name that will be displayed as the children of the node
        idFieldName: 'id',   // the reponse data field name that will be displayed as the id of the node
        parantIdFieldName: 'parentId',  // the reponse data(database) field name that will be displayed as the parentId of the node
        levelFieldName: 'level', // the reponse data(database) field name that will be displayed as the level of the node
        sortOrderFieldName: 'sort',
        maxLevel: 3,
        service: { // the service interface that provides the CRUD operations
            get: catogoryService.get10,
            getAll: catogoryService.getAll,
            addAll: catogoryService.addAll10,
            updateAll: catogoryService.updateAll10,
            removeAll: catogoryService.removeAll10,
        },
        // insertIconRender: (props) => <PlusOutlined {...props} />,       // Optional, the icon for insert
        // editIconRender: (props) => <EditOutlined {...props} />,         // Optional, the icon for edit
        // deleteIconRender: (props) => <DeleteOutlined {...props} />,       // Optional, the icon for delete
        bulkEdit: false,
        fakeSubmit: false,

        formProps: {
            type: constant.POP_FORM,
            // title: 'Category',  // the title of the form
        },
        formType: constant.POP_FORM,
        editableFields: [       // the fields props for the editing form
            {
                // subTitle: 'Category Info',  // the title of the field group
                dataFieldName: 'name',  // the response data(database) field name that will be displayed as the title of the node
                label: 'Name', // the label of the field
                type: constant.TEXT,  // type of the compoent
            },
            {
                dataFieldName: 'icon',  // the response data(database) field name that will be displayed as the title of the node
                label: 'Icon', // the label of the field
                type: constant.ICON,  // type of the compoent
                singleFile: true,
                addFile: googleCloudStorage.addBrandLogo,// **required**, categoryIcon and brandIcon has different upload path
                deleteFile: googleCloudStorage.deleteFile
            },
            {
                // dataFieldName: '-2',
                label: 'Attribute Groups',
                shouldDisplay: (record) => record.level === 3,
                isRelationalData: true,

                displayerProps: attrGroupDisplayerProps,
            }
        ],
    }
    
    return (
        RelationalCRUDEntry(categoryDisplayerProps)
    )
}
