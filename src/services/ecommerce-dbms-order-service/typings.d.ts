declare namespace API {
  type getParams = {
    id: number;
  };

  type getParams = {
    id: number;
  };

  type getParams = {
    id: number;
  };

  type getParams = {
    id: number;
  };

  type getParams = {
    id: number;
  };

  type getParams = {
    id: number;
  };

  type getParams = {
    id: number;
  };

  type getParams = {
    id: number;
  };

  type OrderDto = {
    id?: number;
    memberId?: number;
    orderSn?: string;
    couponId?: number;
    createTime?: string;
    memberUsername?: string;
    totalAmount?: number;
    payAmount?: number;
    freightAmount?: number;
    discountAmountPromotion?: number;
    discountAmountRewardPoint?: number;
    discountAmountCoupon?: number;
    discountAmountAdmin?: number;
    paymentMethod?: number;
    paymentApp?: number;
    status?: number;
    deliveryCompany?: string;
    deliveryTrackingNumber?: string;
    autoConfirmDay?: number;
    integration?: number;
    membershipPoint?: number;
    billType?: number;
    billHeader?: string;
    billContent?: string;
    billReceiverPhone?: string;
    billReceiverEmail?: string;
    receiverName?: string;
    receiverPhone?: string;
    receiverPostcode?: string;
    receiverProvince?: string;
    receiverCity?: string;
    receiverRegion?: string;
    receiverAddress?: string;
    note?: string;
    confirmStatus?: number;
    deleteStatus?: number;
    usedRewardPoint?: number;
    paymentDate?: string;
    shippingDate?: string;
    receiveDate?: string;
    commentDate?: string;
    editDate?: string;
  };

  type OrderItemDto = {
    id?: number;
    orderId?: number;
    orderSn?: string;
    productId?: number;
    productName?: string;
    productImg?: string;
    productBrand?: string;
    categoryId?: number;
    skuId?: number;
    skuName?: string;
    skuImg?: string;
    skuPrice?: number;
    skuQuantity?: number;
    skuAttributeValues?: string;
    discountAmount?: number;
    couponAmount?: number;
    rewardAmount?: number;
    paymentAmount?: number;
    giftRewardPoints?: number;
    giftMembershipPoint?: number;
  };

  type OrderOperationRecordDto = {
    id?: number;
    orderId?: number;
    operator?: string;
    date?: string;
    orderStatus?: number;
    note?: string;
  };

  type OrderReturnApplicationDto = {
    id?: number;
    orderId?: number;
    skuId?: number;
    orderSn?: string;
    date?: string;
    username?: string;
    refundAmount?: number;
    refundName?: string;
    refundTele?: string;
    status?: number;
    processDate?: string;
    skuImg?: string;
    skuName?: string;
    skuBrand?: string;
    skuAttrsVals?: string;
    skuCount?: number;
    skuPrice?: number;
    skuFinalPrice?: number;
    reason?: string;
    description?: string;
    proofImgs?: string;
    processNote?: string;
    proccessor?: string;
    consignee?: string;
    packageArriveDate?: string;
    packageNote?: string;
    consigneePhone?: string;
    consigneeAddress?: string;
  };

  type OrderReturnReasonDto = {
    id?: number;
    reasonType?: string;
    detail?: string;
    sort?: number;
    status?: number;
    date?: string;
  };

  type OrderSettingDto = {
    id?: number;
    promotionOrderTtl?: number;
    generalOrderTtl?: number;
    overtimeAutoComment?: number;
    memberLevel?: number;
  };

  type pageParams = {
    params: Record<string, any>;
  };

  type pageParams = {
    params: Record<string, any>;
  };

  type pageParams = {
    params: Record<string, any>;
  };

  type pageParams = {
    params: Record<string, any>;
  };

  type pageParams = {
    params: Record<string, any>;
  };

  type pageParams = {
    params: Record<string, any>;
  };

  type pageParams = {
    params: Record<string, any>;
  };

  type pageParams = {
    params: Record<string, any>;
  };

  type PaymentInfoDto = {
    id?: number;
    orderSn?: string;
    orderId?: number;
    transactionSn?: string;
    totalAmount?: number;
    content?: string;
    paymentStatus?: string;
    createDate?: string;
    confirmDate?: string;
    callbackContent?: string;
    callbackTime?: string;
  };

  type RefundInfoDto = {
    id?: number;
    orderId?: number;
    refundAmount?: number;
    refundSn?: string;
    refundStatus?: number;
    refundChannel?: number;
    refundContent?: string;
  };

  type Result = {
    success?: boolean;
    total?: number;
    code?: number;
    msg?: string;
    data?: Record<string, any>;
  };
}
