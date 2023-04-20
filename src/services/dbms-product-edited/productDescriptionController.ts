// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 PUT /product/productdescription */
export async function updateAll7(
  body: API.ProductDescriptionDto[],
  options?: { [key: string]: any },
) {
  return request<API.Result>('/product/productdescription', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /product/productdescription */
export async function addAll7(body: API.ProductDescriptionDto[], options?: { [key: string]: any }) {
  return request<API.Result>('/product/productdescription', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /product/productdescription */
export async function removeAll7(body: number[], options?: { [key: string]: any }) {
  return request<API.Result>('/product/productdescription', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /product/productdescription/${param0} */
export async function get7(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.get7Params,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Result>(`/product/productdescription/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /product/productdescription/page */
export async function page7(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.page7Params,
  options?: { [key: string]: any },
) {
  return request<API.Result>('/product/productdescription/page', {
    method: 'GET',
    params: {
      ...params,
      params: undefined,
      ...params['params'],
    },
    ...(options || {}),
  });
}
