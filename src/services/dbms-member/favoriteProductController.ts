// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 PUT /member/favoriteproduct */
export async function updateAll(body: API.FavoriteProductDto[], options?: { [key: string]: any }) {
  return request<API.Result>('/member/favoriteproduct', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /member/favoriteproduct */
export async function addAll(body: API.FavoriteProductDto[], options?: { [key: string]: any }) {
  return request<API.Result>('/member/favoriteproduct', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /member/favoriteproduct */
export async function removeAll(body: number[], options?: { [key: string]: any }) {
  return request<API.Result>('/member/favoriteproduct', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /member/favoriteproduct/${param0} */
export async function get(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.get6Params,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Result>(`/member/favoriteproduct/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /member/favoriteproduct/page */
export async function page(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.page6Params,
  options?: { [key: string]: any },
) {
  return request<API.Result>('/member/favoriteproduct/page', {
    method: 'GET',
    params: {
      ...params,
      params: undefined,
      ...params['params'],
    },
    ...(options || {}),
  });
}
