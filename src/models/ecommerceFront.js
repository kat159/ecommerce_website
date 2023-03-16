import React, {useEffect, useState} from 'react';
import dbmsProduct from "@/services/dbms-product";
import {useModel} from "@/.umi/exports";
import dbmsMember from "@/services/dbms-member";
import {message} from "antd";
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

  const {initialState, loading: initStateLoading, refresh, setInitialState} = useModel('@@initialState')
  const {currentUser} = initialState || {}

  const fetchUserInfo = async () => {
    setUserLoading(true)
    if (currentUser && currentUser.username) {
      const username = currentUser.username
      console.log('categoryService', categoryService)
      console.log('memberService', memberService)
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
  };
};
