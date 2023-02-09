// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 PUT /coupon/promotionalskunotice */
export async function update(body: API.PromotionalSkuNoticeDto, options?: { [key: string]: any }) {
  return request<API.Result>('/coupon/promotionalskunotice', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /coupon/promotionalskunotice */
export async function save(body: API.PromotionalSkuNoticeDto, options?: { [key: string]: any }) {
  return request<API.Result>('/coupon/promotionalskunotice', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /coupon/promotionalskunotice */
export async function remove(body: number[], options?: { [key: string]: any }) {
  return request<API.Result>('/coupon/promotionalskunotice', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /coupon/promotionalskunotice/${param0} */
export async function get(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Result>(`/coupon/promotionalskunotice/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /coupon/promotionalskunotice/page */
export async function page(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.pageParams,
  options?: { [key: string]: any },
) {
  return request<API.Result>('/coupon/promotionalskunotice/page', {
    method: 'GET',
    params: {
      ...params,
      params: undefined,
      ...params['params'],
    },
    ...(options || {}),
  });
}
