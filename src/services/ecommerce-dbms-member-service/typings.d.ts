declare namespace API {
  type FavoriteProductDto = {
    id?: number;
    memberId?: number;
    productId?: number;
    productName?: string;
    productImg?: string;
    addDate?: string;
  };

  type FavoriteSubjectDto = {
    id?: number;
    subjectId?: number;
    subjectName?: string;
    subjectImg?: string;
    subjectUrl?: string;
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

  type LoginRecordDto = {
    id?: number;
    memberId?: number;
    date?: string;
    ip?: string;
    city?: string;
    device?: number;
    app?: number;
  };

  type MemberDto = {
    id?: number;
    levelId?: number;
    username?: string;
    password?: string;
    nickname?: string;
    tele?: string;
    email?: string;
    avatar?: string;
    gender?: number;
    birth?: string;
    city?: string;
    job?: string;
    bio?: string;
    referSource?: number;
    membershipPoint?: number;
    rewardPoint?: number;
    status?: number;
    registrationDate?: string;
  };

  type MemberLevelDto = {
    id?: number;
    name?: string;
    thresholdPoint?: number;
    defaultStatus?: number;
    freeFreightThreshold?: number;
    pointFromComment?: number;
    priviledgeFreeFreight?: number;
    priviledgeMemberPrice?: number;
    priviledgeBirthday?: number;
    remark?: string;
  };

  type MembershipPointDto = {
    id?: number;
    memberId?: number;
    updatedDate?: string;
    changedValue?: number;
    note?: string;
    source?: number;
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

  type ReceivingAddressDto = {
    id?: number;
    memberId?: number;
    name?: string;
    tele?: string;
    postcode?: string;
    province?: string;
    city?: string;
    region?: string;
    address?: string;
  };

  type Result = {
    success?: boolean;
    total?: number;
    code?: number;
    msg?: string;
    data?: Record<string, any>;
  };

  type RewardPointDto = {
    id?: number;
    memberId?: number;
    updatedDate?: string;
    changedValue?: number;
    note?: string;
    source?: number;
  };

  type StatisticsDto = {
    id?: number;
    memberId?: number;
    accumPayment?: number;
    accumDiscount?: number;
    numOrder?: number;
    numCoupon?: number;
    numComment?: number;
    numReturnOrder?: number;
    numLogin?: number;
    numAttend?: number;
    numFans?: number;
    numRefer?: number;
  };
}
