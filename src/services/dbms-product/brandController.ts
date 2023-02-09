// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 PUT /product/brand */
export async function updateAll11(body: API.BrandDto[], options?: { [key: string]: any }) {
  return request<API.Result>('/product/brand', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /product/brand */
export async function addAll11(body: API.BrandDto[], options?: { [key: string]: any }) {
  return request<API.Result>('/product/brand', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /product/brand */
export async function removeAll11(body: number[], options?: { [key: string]: any }) {
  return request<API.Result>('/product/brand', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /product/brand/${param0} */
export async function get11(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.get11Params,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Result>(`/product/brand/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /product/brand/page */
export async function page11(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.page11Params,
  options?: { [key: string]: any },
) {
  return request<API.Result>('/product/brand/page', {
    method: 'GET',
    params: {
      ...params,
      params: undefined,
      ...params['params'],
    },
    ...(options || {}),
  });
}
