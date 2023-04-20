// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 PUT /product/categorybrand */
export async function updateAll10(body: API.CategoryBrandDto[], options?: { [key: string]: any }) {
  return request<API.Result>('/product/categorybrand', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /product/categorybrand */
export async function addAll10(body: API.CategoryBrandDto[], options?: { [key: string]: any }) {
  return request<API.Result>('/product/categorybrand', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /product/categorybrand */
export async function removeAll10(body: number[], options?: { [key: string]: any }) {
  return request<API.Result>('/product/categorybrand', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /product/categorybrand/${param0} */
export async function get10(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.get10Params,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Result>(`/product/categorybrand/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /product/categorybrand/page */
export async function page10(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.page10Params,
  options?: { [key: string]: any },
) {
  return request<API.Result>('/product/categorybrand/page', {
    method: 'GET',
    params: {
      ...params,
      params: undefined,
      ...params['params'],
    },
    ...(options || {}),
  });
}
