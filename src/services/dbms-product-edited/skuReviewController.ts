// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 PUT /product/skureview */
export async function updateAll2(body: API.SkuReviewDto[], options?: { [key: string]: any }) {
  return request<API.Result>('/product/skureview', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /product/skureview */
export async function addAll2(body: API.SkuReviewDto[], options?: { [key: string]: any }) {
  return request<API.Result>('/product/skureview', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /product/skureview */
export async function removeAll2(body: number[], options?: { [key: string]: any }) {
  return request<API.Result>('/product/skureview', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /product/skureview/${param0} */
export async function get2(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.get2Params,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Result>(`/product/skureview/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /product/skureview/page */
export async function page2(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.page2Params,
  options?: { [key: string]: any },
) {
  return request<API.Result>('/product/skureview/page', {
    method: 'GET',
    params: {
      ...params,
      params: undefined,
      ...params['params'],
    },
    ...(options || {}),
  });
}
