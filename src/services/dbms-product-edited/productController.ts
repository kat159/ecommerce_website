// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 PUT /product/product */
export async function updateAll9(body: API.ProductDto[], options?: { [key: string]: any }) {
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
export async function addAll9(body: API.ProductDto[], options?: { [key: string]: any }) {
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
export async function removeAll9(body: number[], options?: { [key: string]: any }) {
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
export async function get9(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.get9Params,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Result>(`/product/product/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /product/product/detail/sku/${param0} */
export async function getDetailBySkuId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getDetailBySkuIdParams,
  options?: { [key: string]: any },
) {
  const { skuId: param0, ...queryParams } = params;
  return request<API.Result>(`/product/product/detail/sku/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PUT /product/product/manage */
export async function manageAll(body: API.ProductManageDto[], options?: { [key: string]: any }) {
  return request<API.Result>('/product/product/manage', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /product/product/page */
export async function page9(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.page9Params,
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

/** 此处后端没有提供注释 POST /product/product/publish */
export async function publishAll(body: API.ProductPublishDto[], options?: { [key: string]: any }) {
  return request<API.Result>('/product/product/publish', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /product/product/search */
export async function search(body: API.ProductSearchParams, options?: { [key: string]: any }) {
  return request<API.Result>('/product/product/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
