// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 PUT /product/attributegroup */
export async function updateAll13(body: API.AttributeGroupDto[], options?: { [key: string]: any }) {
  return request<API.Result>('/product/attributegroup', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /product/attributegroup */
export async function addAll13(body: API.AttributeGroupDto[], options?: { [key: string]: any }) {
  return request<API.Result>('/product/attributegroup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /product/attributegroup */
export async function removeAll13(body: number[], options?: { [key: string]: any }) {
  return request<API.Result>('/product/attributegroup', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /product/attributegroup/${param0} */
export async function get13(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.get13Params,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Result>(`/product/attributegroup/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /product/attributegroup/${param0}/attribute */
export async function getAllAttribute(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAllAttributeParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Result>(`/product/attributegroup/${param0}/attribute`, {
    method: 'GET',
    params: {
      ...queryParams,
      params: undefined,
      ...queryParams['params'],
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /product/attributegroup/${param0}/attribute */
export async function addAllAttribute(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.addAllAttributeParams,
  body: API.AttributeDto[],
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Result>(`/product/attributegroup/${param0}/attribute`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /product/attributegroup/page */
export async function page13(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.page13Params,
  options?: { [key: string]: any },
) {
  return request<API.Result>('/product/attributegroup/page', {
    method: 'GET',
    params: {
      ...params,
      params: undefined,
      ...params['params'],
    },
    ...(options || {}),
  });
}
