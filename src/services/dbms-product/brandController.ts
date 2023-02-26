// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 PUT /product/brand */
export async function updateAll(body: API.BrandDto[], options?: { [key: string]: any }) {
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
export async function addAll(body: API.BrandDto[], options?: { [key: string]: any }) {
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
export async function removeAll(body: number[], options?: { [key: string]: any }) {
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
export async function get(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.get12Params,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Result>(`/product/brand/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /product/brand/${param0}/category-brand */
export async function getAllCategoryBrand(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAllCategoryBrandParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Result>(`/product/brand/${param0}/category-brand`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /product/brand/${param0}/category-brand/${param1} */
export async function addCategoryBrand(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.addCategoryBrandParams,
  options?: { [key: string]: any },
) {
  const { id: param0, cid: param1, ...queryParams } = params;
  return request<API.Result>(`/product/brand/${param0}/category-brand/${param1}`, {
    method: 'POST',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /product/brand/${param0}/product */
export async function getAllProduct(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAllProductParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Result>(`/product/brand/${param0}/product`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /product/brand/${param0}/product */
export async function addAllProduct(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.addAllProductParams,
  body: API.ProductDto[],
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Result>(`/product/brand/${param0}/product`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /product/brand/page */
export async function page(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.page12Params,
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
