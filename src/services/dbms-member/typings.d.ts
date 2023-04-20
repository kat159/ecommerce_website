declare namespace API {
  type addAddressParams = {
    username: string;
  };

  type addToBrowseHistoryParams = {
    username: string;
  };

  type addToCartParams = {
    username: string;
  };

  type FavoriteProductDto = {
    id?: number;
    memberId?: number;
    productId?: number;
    productName?: string;
    productImg?: string;
    addDate?: string;
  };

  type get1Params = {
    id: number;
  };

  type get2Params = {
    id: number;
  };

  type get3Params = {
    id: number;
  };

  type get4Params = {
    id: number;
  };

  type get5Params = {
    id: number;
  };

  type get6Params = {
    id: number;
  };

  type getParams = {
    id: number;
  };

  type loginParams = {
    token?: string;
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
    membershipTypeId?: number;
    username?: string;
    password?: string;
    nickname?: string;
    tele?: string;
    email?: string;
    avatar?: string;
    gender?: number;
    birth?: string;
    referSource?: number;
    membershipPoint?: number;
    rewardPoint?: number;
    status?: number;
    registrationDate?: string;
  };

  type MembershipTypeDto = {
    id?: number;
    name?: string;
    activatePrice?: number;
  };

  type MemberSkuCartDto = {
    id?: number;
    memberId?: number;
    skuId?: number;
    quantity?: number;
    createdAt?: string;
    updatedAt?: string;
  };

  type MemberSkuViewRecordDto = {
    id?: number;
    memberId?: number;
    skuId?: number;
    viewDate?: string;
  };

  type page1Params = {
    params: PaginationDto;
  };

  type page2Params = {
    params: PaginationDto;
  };

  type page3Params = {
    params: PaginationDto;
  };

  type page4Params = {
    params: PaginationDto;
  };

  type page5Params = {
    params: PaginationDto;
  };

  type page6Params = {
    params: PaginationDto;
  };

  type pageAddressParams = {
    username: string;
    params: PaginationDto;
  };

  type pageBrowseHistoryParams = {
    username: string;
    params: PaginationDto;
  };

  type pageCartParams = {
    username: string;
    params: PaginationDto;
  };

  type pageParams = {
    params: PaginationDto;
  };

  type PaginationDto = {
    current?: number;
    pageSize?: number;
    orderFields?: string[];
    orderTypes?: string[];
    include?: string[];
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
    code?: number;
    msg?: string;
    data?: Record<string, any>;
  };
}
