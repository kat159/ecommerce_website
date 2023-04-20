import {DeleteOutlined, EditOutlined, PlusCircleFilled, PlusCircleOutlined, PlusOutlined} from '@ant-design/icons'
import React from 'react'
import MyCRUDDataPresentationHandler from '../../components/RelationalCRUD/MyCRUDDataDisplayerHandler'

import MyEditableTree from '../../components/Tree/MyEditableTree'
import {useState, useEffect} from 'react'
import productService from '../../services/dbms-product/index'
import {Form, Input, Switch} from 'antd';
import {Radio} from 'antd';
import MyImageUploader from '../../components/Form/MyImageUploader';
import {saveCategoryIcon} from '../../services/third-party-service/googleCloudStorage';
import constant from '../../utils/constant';
import MyCRUDTagGroup from '../../components/Form/MyCRUDTagGroup';
import RelationalCRUDEntry from '../../components/RelationalCRUD3/RelationalCRUDEntry'
import googleCloudStorage from '../../services/third-party-service/googleCloudStorage'
import MyFormItem from '../../components/RelationalCRUD3/MyFormItem'
import MyForm from '../../components/RelationalCRUD3/MyForm'

export default function Category() {
  const catogoryService = productService.categoryController;
  const attrGroupService = productService.attributeGroupController;
  const attrService = productService.attributeController;

  const attibuteDisplayerProps = {
    type: constant.TAG_GROUP,
    // type: constant.LIST,
    entityName: 'Attributes',
    relationship: constant.ONE_TO_MANY,

    titleFieldName: 'name',
    sortOrderFieldName: 'sort',

    fakeSubmit: true,
    service: {
      get: attrService.get,
      getAll: attrGroupService.getAllAttribute,
      addAll: attrGroupService.addAllAttribute,
      updateAll: attrService.updateAll,
      removeAll: attrService.removeAll,
    },

    formType: constant.POP_FORM,
    editableFields: [
      {
        label: "Name",
        dataFieldName: 'name',
        formItemRender: MyFormItem.Input.Text,
      },
      {
        label: "Can be filter to search",
        dataFieldName: 'searchStatus',
        initialValue: 0,
        formItemRender: (props) =>
          MyFormItem.Select.Toggle({
            checkedValue: 1, unCheckedValue: 0, ...props
          }),
      },
      {
        // label: "Is Selective Value",
        // dataFieldName: 'selective',
        // triggerRender: true,
        // initialValue: 0,
        // formItemRender: (props) =>
        //   MyFormItem.Select.Toggle({
        //     checkedValue: 1, unCheckedValue: 0, ...props
        //   }),
      },
      {
        label: "Selective Value List",
        dataFieldName: 'selectableValueList',
        // initialValue: [null],
        formItemRender: (props, formFieldsValue, editingNode) => {
          return <MyFormItem.Input.MultiText
              {...props}
            />
        },
      },
      {
        label: "Attribute Type",
        dataFieldName: 'type',
        reverseNormalize: (valueFromApi) =>
          valueFromApi === 0 ? [1]
            : valueFromApi === 1 ? [2]
              : valueFromApi === 2 ? [1, 2]
                : [],
        normalize: (valueFromForm) =>
          valueFromForm.reduce((acc, cur) => acc + parseInt(cur), 0) - 1,
        formItemRender: (props) => <MyFormItem.Select.CheckBox
          {...props}
          options={{'Sale-related': 1, 'Specification Attribute': 2}}
          // normalize={(values) => (!values || values.length === 0) ? [] :
          //     values.reduce((acc, cur) => acc + parseInt(cur), 0) - 1}
        />,
      },
      {
        label: "Display on Product Detail Page",
        dataFieldName: 'display',
        initialValue: 0,
        formItemRender: (props) => <MyFormItem.Select.Toggle
          {...props}
        />,
      },
    ],
  }
  const attrGroupDisplayerProps = {
    type: constant.TAG_GROUP,
    // type: constant.LIST,
    entityName: 'Attribute Groups',
    titleFieldName: 'name',
    sortOrderFieldName: 'sort',

    service: {
      get: attrGroupService.get,
      getAll: catogoryService.getAllAttrGroup,
      addAll: catogoryService.addAllAttrGroup,
      updateAll: attrGroupService.updateAll,
      removeAll: attrGroupService.removeAll,
    },

    formType: constant.POP_FORM,
    editableFields: [
      {
        dataFieldName: 'name',
        label: 'Name',
        formItemRender: MyFormItem.Input.Text,
      },
      {
        dataFieldName: 'sort',
        label: 'Sort Order',
        formItemRender: MyFormItem.Input.PositiveInteger,
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
      get: catogoryService.get,
      getAll: catogoryService.getAll,
      addAll: catogoryService.addAll,
      updateAll: catogoryService.updateAll,
      removeAll: catogoryService.removeAll,
    },
    // insertIconRender: (props) => <PlusOutlined {...props} />,       // Optional, the icon for insert
    // editIconRender: (props) => <EditOutlined {...props} />,         // Optional, the icon for edit
    // deleteIconRender: (props) => <DeleteOutlined {...props} />,       // Optional, the icon for delete
    fakeSubmit: false, // submit change directly to server

    // formProps: {
    //     type: constant.POP_FORM,
    //     // title: 'Category',  // the title of the form
    // },
    formType: constant.POP_FORM,
    editableFields: [       // the fields props for the editing form
      {
        // subTitle: 'Category Info',  // the title of the field group
        label: "Name",
        dataFieldName: 'name',
        formItemRender: MyFormItem.Input.Text,
      },
      {
        dataFieldName: 'icon',  // the response data(database) field name that will be displayed as the title of the node
        label: 'Icon', // the label of the field
        formItemRender: MyFormItem.Upload.Image,
        addFile: googleCloudStorage.addBrandLogo,// **required**, categoryIcon and brandIcon has different upload path
        deleteFile: googleCloudStorage.deleteFile
      },
      {
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
