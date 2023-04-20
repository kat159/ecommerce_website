// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 PUT /product/productimage */
export async function updateAll6(body: API.ProductImageDto[], options?: { [key: string]: any }) {
  return request<API.Result>('/product/productimage', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /product/productimage */
export async function addAll6(body: API.ProductImageDto[], options?: { [key: string]: any }) {
  return request<API.Result>('/product/productimage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /product/productimage */
export async function removeAll6(body: number[], options?: { [key: string]: any }) {
  return request<API.Result>('/product/productimage', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /product/productimage/${param0} */
export async function get6(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.get6Params,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Result>(`/product/productimage/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /product/productimage/page */
export async function page6(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.page6Params,
  options?: { [key: string]: any },
) {
  return request<API.Result>('/product/productimage/page', {
    method: 'GET',
    params: {
      ...params,
      params: undefined,
      ...params['params'],
    },
    ...(options || {}),
  });
}
