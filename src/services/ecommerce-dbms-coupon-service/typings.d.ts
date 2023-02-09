declare namespace API {
  type CollectedCouponStatusDto = {
    id?: number;
    couponId?: number;
    memberId?: number;
    memberNickname?: string;
    collectionType?: number;
    createTime?: string;
    status?: number;
    usedDate?: string;
    orderId?: number;
    orderSn?: number;
  };

  type CouponAppliedProductCategoryDto = {
    id?: number;
    couponId?: number;
    categoryId?: number;
    categoryName?: string;
  };

  type CouponAppliedProductDto = {
    id?: number;
    couponId?: number;
    productId?: number;
    productName?: string;
  };

  type CouponDto = {
    id?: number;
    issueType?: number;
    img?: string;
    name?: string;
    count?: number;
    amount?: number;
    limitQuantity?: number;
    limitMembershipPoint?: number;
    limitRange?: number;
    limitMemberLevel?: number;
    availableStartDate?: string;
    availableEndDate?: string;
    remark?: string;
    publishedNumber?: number;
    usedNumber?: number;
    collectedNumber?: number;
    collectionStartDate?: string;
    collectionEndDate?: string;
    code?: string;
    publishStatus?: number;
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

  type HomepageAdDto = {
    id?: number;
    name?: string;
    pic?: string;
    startTime?: string;
    endTime?: string;
    status?: number;
    clickCount?: number;
    url?: string;
    remark?: string;
    sort?: number;
    publisherId?: number;
    censorId?: number;
  };

  type HomepageSubjectDto = {
    id?: number;
    name?: string;
    title?: string;
    subTitle?: string;
    displayStatus?: number;
    link?: string;
    sort?: number;
    img?: string;
  };

  type HomepageSubjectProductDto = {
    id?: number;
    name?: string;
    subjectId?: number;
    productId?: number;
    sort?: number;
  };

  type MemberPriceDto = {
    id?: number;
    skuId?: number;
    memberLevelId?: number;
    memberLevelName?: string;
    memberPrice?: number;
    stackable?: number;
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

  type ProductRewardDto = {
    id?: number;
    productId?: number;
    membershipPoint?: number;
    rewardPoint?: number;
    effectiveness?: number;
  };

  type PromotionalSkuNoticeDto = {
    id?: number;
    memberId?: number;
    skuId?: number;
    sessionId?: number;
    subcribeDate?: string;
    noticeDate?: string;
    noticeApproach?: number;
  };

  type PromotionDto = {
    id?: number;
    title?: string;
    startDate?: string;
    endDate?: string;
    status?: number;
    createDate?: string;
    creatorId?: number;
  };

  type PromotionSessionDto = {
    id?: number;
    name?: string;
    startDate?: string;
    endDate?: string;
    status?: number;
    createDate?: string;
  };

  type PromotionSkuDto = {
    id?: number;
    promotionId?: number;
    promotionSessionId?: number;
    skuId?: number;
    specialPrice?: number;
    limitTotalNumber?: number;
    limitNumberPerMember?: number;
    sort?: number;
  };

  type Result = {
    success?: boolean;
    total?: number;
    code?: number;
    msg?: string;
    data?: Record<string, any>;
  };

  type SkuPriceBreakDto = {
    id?: number;
    skuId?: number;
    threshold?: number;
    discountedPrice?: number;
    combinable?: number;
  };

  type SkuVolumeDiscountDto = {
    id?: number;
    skuId?: number;
    threshold?: number;
    discountedPrice?: number;
    combinable?: number;
  };
}
