// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 PUT /product/reviewreply */
export async function updateAll3(body: API.ReviewReplyDto[], options?: { [key: string]: any }) {
  return request<API.Result>('/product/reviewreply', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /product/reviewreply */
export async function addAll3(body: API.ReviewReplyDto[], options?: { [key: string]: any }) {
  return request<API.Result>('/product/reviewreply', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /product/reviewreply */
export async function removeAll3(body: number[], options?: { [key: string]: any }) {
  return request<API.Result>('/product/reviewreply', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /product/reviewreply/${param0} */
export async function get3(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.get3Params,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Result>(`/product/reviewreply/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /product/reviewreply/page */
export async function page3(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.page3Params,
  options?: { [key: string]: any },
) {
  return request<API.Result>('/product/reviewreply/page', {
    method: 'GET',
    params: {
      ...params,
      params: undefined,
      ...params['params'],
    },
    ...(options || {}),
  });
}
