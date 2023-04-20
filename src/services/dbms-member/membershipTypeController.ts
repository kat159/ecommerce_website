// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 PUT /member/membershiptype */
export async function updateAll(body: API.MembershipTypeDto[], options?: { [key: string]: any }) {
  return request<API.Result>('/member/membershiptype', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /member/membershiptype */
export async function addAll(body: API.MembershipTypeDto[], options?: { [key: string]: any }) {
  return request<API.Result>('/member/membershiptype', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /member/membershiptype */
export async function removeAll(body: number[], options?: { [key: string]: any }) {
  return request<API.Result>('/member/membershiptype', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /member/membershiptype/${param0} */
export async function get(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.get3Params,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Result>(`/member/membershiptype/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /member/membershiptype/page */
export async function page(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.page3Params,
  options?: { [key: string]: any },
) {
  return request<API.Result>('/member/membershiptype/page', {
    method: 'GET',
    params: {
      ...params,
      params: undefined,
      ...params['params'],
    },
    ...(options || {}),
  });
}
