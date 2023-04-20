// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 PUT /product/attribute */
export async function updateAll14(body: API.AttributeDto[], options?: { [key: string]: any }) {
  return request<API.Result>('/product/attribute', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /product/attribute */
export async function addAll14(body: API.AttributeDto[], options?: { [key: string]: any }) {
  return request<API.Result>('/product/attribute', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /product/attribute */
export async function removeAll14(body: number[], options?: { [key: string]: any }) {
  return request<API.Result>('/product/attribute', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /product/attribute/${param0} */
export async function get14(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.get14Params,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Result>(`/product/attribute/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /product/attribute/page */
export async function page14(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.page14Params,
  options?: { [key: string]: any },
) {
  return request<API.Result>('/product/attribute/page', {
    method: 'GET',
    params: {
      ...params,
      params: undefined,
      ...params['params'],
    },
    ...(options || {}),
  });
}
