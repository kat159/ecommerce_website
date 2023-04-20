import React from 'react'
import {LeftCircleOutlined, MinusCircleOutlined, PlusOutlined, RightCircleOutlined} from "@ant-design/icons";
import {
  Form,
  Divider,
  Button,
  Select,
  Input,
  Switch,
  Upload,
  Tooltip,
  Typography,
  Space,
  Checkbox,
  Carousel, Cascader
} from "antd";
import {useForm} from 'antd/es/form/Form';
import {useEffect} from 'react';
import {sum} from 'lodash';
import ProductGenerate from "@/generator/product_generate/ProductGenerate";
import MyImage from "@/components/DataDisplay/MyImage";
import 'react-image-gallery/styles/css/image-gallery.css';
// import 'slick-carousel/slick/slick.css'
// import "slick-carousel/slick/slick-theme.css";
import FitSize from "@/components/DataDisplay/MyImage/FitSize";
import dbmsProduct from "@/services/dbms-product";
import dbmsMember from "@/services/dbms-member";
import axios from "axios";
import Loading from "@/pages/Loading";
import myFormUtils from "@/utils/myFormUtils";

const options = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
          },
          {
            value: 'xiasha',
            label: 'Xia Sha',
            disabled: true,
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua men',
          },
        ],
      },
    ],
  },
];
const onChange = (value, selectedOptions) => {
  console.log(value, selectedOptions);
};
const filter = (inputValue, path) =>
  path.some((option) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
const App = () => (
  <Cascader
    options={options}
    onChange={onChange}
    placeholder="Please select"
    showSearch={{
      filter,
    }}
    onSearch={(value) => console.log(value)}
  />
);
export default function Demo() {
  const [form] = useForm()
  const [data, setData] = React.useState({
    a: 'a',
    b: 'b',
    c1: {
      c2: 'c2',
    }
  })
  useEffect(() => {
    form.setFieldsValue(data)
  }, [])
  const [value, setValue] = React.useState(
    [1, 2].map(v => v + 1)
  )
  const [selected, setSelected] = React.useState(null)
  useEffect(() => {
    setSelected('a')
  }, [])

  return (
    <div>
      <ProductGenerate/>
      <Loading/>
      <Cascader
        options={options
          // [
          //   {
          //     value: 'a',
          //     label: 'a',
          //     children: [
          //       {
          //         value: 'a1',
          //         label: 'a1',
          //       }
          //     ]
          //   },
          //   {
          //     value: 'b',
          //     label: 'b',
          //   }
          // ]
        }
        size={'small'}
        style={{width: '100px'}}
        onChange={value => {
          console.log(value)
        }}
        displayRender={(labels) => labels[labels.length - 1]}
        showSearch={{
          // filter: (inputValue, path) => {
          //   print('inputValue', inputValue, 'path', path)
          //   return path.some((option) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
          //   // return path.length > 1 && path[1].value !== path[0].value && path[1].label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
          // },
          filter: (inputValue, path) => {

            return path.some((option) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1)
          }

        }}
      />
      <App/>
      <Form
        form={form}
        onFinish={values => {

        }}
      >
        <Form.Item
          name={['1', 'name']}
          label="1-name"
          rules={[{required: true, message: 'Please input your a!'}]}
          hidden={true}
        >
          <Input/>
        </Form.Item>
      </Form>
      <Button
        onClick={() => {
          const check = async () => {
            const path = ['1']
            const data = await myFormUtils.validateAndScrollToError(form, path)

            // const pathList = form.getFieldInstance(path)

            // const data = await form.validateFields(path)

          }
          check()
        }}
      >Submit</Button>
    </div>

  );
}
