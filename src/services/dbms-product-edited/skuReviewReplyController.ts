// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 PUT /product/skureviewreply */
export async function updateAll1(body: API.SkuReviewReplyDto[], options?: { [key: string]: any }) {
  return request<API.Result>('/product/skureviewreply', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /product/skureviewreply */
export async function addAll1(body: API.SkuReviewReplyDto[], options?: { [key: string]: any }) {
  return request<API.Result>('/product/skureviewreply', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /product/skureviewreply */
export async function removeAll1(body: number[], options?: { [key: string]: any }) {
  return request<API.Result>('/product/skureviewreply', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /product/skureviewreply/${param0} */
export async function get1(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.get1Params,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Result>(`/product/skureviewreply/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /product/skureviewreply/page */
export async function page1(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.page1Params,
  options?: { [key: string]: any },
) {
  return request<API.Result>('/product/skureviewreply/page', {
    method: 'GET',
    params: {
      ...params,
      params: undefined,
      ...params['params'],
    },
    ...(options || {}),
  });
}
