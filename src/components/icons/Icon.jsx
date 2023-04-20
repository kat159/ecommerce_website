import {createFromIconfontCN} from '@ant-design/icons';
import './icon.less'

const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/c/font_3868496_2pkvc0pz37g.js',
});

const style = {
  fontSize: '20px',
  black: 'black'
}


export const Product = (props) => <IconFont
    // className='my-iconfont'
    className={'my-click-icon'}
    type={'icon-shangpin'}
    {...props}
  />
export const Category = (props) => <IconFont className='my-iconfont' type={'icon-category'} {...props} />
export const Prime = (props) => <IconFont className='my-iconfont' type={'icon-a-VIPhuiyuanhuiyuanka'} {...props} />
export const GiftCardBonus = (props) => <IconFont className='my-iconfont' type={'icon-Gift-Card'} {...props} />
export const Project = (props) => <IconFont className='my-iconfont' type={'icon-project'} {...props} />

export const ProfileIcon = (props) => <IconFont className='my-iconfont' type={'icon-profile'} {...props} />
export const ShippingAddressIcon = (props) => <IconFont className='my-iconfont' type={'icon-genggaishouhuodizhi'} {...props} />
export const OrderIcon = (props) => <IconFont className='my-iconfont' type={'icon-order'} {...props} />
