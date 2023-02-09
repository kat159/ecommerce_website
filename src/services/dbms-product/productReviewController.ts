// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 PUT /product/productreview */
export async function updateAll4(body: API.ProductReviewDto[], options?: { [key: string]: any }) {
  return request<API.Result>('/product/productreview', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /product/productreview */
export async function addAll4(body: API.ProductReviewDto[], options?: { [key: string]: any }) {
  return request<API.Result>('/product/productreview', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /product/productreview */
export async function removeAll4(body: number[], options?: { [key: string]: any }) {
  return request<API.Result>('/product/productreview', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /product/productreview/${param0} */
export async function get4(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.get4Params,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Result>(`/product/productreview/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /product/productreview/page */
export async function page4(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.page4Params,
  options?: { [key: string]: any },
) {
  return request<API.Result>('/product/productreview/page', {
    method: 'GET',
    params: {
      ...params,
      params: undefined,
      ...params['params'],
    },
    ...(options || {}),
  });
}
