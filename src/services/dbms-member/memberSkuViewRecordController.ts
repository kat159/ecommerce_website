// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 PUT /member/memberskuviewrecord */
export async function updateAll(
  body: API.MemberSkuViewRecordDto[],
  options?: { [key: string]: any },
) {
  return request<API.Result>('/member/memberskuviewrecord', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /member/memberskuviewrecord */
export async function addAll(
  body: API.MemberSkuViewRecordDto[],
  options?: { [key: string]: any },
) {
  return request<API.Result>('/member/memberskuviewrecord', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /member/memberskuviewrecord */
export async function removeAll(body: number[], options?: { [key: string]: any }) {
  return request<API.Result>('/member/memberskuviewrecord', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /member/memberskuviewrecord/${param0} */
export async function get(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.get1Params,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Result>(`/member/memberskuviewrecord/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /member/memberskuviewrecord/page */
export async function page(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.page1Params,
  options?: { [key: string]: any },
) {
  return request<API.Result>('/member/memberskuviewrecord/page', {
    method: 'GET',
    params: {
      ...params,
      params: undefined,
      ...params['params'],
    },
    ...(options || {}),
  });
}
