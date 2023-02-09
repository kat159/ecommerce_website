declare namespace API {
  type addAllAttrGroupParams = {
    id: number;
  };

  type addAllAttributeParams = {
    id: number;
  };

  type AttributeDto = {
    id?: number;
    attributeGroupId?: number;
    name?: string;
    icon?: string;
    searchStatus?: number;
    selective?: number;
    selectableValueList?: string;
    type?: number;
    status?: number;
    display?: number;
  };

  type AttributeGroupDto = {
    id?: number;
    categoryId?: number;
    name?: string;
    sort?: number;
    description?: string;
    icon?: string;
  };

  type BrandDto = {
    id?: number;
    name?: string;
    logo?: string;
    description?: string;
    nonDeleted?: number;
    firstLetter?: string;
    sort?: number;
  };

  type CategoryBrandDto = {
    id?: number;
    brandId?: number;
    categoryId?: number;
    brandName?: string;
    categoryName?: string;
  };

  type CategoryDto = {
    id?: number;
    name?: string;
    parentId?: number;
    level?: number;
    nonDeleted?: number;
    sort?: number;
    icon?: string;
  };

  type get10Params = {
    id: number;
  };

  type get11Params = {
    id: number;
  };

  type get12Params = {
    id: number;
  };

  type get13Params = {
    id: number;
  };

  type get1Params = {
    id: number;
  };

  type get2Params = {
    id: number;
  };

  type get3Params = {
    id: number;
  };

  type get4Params = {
    id: number;
  };

  type get5Params = {
    id: number;
  };

  type get6Params = {
    id: number;
  };

  type get7Params = {
    id: number;
  };

  type get8Params = {
    id: number;
  };

  type get9Params = {
    id: number;
  };

  type getAllAttrGroupParams = {
    id: number;
    params: PaginationDto;
  };

  type getAllAttributeParams = {
    id: number;
    params: PaginationDto;
  };

  type getParams = {
    id: number;
  };

  type page10Params = {
    params: PaginationDto;
  };

  type page11Params = {
    params: PaginationDto;
  };

  type page12Params = {
    params: PaginationDto;
  };

  type page13Params = {
    params: PaginationDto;
  };

  type page1Params = {
    params: PaginationDto;
  };

  type page2Params = {
    params: PaginationDto;
  };

  type page3Params = {
    params: PaginationDto;
  };

  type page4Params = {
    params: PaginationDto;
  };

  type page5Params = {
    params: PaginationDto;
  };

  type page6Params = {
    params: PaginationDto;
  };

  type page7Params = {
    params: PaginationDto;
  };

  type page8Params = {
    params: PaginationDto;
  };

  type page9Params = {
    params: PaginationDto;
  };

  type pageAttrGroupParams = {
    id: number;
    params: PaginationDto;
  };

  type pageParams = {
    params: PaginationDto;
  };

  type PaginationDto = {
    current?: number;
    pageSize?: number;
    orderFields?: string[];
    orderTypes?: string[];
  };

  type ProductAttrbuteValueDto = {
    id?: number;
    productId?: number;
    attributeId?: number;
    attributeName?: string;
    attributeValue?: string;
    attributeSort?: number;
    display?: number;
  };

  type ProductDescriptionDto = {
    productId?: number;
    description?: string;
  };

  type ProductDto = {
    id?: number;
    categoryId?: number;
    brandId?: number;
    name?: string;
    description?: string;
    publishStatus?: number;
    createTime?: string;
    updateTime?: string;
  };

  type ProductImageDto = {
    id?: number;
    productId?: number;
    name?: string;
    url?: string;
    displayOrder?: number;
    isDefault?: number;
  };

  type ProductReviewDto = {
    id?: number;
    skuId?: number;
    productId?: number;
    productName?: string;
    memberNickname?: string;
    rating?: number;
    thumbsUp?: number;
    createDate?: string;
    status?: number;
    productAttributes?: string;
    replyCount?: number;
    resources?: string;
    content?: string;
    memberAvatar?: string;
    commentType?: number;
  };

  type Result = {
    success?: boolean;
    code?: number;
    msg?: string;
    data?: Record<string, any>;
  };

  type ReviewReplyDto = {
    id?: number;
    reviewId?: number;
    replyId?: number;
  };

  type SkuAttrValueDto = {
    id?: number;
    skuId?: number;
    attrId?: number;
    attrName?: string;
    attrValue?: string;
    displayOrder?: number;
  };

  type SkuDto = {
    id?: number;
    productId?: number;
    categoryId?: number;
    brandId?: number;
    name?: string;
    description?: string;
    defaultImg?: string;
    title?: string;
    subtitle?: string;
    price?: number;
    saleCount?: number;
  };

  type SkuImageDto = {
    id?: number;
    skuId?: number;
    img?: string;
    sort?: number;
    isDefault?: number;
  };
}
