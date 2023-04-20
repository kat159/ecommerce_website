import React, {useEffect, useState} from 'react';
import dbmsProduct from "@/services/dbms-product";
import {useModel} from "@/.umi/exports";
import dbmsMember from "@/services/dbms-member";
import constant from "@/utils/constant";

const categoryService = dbmsProduct.categoryController
const memberService = dbmsMember.memberController
export default () => {
  const [userInfo, setUserInfo] = useState({});
  const [userLoading, setUserLoading] = useState(true);

  const [cart, setCart] = useState([]);
  const [cartLoading, setCartLoading] = useState(true);

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const [browseHistory, setBrowseHistory] = useState([]);
  const [browseHistoryLoading, setBrowseHistoryLoading] = useState(true);

  const [checkOutSkus, setCheckOutSkus] = useState([]);
  const [checkoutOrderUUID, setCheckoutOrderUUID] = useState(null);

  const [browseHistoryPagination, setBrowseHistoryPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    list: [],
  })
  const [browseHistoryPaginationLoading, setBrowseHistoryPaginationLoading] = useState(true)

  const {initialState, loading: initStateLoading, refresh, setInitialState} = useModel('@@initialState')
  const {currentUser} = initialState || {}

  const fetchUserInfo = async () => {
    setUserLoading(true)
    if (currentUser && currentUser.username) {
      const username = currentUser.username

      memberService.login({token:""}, {username}).then(res => {
        setUserInfo(res.data)
        setUserLoading(false)
      })
    }
  }
  useEffect(() => {
    fetchUserInfo()
  }, [initialState]);

  const fetchCart = async () => {
    if (!userInfo.username) {
      // message.error('user info not found')
      return
    }
    setCartLoading(true)
    memberService.pageCart({
      username: userInfo.username,
      params: {
        [constant.CURRENT_PAGE_STR]: 1,
        [constant.PAGE_SIZE_STR]: constant.MAX_CART_ITEM_COUNT,
      }
    }).then(res => {
      setCart(res.data.list)
      setCartLoading(false)
    })
  }
  useEffect(() => {
    fetchCart()
  }, [userInfo])

  const fetchBrowseHistoryPagination = async () => {
    if (!userInfo.username) {
      return
    }
    setBrowseHistoryLoading(true)
    const res = await memberService.pageBrowseHistory({
      username: userInfo.username,
      params: {
        [constant.CURRENT_PAGE_STR]: 1,
        [constant.PAGE_SIZE_STR]: constant.MAX_BROWSE_HISTORY_ITEM_COUNT,
      }
    })
    const pagination = res.data
    const first20SkuIds = pagination.list.map(item => item.skuId).slice(0, 20)
    const skuRes = await dbmsProduct.skuController.page({
      params: {
        ids: first20SkuIds.join(','),
      }
    })
    const skus = skuRes.data.list
    const skuMap = skus.reduce((acc, cur) => {
      acc[cur.id] = cur
      return acc
    }, {})
    pagination.list = pagination.list.filter(item => skuMap[item.skuId]).map(item => {return {...item, sku: skuMap[item.skuId]}})

    setBrowseHistoryPagination(pagination)
    setBrowseHistoryLoading(false)
  }
  useEffect(() => {

    fetchBrowseHistoryPagination()
  }, [userInfo])

  const fetchBrowseHistory = async () => {
    if (!userInfo.username) {
      // message.error('user info not found')
      return
    }
    setBrowseHistoryLoading(true)
    memberService.pageBrowseHistory({
      username: userInfo.username,
      params: {
        [constant.CURRENT_PAGE_STR]: 1,
        [constant.PAGE_SIZE_STR]: constant.MAX_BROWSE_HISTORY_ITEM_COUNT,
      }
    }).then(res => {
      setBrowseHistory(res.data.list)
      setBrowseHistoryLoading(false)
    })
  }

  return {
    userInfo,
    userLoading,
    fetchUserInfo,
    cart,
    cartLoading,
    fetchCart,
    orders,
    ordersLoading,
    checkOutSkus,
    setCheckOutSkus,
    checkoutOrderUUID,
    setCheckoutOrderUUID,

    browseHistoryPagination,
    setBrowseHistoryPagination,
    browseHistoryPaginationLoading,
  };
};
