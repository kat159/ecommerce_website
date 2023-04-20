// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 GET /product/sku */
export async function getAll(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAllParams,
  options?: { [key: string]: any },
) {
  return request<API.Result>('/product/sku', {
    method: 'GET',
    params: {
      ...params,
      params: undefined,
      ...params['params'],
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PUT /product/sku */
export async function updateAll5(body: API.SkuDto[], options?: { [key: string]: any }) {
  return request<API.Result>('/product/sku', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /product/sku */
export async function addAll5(body: API.SkuDto[], options?: { [key: string]: any }) {
  return request<API.Result>('/product/sku', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /product/sku */
export async function removeAll5(body: number[], options?: { [key: string]: any }) {
  return request<API.Result>('/product/sku', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /product/sku/${param0} */
export async function get5(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.get5Params,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Result>(`/product/sku/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PUT /product/sku/inventory/deduct */
export async function deductInventory(
  body: API.OrderSkuInternalDto[],
  options?: { [key: string]: any },
) {
  return request<API.Result>('/product/sku/inventory/deduct', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /product/sku/page */
export async function page5(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.page5Params,
  options?: { [key: string]: any },
) {
  return request<API.Result>('/product/sku/page', {
    method: 'GET',
    params: {
      ...params,
      params: undefined,
      ...params['params'],
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /product/sku/review */
export async function review(body: API.SkuReviewInternalDto, options?: { [key: string]: any }) {
  return request<API.Result>('/product/sku/review', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /product/sku/test */
export async function test(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.testParams,
  options?: { [key: string]: any },
) {
  return request<API.Result>('/product/sku/test', {
    method: 'GET',
    params: {
      ...params,
      params: undefined,
      ...params['params'],
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PUT /product/sku/test */
export async function test3(body: API.OrderSkuInternalDto[], options?: { [key: string]: any }) {
  return request<API.Result>('/product/sku/test', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /product/sku/test */
export async function test2(body: API.PaginationDto, options?: { [key: string]: any }) {
  return request<API.Result>('/product/sku/test', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
