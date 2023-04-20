// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 PUT /country/country */
export async function updateAll(body: API.CountriesDto[], options?: { [key: string]: any }) {
  return request<API.Result>('/country/country', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /country/country */
export async function addAll(body: API.CountriesDto[], options?: { [key: string]: any }) {
  return request<API.Result>('/country/country', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /country/country */
export async function removeAll(body: number[], options?: { [key: string]: any }) {
  return request<API.Result>('/country/country', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /country/country/${param0} */
export async function get(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.get1Params,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Result>(`/country/country/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /country/country/${param0}/state */
export async function getAllStates(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAllStatesParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Result>(`/country/country/${param0}/state`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /country/country/all */
export async function getAll(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAllParams,
  options?: { [key: string]: any },
) {
  return request<API.Result>('/country/country/all', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /country/country/page */
export async function page(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.page1Params,
  options?: { [key: string]: any },
) {
  return request<API.Result>('/country/country/page', {
    method: 'GET',
    params: {
      ...params,
      params: undefined,
      ...params['params'],
    },
    ...(options || {}),
  });
}
