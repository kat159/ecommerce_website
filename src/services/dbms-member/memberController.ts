// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

export async function pageAddress(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.pageAddressParams,
  options?: { [key: string]: any },
) {
  const { username: param0, ...queryParams } = params;
  return request<API.Result>(`/member/member/${param0}/address`, {
    method: 'GET',
    params: {
      ...queryParams,
      params: undefined,
      ...queryParams['params'],
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /member/member/${param0}/address */
export async function addAddress(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.addAddressParams,
  body: API.ReceivingAddressDto[],
  options?: { [key: string]: any },
) {
  const { username: param0, ...queryParams } = params;
  return request<API.Result>(`/member/member/${param0}/address`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /member/member/${param0}/browse-history */
export async function pageBrowseHistory(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.pageBrowseHistoryParams,
  options?: { [key: string]: any },
) {
  const { username: param0, ...queryParams } = params;
  return request<API.Result>(`/member/member/${param0}/browse-history`, {
    method: 'GET',
    params: {
      ...queryParams,
      params: undefined,
      ...queryParams['params'],
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /member/member/${param0}/browse-history */
export async function addToBrowseHistory(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.addToBrowseHistoryParams,
  body: API.MemberSkuViewRecordDto[],
  options?: { [key: string]: any },
) {
  const { username: param0, ...queryParams } = params;
  return request<API.Result>(`/member/member/${param0}/browse-history`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /member/member/${param0}/cart */
export async function pageCart(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.pageCartParams,
  options?: { [key: string]: any },
) {
  const { username: param0, ...queryParams } = params;
  return request<API.Result>(`/member/member/${param0}/cart`, {
    method: 'GET',
    params: {
      ...queryParams,
      params: undefined,
      ...queryParams['params'],
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /member/member/${param0}/cart */
export async function addToCart(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.addToCartParams,
  body: API.MemberSkuCartDto[],
  options?: { [key: string]: any },
) {
  const { username: param0, ...queryParams } = params;
  return request<API.Result>(`/member/member/${param0}/cart`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}
export async function login(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.loginParams,
  body: API.MemberDto,
  options?: { [key: string]: any },
) {
  return request<API.Result>('/member/member/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: {
      ...params,
    },
    data: body,
    ...(options || {}),
  });
}
/** 此处后端没有提供注释 PUT /member/member */
export async function updateAll(body: API.MemberDto[], options?: { [key: string]: any }) {
  return request<API.Result>('/member/member', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /member/member */
export async function addAll(body: API.MemberDto[], options?: { [key: string]: any }) {
  return request<API.Result>('/member/member', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /member/member */
export async function removeAll(body: number[], options?: { [key: string]: any }) {
  return request<API.Result>('/member/member', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /member/member/${param0} */
export async function get(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.get4Params,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Result>(`/member/member/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /member/member/page */
export async function page(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.page4Params,
  options?: { [key: string]: any },
) {
  return request<API.Result>('/member/member/page', {
    method: 'GET',
    params: {
      ...params,
      params: undefined,
      ...params['params'],
    },
    ...(options || {}),
  });
}
