// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 PUT /warehouse/warehouseinfo */
export async function update(body: API.WarehouseInfoDto, options?: { [key: string]: any }) {
  return request<API.Result>('/warehouse/warehouseinfo', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /warehouse/warehouseinfo */
export async function save(body: API.WarehouseInfoDto, options?: { [key: string]: any }) {
  return request<API.Result>('/warehouse/warehouseinfo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /warehouse/warehouseinfo */
export async function deleteUsingDELETE(body: number[], options?: { [key: string]: any }) {
  return request<API.Result>('/warehouse/warehouseinfo', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /warehouse/warehouseinfo/${param0} */
export async function get(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Result>(`/warehouse/warehouseinfo/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /warehouse/warehouseinfo/page */
export async function page(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.pageParams,
  options?: { [key: string]: any },
) {
  return request<API.Result>('/warehouse/warehouseinfo/page', {
    method: 'GET',
    params: {
      ...params,
      params: undefined,
      ...params['params'],
    },
    ...(options || {}),
  });
}
