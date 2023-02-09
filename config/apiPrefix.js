const GATEWAY = 'http://localhost:88/api'

const withGatewayPrefix = (url) => {
    return GATEWAY + url;
}

export default {
    gateway: GATEWAY,
    product: {
        category: withGatewayPrefix('/product/category'),
    }
}
