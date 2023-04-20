declare namespace API {
  type getAllParams = {
    uuid?: string;
  };

  type getOrderParams = {
    id: number;
  };

  type ManageRefundRequestDto = {
    refundRequestId?: number;
    isApproved?: number;
    username?: string;
    reason?: string;
  };

  type Order = {
    id?: number;
    uuid?: string;
    status?: 'PENDING' | 'CANCELLED' | 'PAYMENT_VERIFIED' | 'PAYMENT_REJECTED';
    transactionId?: string;
    isArchived?: number;
    createDate?: string;
    shippingCompany?: string;
    shippingTrackingNumber?: string;
    memberId?: number;
    orderUUID?: string;
    paymentMethod?: string;
    paymentCardNumber?: string;
    shippingFee?: number;
    shippingTime?: number;
    shippingName?: string;
    shippingPhone?: string;
    shippingPostcode?: string;
    shippingCountry?: string;
    shippingState?: string;
    shippingCity?: string;
    shippingAddress?: string;
    originalTotalPrice?: number;
    finalTotalPrice?: number;
    note?: string;
    orderSkus?: OrderSku[];
  };

  type OrderCheckoutDto = {
    memberId?: number;
    skus?: OrderSkuDto[];
  };

  type OrderPaginationDto = {
    current?: number;
    pageSize?: number;
    orderFields?: string[];
    orderTypes?: string[];
    include?: string[];
    ids?: number[];
    status?: number;
  };

  type OrderSku = {
    id?: number;
    skuId?: number;
    skuName?: string;
    skuImg?: string;
    skuQuantity?: number;
    skuOriginalPrice?: number;
    skuFinalPrice?: number;
    rating?: number;
    status?:
      | 'NOT_SHIPPED'
      | 'IN_TRANSIT'
      | 'REFUND_WITHOUT_RETURN_REQUESTED_AND_IN_TRANSIT'
      | 'REFUND_WITH_RETURN_REQUESTED_AND_IN_TRANSIT'
      | 'REFUND_WITHOUT_RETURN_REJECTED_AND_IN_TRANSIT'
      | 'REFUND_WITH_RETURN_REJECTED_AND_IN_TRANSIT'
      | 'DELIVERED'
      | 'REFUND_WITHOUT_RETURN_REQUESTED_AND_DELIVERED'
      | 'REFUND_WITH_RETURN_REQUESTED_AND_DELIVERED'
      | 'REFUND_WITHOUT_RETURN_APPROVED_AND_DELIVERED'
      | 'REFUND_WITH_RETURN_APPROVED_AND_DELIVERED'
      | 'REFUND_WITHOUT_RETURN_REJECTED_AND_DELIVERED'
      | 'REFUND_WITH_RETURN_REJECTED_AND_DELIVERED';
    refundRequestPricePerSku?: number;
    refundRequestQuantity?: number;
    refundedPricePerSku?: number;
    refundedQuantity?: number;
    order?: Order;
    refundRequests?: OrderSkuRefundRequest[];
    shippingStatuses?: OrderSkuShippingStatus[];
  };

  type OrderSkuDto = {
    skuId?: number;
    skuName?: string;
    skuImg?: string;
    skuQuantity?: number;
    skuOriginalPrice?: number;
    skuFinalPrice?: number;
  };

  type OrderSkuRefundRequest = {
    id?: number;
    username?: string;
    refundPerSkuPrice: number;
    refundQuantity: number;
    refundShippingFee?: number;
    reason?: string;
    description?: string;
    proofImages?: string;
    createDate?: string;
    status?: 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
    handlerUsername?: string;
    handleDate?: string;
    handleReason?: string;
    orderSku?: OrderSku;
  };

  type OrderSkuRefundRequestDto = {
    username?: string;
    refundTotalPrice?: number;
    refundShippingFee?: number;
    refundPerSkuPrice?: number;
    refundQuantity?: number;
    reason?: string;
    description?: string;
    proofImages?: string;
  };

  type OrderSkuShippingStatus = {
    id?: number;
    status?: number;
    createDate?: string;
    orderSku?: OrderSku;
  };

  type PageDataOrder = {
    total?: number;
    list?: Order[];
    current?: number;
    pageSize?: number;
  };

  type pageParams = {
    paginationDto: OrderPaginationDto;
  };

  type PaginationDto = {
    current?: number;
    pageSize?: number;
    orderFields?: string[];
    orderTypes?: string[];
    include?: string[];
    ids?: number[];
  };

  type PlaceOrderDto = {
    memberId?: number;
    orderUUID?: string;
    paymentMethod?: string;
    paymentCardNumber?: string;
    shippingFee?: number;
    shippingTime?: number;
    shippingName?: string;
    shippingPhone?: string;
    shippingPostcode?: string;
    shippingCountry?: string;
    shippingState?: string;
    shippingCity?: string;
    shippingAddress?: string;
    originalTotalPrice?: number;
    finalTotalPrice?: number;
    note?: string;
    skus?: OrderSkuDto[];
  };

  type rejectRefundParams = {
    orderSkuId: number;
  };

  type requestRefundParams = {
    orderSkuId: number;
  };

  type Result = {
    success?: boolean;
    code?: number;
    msg?: string;
    data?: Record<string, any>;
  };

  type ResultObject = {
    success?: boolean;
    code?: number;
    msg?: string;
    data?: Record<string, any>;
  };

  type ResultOrder = {
    success?: boolean;
    code?: number;
    msg?: string;
    data?: Order;
  };

  type ResultPageDataOrder = {
    success?: boolean;
    code?: number;
    msg?: string;
    data?: PageDataOrder;
  };

  type reviewParams = {
    orderSkuId: number;
  };

  type SkuReviewInternalDto = {
    skuId?: number;
    rating?: number;
  };

  type test2Params = {
    paginationDto: PaginationDto;
  };

  type test3Params = {
    paginationDto: PaginationDto;
  };

  type test4Params = {
    paginationDto: PaginationDto;
  };
}
