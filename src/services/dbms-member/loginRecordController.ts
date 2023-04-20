// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 PUT /member/loginrecord */
export async function updateAll(body: API.LoginRecordDto[], options?: { [key: string]: any }) {
  return request<API.Result>('/member/loginrecord', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /member/loginrecord */
export async function addAll(body: API.LoginRecordDto[], options?: { [key: string]: any }) {
  return request<API.Result>('/member/loginrecord', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /member/loginrecord */
export async function removeAll(body: number[], options?: { [key: string]: any }) {
  return request<API.Result>('/member/loginrecord', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /member/loginrecord/${param0} */
export async function get(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.get5Params,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Result>(`/member/loginrecord/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /member/loginrecord/page */
export async function page(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.page5Params,
  options?: { [key: string]: any },
) {
  return request<API.Result>('/member/loginrecord/page', {
    method: 'GET',
    params: {
      ...params,
      params: undefined,
      ...params['params'],
    },
    ...(options || {}),
  });
}
