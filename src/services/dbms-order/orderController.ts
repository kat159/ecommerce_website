// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 GET /order/order */
export async function getAll(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAllParams,
  options?: { [key: string]: any },
) {
  return request<API.ResultOrder>('/order/order', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /order/order */
export async function placeOrder(body: API.PlaceOrderDto, options?: { [key: string]: any }) {
  return request<API.Result>('/order/order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /order/order/${param0} */
export async function getOrder(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getOrderParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.ResultOrder>(`/order/order/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /order/order/checkout */
export async function checkout(body: API.OrderCheckoutDto, options?: { [key: string]: any }) {
  return request<API.Result>('/order/order/checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /order/order/page */
export async function page(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.pageParams,
  options?: { [key: string]: any },
) {
  return request<API.ResultPageDataOrder>('/order/order/page', {
    method: 'GET',
    params: {
      ...params,
      paginationDto: undefined,
      ...params['paginationDto'],
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /order/order/refund-request-manage */
export async function manageRefundRequest(
  body: API.ManageRefundRequestDto,
  options?: { [key: string]: any },
) {
  return request<API.ResultObject>('/order/order/refund-request-manage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /order/order/reject-refund/${param0} */
export async function rejectRefund(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.rejectRefundParams,
  options?: { [key: string]: any },
) {
  const { orderSkuId: param0, ...queryParams } = params;
  return request<API.Result>(`/order/order/reject-refund/${param0}`, {
    method: 'POST',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /order/order/request-refund/${param0} */
export async function requestRefund(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.requestRefundParams,
  body: API.OrderSkuRefundRequestDto,
  options?: { [key: string]: any },
) {
  const { orderSkuId: param0, ...queryParams } = params;
  return request<API.Result>(`/order/order/request-refund/${param0}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /order/order/review/${param0} */
export async function review(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.reviewParams,
  body: API.SkuReviewInternalDto,
  options?: { [key: string]: any },
) {
  const { orderSkuId: param0, ...queryParams } = params;
  return request<API.ResultObject>(`/order/order/review/${param0}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /order/order/test */
export async function test(options?: { [key: string]: any }) {
  return request<API.Result>('/order/order/test', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /order/order/test */
export async function test2(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.test2Params,
  options?: { [key: string]: any },
) {
  return request<API.Result>('/order/order/test', {
    method: 'POST',
    params: {
      ...params,
      paginationDto: undefined,
      ...params['paginationDto'],
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /order/order/test3 */
export async function test3(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.test3Params,
  options?: { [key: string]: any },
) {
  return request<API.Result>('/order/order/test3', {
    method: 'GET',
    params: {
      ...params,
      paginationDto: undefined,
      ...params['paginationDto'],
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PUT /order/order/test3 */
export async function test5(options?: { [key: string]: any }) {
  return request<API.Result>('/order/order/test3', {
    method: 'PUT',
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /order/order/test3 */
export async function test4(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.test4Params,
  options?: { [key: string]: any },
) {
  return request<API.Result>('/order/order/test3', {
    method: 'POST',
    params: {
      ...params,
      paginationDto: undefined,
      ...params['paginationDto'],
    },
    ...(options || {}),
  });
}
