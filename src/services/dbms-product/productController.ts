// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 PUT /product/product */
export async function updateAll8(body: API.ProductDto[], options?: { [key: string]: any }) {
  return request<API.Result>('/product/product', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /product/product */
export async function addAll8(body: API.ProductDto[], options?: { [key: string]: any }) {
  return request<API.Result>('/product/product', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /product/product */
export async function removeAll8(body: number[], options?: { [key: string]: any }) {
  return request<API.Result>('/product/product', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /product/product/${param0} */
export async function get8(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.get8Params,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Result>(`/product/product/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /product/product/page */
export async function page8(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.page8Params,
  options?: { [key: string]: any },
) {
  return request<API.Result>('/product/product/page', {
    method: 'GET',
    params: {
      ...params,
      params: undefined,
      ...params['params'],
    },
    ...(options || {}),
  });
}
