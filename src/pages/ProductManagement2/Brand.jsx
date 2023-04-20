import {DeleteOutlined, EditOutlined, PlusCircleFilled, PlusCircleOutlined, PlusOutlined} from '@ant-design/icons'
import React from 'react'
import MyCRUDDataPresentationHandler from '../../components/RelationalCRUD/MyCRUDDataDisplayerHandler'

import MyEditableTree from '../../components/Tree/MyEditableTree'
import {useState, useEffect} from 'react'
import productManagementService from '../../services/dbms-product/index'
import {Button, Form, Input, Switch} from 'antd';
import {Radio} from 'antd';
import MyImageUploader from '../../components/Form/MyImageUploader';
import {saveCategoryIcon} from '../../services/third-party-service/googleCloudStorage';
import constant from '../../utils/constant';
import MyCRUDTagGroup from '../../components/Form/MyCRUDTagGroup';
import RelationalCRUDEntry from '../../components/RelationalCRUD3/RelationalCRUDEntry'
import googleCloudStorage from '../../services/third-party-service/googleCloudStorage'
import MyFormItem from '../../components/RelationalCRUD3/MyFormItem'
import MyForm from '../../components/RelationalCRUD3/MyForm'
import MyTableItem from '../../components/RelationalCRUD3/MyTableItem'
import {SelectTagGroup, TagSelector} from '../../components/RelationalCRUD3/ManyToManyHandler'

export default function Category() {
  const catogoryService = productManagementService.categoryController;
  const attrGroupService = productManagementService.attributeGroupController;
  const attrService = productManagementService.attributeController;
  const brandService = productManagementService.brandController;
  const categoryBrandService = productManagementService.categoryBrandController;
  const productService = productManagementService.productController;

  const [editBrandId, setEditBrandId] = useState(null)

  const CategoryDisplayerProps = {
    displayerRender: TagSelector,
    relationship: constant.MANY_TO_MANY,
    // type: constant.LIST,
    entityName: 'Category',
    foreignTitleFieldName: 'name',
    foreignIdFieldName: 'categoryId',
    sortOrderFieldName: 'sort',

    service: {
      get: categoryBrandService.get,
      getAll: brandService.getAllCategoryBrand,
      getAllOption: async () => {
        return await catogoryService.getAll({level: 3})
      },
      addAll: brandService.addCategoryBrand,
      updateAll: categoryBrandService.updateAll,
      removeAll: categoryBrandService.removeAll,
    },
  }
  const brandDisplayerProps = {
    type: constant.TABLE,  // table / tag-group / ...
    entityName: 'Brand',
    sortFieldName: 'name',
    sortOrderFieldName: 'sort',

    service: { // the service interface that provides the CRUD operations
      get: brandService.get,
      page: brandService.page,
      addAll: brandService.addAll,
      updateAll: brandService.updateAll,
      removeAll: brandService.removeAll,
    },
    // insertIconRender: (props) => <PlusOutlined {...props} />,       // Optional, the icon for insert
    // editIconRender: (props) => <EditOutlined {...props} />,         // Optional, the icon for edit
    // deleteIconRender: (props) => <DeleteOutlined {...props} />,       // Optional, the icon for delete
    fakeSubmit: false,

    formType: constant.POP_FORM,
    // actions: [
    //   {
    //     render: (text, record, index) => {
    //       return <Icons.Product key={index}
    //                             onClick={() => {
    //                               setEditBrandId(record.id)
    //                             }}
    //       />
    //     }
    //   }
    // ],
    editableFields: [
      {
        dataFieldName: 'name',
        label: "Name",
        formItemRender: MyFormItem.Input.Text,
      },
      {
        dataFieldName: 'logo',  // the response data(database) field name that will be displayed as the title of the node
        label: 'Logo', // the label of the field
        formItemRender: MyFormItem.Upload.Image,
        addFile: googleCloudStorage.addBrandLogo,// **required**, categoryIcon and brandIcon has different upload path
        deleteFile: googleCloudStorage.deleteFile,
        dataRender: (text, record, index) => {
          return <MyTableItem.Image
            key={index}
            src={text}
            alt='Brand Logo'
          />
        }
      },
      // {
      //   dataFieldName: 'sort',
      //   label: 'Order',
      //   formItemRender: MyFormItem.Input.PositiveInteger,
      // },
      {
        dataFieldName: 'description',
        label: 'Description',
        formItemRender: MyFormItem.Input.TextArea,
      },
      // {
      //   label: 'Category',
      //   isRelationalData: true,
      //   // displayerProps: CategoryDisplayerProps,
      //   dataRender: (text, record, index) => {
      //     return MyTableItem.TagGroup({values: record.categoryNames})
      //   }
      // },
      // {
      //   label: 'Product',
      //   dataRender: (text, record, index) => {
      //     return MyTableItem.TagGroup({values: record.categoryNames})
      //   }
      // }
    ],
  }

  return (
    RelationalCRUDEntry(brandDisplayerProps)
    // <div>
    //   {RelationalCRUDEntry(brandDisplayerProps)}
    //   {editBrandId &&
    //     <MyForm.PopForm title='Product' onCancel={() => setEditBrandId(null)}
    //                     onSubmit={async (values) => {
    //
    //                     }}
    //     >
    //       {MyFormItem.Input.Text({label: 'Name', name: 'name'})}
    //       {MyFormItem.Input.Text({label: 'Description', name: 'description'})}
    //     </MyForm.PopForm>
    //   }
    // </div>
  )
}
