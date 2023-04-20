// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 PUT /product/skuattributevalue */
export async function updateAll4(
  body: API.SkuAttributeValueDto[],
  options?: { [key: string]: any },
) {
  return request<API.Result>('/product/skuattributevalue', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /product/skuattributevalue */
export async function addAll4(body: API.SkuAttributeValueDto[], options?: { [key: string]: any }) {
  return request<API.Result>('/product/skuattributevalue', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /product/skuattributevalue */
export async function removeAll4(body: number[], options?: { [key: string]: any }) {
  return request<API.Result>('/product/skuattributevalue', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /product/skuattributevalue/${param0} */
export async function get4(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.get4Params,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Result>(`/product/skuattributevalue/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /product/skuattributevalue/page */
export async function page4(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.page4Params,
  options?: { [key: string]: any },
) {
  return request<API.Result>('/product/skuattributevalue/page', {
    method: 'GET',
    params: {
      ...params,
      params: undefined,
      ...params['params'],
    },
    ...(options || {}),
  });
}
