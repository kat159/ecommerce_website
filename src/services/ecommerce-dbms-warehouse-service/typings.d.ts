declare namespace API {
  type getParams = {
    id: number;
  };

  type getParams = {
    id: number;
  };

  type getParams = {
    id: number;
  };

  type getParams = {
    id: number;
  };

  type getParams = {
    id: number;
  };

  type getParams = {
    id: number;
  };

  type OrderTaskDetailDto = {
    id?: number;
    skuId?: number;
    skuName?: string;
    skuNum?: number;
    taskId?: number;
  };

  type OrderTaskDto = {
    id?: number;
    orderId?: number;
    orderSn?: string;
    consignee?: string;
    consigneeTel?: string;
    deliveryAddress?: string;
    orderNote?: string;
    paymentMethod?: number;
    status?: number;
    description?: string;
    trackingNumber?: string;
    createDate?: string;
    warehouseId?: number;
    taskNote?: string;
  };

  type pageParams = {
    params: Record<string, any>;
  };

  type pageParams = {
    params: Record<string, any>;
  };

  type pageParams = {
    params: Record<string, any>;
  };

  type pageParams = {
    params: Record<string, any>;
  };

  type pageParams = {
    params: Record<string, any>;
  };

  type pageParams = {
    params: Record<string, any>;
  };

  type PurchaseDetailDto = {
    id?: number;
    purchaseId?: number;
    skuId?: number;
    skuNum?: number;
    skuPrice?: number;
    warehouseId?: number;
    status?: number;
  };

  type PurchaseDto = {
    id?: number;
    assigneeId?: number;
    assigneeName?: string;
    assigneeTele?: string;
    priority?: number;
    status?: number;
    warehouseId?: number;
    amount?: number;
    createDate?: string;
    updateDate?: string;
  };

  type Result = {
    success?: boolean;
    total?: number;
    code?: number;
    msg?: string;
    data?: Record<string, any>;
  };

  type SkuInventoryDto = {
    id?: number;
    skuId?: number;
    warehouseId?: number;
    stockCount?: number;
    skuName?: string;
    stockLockedCount?: number;
  };

  type WarehouseInfoDto = {
    id?: number;
    name?: string;
    address?: string;
    zipcode?: string;
  };
}
