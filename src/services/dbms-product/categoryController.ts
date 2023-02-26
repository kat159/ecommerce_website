// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 PUT /product/category */
export async function updateAll(body: API.CategoryDto[], options?: { [key: string]: any }) {
  return request<API.Result>('/product/category', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /product/category */
export async function addAll(body: API.CategoryDto[], options?: { [key: string]: any }) {
  return request<API.Result>('/product/category', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /product/category */
export async function removeAll(body: number[], options?: { [key: string]: any }) {
  return request<API.Result>('/product/category', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /product/category/${param0} */
export async function get(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.get11Params,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Result>(`/product/category/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /product/category/${param0}/attrgroup */
export async function getAllAttrGroup(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAllAttrGroupParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Result>(`/product/category/${param0}/attrgroup`, {
    method: 'GET',
    params: {
      ...queryParams,
      params: undefined,
      ...queryParams['params'],
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /product/category/${param0}/attrgroup */
export async function addAllAttrGroup(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.addAllAttrGroupParams,
  body: API.AttributeGroupDto[],
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Result>(`/product/category/${param0}/attrgroup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /product/category/${param0}/attrgroup/attribute */
export async function getAllAttrGroupWithAttrList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAllAttrGroupWithAttrListParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Result>(`/product/category/${param0}/attrgroup/attribute`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /product/category/${param0}/attrgroup/page */
export async function pageAttrGroup(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.pageAttrGroupParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Result>(`/product/category/${param0}/attrgroup/page`, {
    method: 'GET',
    params: {
      ...queryParams,
      params: undefined,
      ...queryParams['params'],
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /product/category/all */
export async function getAll(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAllParams,
  options?: { [key: string]: any },
) {
  return request<API.Result>('/product/category/all', {
    method: 'GET',
    params: {
      ...params,
      params: undefined,
      ...params['params'],
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /product/category/forest */
export async function forest(options?: { [key: string]: any }) {
  return request<API.Result>('/product/category/forest', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /product/category/page */
export async function page(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.page11Params,
  options?: { [key: string]: any },
) {
  return request<API.Result>('/product/category/page', {
    method: 'GET',
    params: {
      ...params,
      params: undefined,
      ...params['params'],
    },
    ...(options || {}),
  });
}
