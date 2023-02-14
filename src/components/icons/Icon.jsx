import {createFromIconfontCN} from '@ant-design/icons';
import './icon.less'

const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/c/font_3868496_6m0w8qge9mx.js',
});

const style = {
  fontSize: '20px',
  black: 'black'
}

export default {
  Product: (props) => <IconFont
    // className='my-iconfont'
    className={'my-click-icon'}
    type={'icon-shangpin'}
    {...props}
  />,
  Category: (props) => <IconFont className='my-iconfont' type={'icon-category'} {...props} />,
}
