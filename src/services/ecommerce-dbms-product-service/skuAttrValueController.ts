// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 PUT /product/skuattrvalue */
export async function update(body: API.SkuAttrValueDto, options?: { [key: string]: any }) {
  return request<API.Result>('/product/skuattrvalue', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /product/skuattrvalue */
export async function save(body: API.SkuAttrValueDto, options?: { [key: string]: any }) {
  return request<API.Result>('/product/skuattrvalue', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /product/skuattrvalue */
export async function remove(body: number[], options?: { [key: string]: any }) {
  return request<API.Result>('/product/skuattrvalue', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /product/skuattrvalue/${param0} */
export async function get(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Result>(`/product/skuattrvalue/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /product/skuattrvalue/page */
export async function page(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.pageParams,
  options?: { [key: string]: any },
) {
  return request<API.Result>('/product/skuattrvalue/page', {
    method: 'GET',
    params: {
      ...params,
      params: undefined,
      ...params['params'],
    },
    ...(options || {}),
  });
}
