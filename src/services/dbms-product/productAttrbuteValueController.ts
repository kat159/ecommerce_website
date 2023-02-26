// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 PUT /product/productattrbutevalue */
export async function updateAll(
  body: API.ProductAttrbuteValueDto[],
  options?: { [key: string]: any },
) {
  return request<API.Result>('/product/productattrbutevalue', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /product/productattrbutevalue */
export async function addAll(
  body: API.ProductAttrbuteValueDto[],
  options?: { [key: string]: any },
) {
  return request<API.Result>('/product/productattrbutevalue', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /product/productattrbutevalue */
export async function removeAll(body: number[], options?: { [key: string]: any }) {
  return request<API.Result>('/product/productattrbutevalue', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /product/productattrbutevalue/${param0} */
export async function get(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.get8Params,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Result>(`/product/productattrbutevalue/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /product/productattrbutevalue/page */
export async function page(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.page8Params,
  options?: { [key: string]: any },
) {
  return request<API.Result>('/product/productattrbutevalue/page', {
    method: 'GET',
    params: {
      ...params,
      params: undefined,
      ...params['params'],
    },
    ...(options || {}),
  });
}
