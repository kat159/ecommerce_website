declare namespace API {
  type addAllAttrGroupParams = {
    id: number;
  };

  type addAllAttributeParams = {
    id: number;
  };

  type addAllProductParams = {
    id: number;
  };

  type addCategoryBrandParams = {
    id: number;
    cid: number;
  };

  type AttrFilter = {
    id?: number;
    values?: string[];
  };

  type AttributeDto = {
    id?: number;
    attributeGroupId?: number;
    name?: string;
    icon?: string;
    searchStatus?: number;
    selective?: number;
    selectableValueList?: string[];
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

  type AttributeGroupVo = {
    id?: number;
    name?: string;
    sort?: number;
    description?: string;
    icon?: string;
    attributes?: AttributeVo[];
  };

  type AttributeVo = {
    id?: number;
    attributeGroupId?: number;
    name?: string;
    icon?: string;
    searchStatus?: number;
    selective?: number;
    selectableValueList?: string[];
    type?: number;
    status?: number;
    display?: number;
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

  type BrandPaginationDto = {
    current?: number;
    pageSize?: number;
    orderFields?: string[];
    orderTypes?: string[];
    include?: string[];
    ids?: number[];
    name?: string;
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

  type CategoryManageDto = {
    originalForest?: CategoryManageVo[];
    newForest?: CategoryManageVo[];
  };

  type CategoryManageVo = {
    id?: number;
    name?: string;
    parentId?: number;
    level?: number;
    icon?: string;
    sort?: number;
    attributeGroups?: AttributeGroupVo[];
  };

  type CategoryPaginationDto = {
    current?: number;
    pageSize?: number;
    orderFields?: string[];
    orderTypes?: string[];
    include?: string[];
    ids?: number[];
    level?: number;
    name?: string;
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

  type get14Params = {
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

  type getAll1Params = {
    params: CategoryPaginationDto;
  };

  type getAllAttrGroupParams = {
    id: number;
    params: PaginationDto;
  };

  type getAllAttrGroupWithAttrListParams = {
    id: number;
  };

  type getAllAttributeParams = {
    id: number;
    params: PaginationDto;
  };

  type getAllCategoryBrandParams = {
    id: number;
  };

  type getAllParams = {
    params: PaginationDto;
  };

  type getAllProductParams = {
    id: number;
  };

  type getDetailBySkuIdParams = {
    skuId: number;
  };

  type getParams = {
    id: number;
  };

  type Image = {
    id?: string;
    url?: string;
  };

  type MultiValueAttribute = {
    id?: number;
    values?: string[];
  };

  type OrderSkuInternalDto = {
    orderId?: number;
    orderUUID?: string;
    skuId?: number;
    quantity?: number;
  };

  type page10Params = {
    params: PaginationDto;
  };

  type page11Params = {
    params: PaginationDto;
  };

  type page12Params = {
    params: BrandPaginationDto;
  };

  type page13Params = {
    params: PaginationDto;
  };

  type page14Params = {
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
    params: ProductPaginationDto;
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
    include?: string[];
    ids?: number[];
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
    sort?: number;
    isDefault?: number;
  };

  type ProductManageDto = {
    id: number;
    productToUpdate?: ProductDto;
    productImageIdsToDelete?: number[];
    productImagesToAdd?: ProductImageDto[];
    productAttrValuesToUpdate?: ProductAttrbuteValueDto[];
    skuImageIdsToDelete?: number[];
    skuImagesToAdd?: SkuImageDto[];
    skus?: SkuDto[];
  };

  type ProductPaginationDto = {
    current?: number;
    pageSize?: number;
    orderFields?: string[];
    orderTypes?: string[];
    include?: string[];
    ids?: number[];
  };

  type ProductPublishDto = {
    brandId?: number;
    categoryId?: number;
    name?: string;
    description?: string;
    productImageList?: Image[];
    saleAttrs?: MultiValueAttribute[];
    specAttrs?: MultiValueAttribute[];
    skuImageList?: Image[];
    skuList?: Sku[];
    publishStatus?: number;
  };

  type ProductSearchParams = {
    current?: number;
    pageSize?: number;
    orderFields?: string[];
    orderTypes?: string[];
    include?: string[];
    ids?: number[];
    keyword?: string;
    categoryId?: number;
    brandIds?: number[];
    specAttrFilters?: AttrFilter[];
    saleAttrFilters?: AttrFilter[];
    minPrice?: number;
    maxPrice?: number;
  };

  type Result = {
    success?: boolean;
    code?: number;
    msg?: string;
    data?: Record<string, any>;
  };

  type SingleValueAttribute = {
    id?: number;
    value?: string;
  };

  type Sku = {
    name?: string;
    description?: string;
    title?: string;
    subtitle?: string;
    price?: number;
    saleAttrs?: SingleValueAttribute[];
    imageIdList?: string[];
    saleCount?: number;
    giftCardBonus?: number;
    primeDiscount?: number;
    stock?: number;
    rating?: number;
    status?: number;
  };

  type SkuAttributeValueDto = {
    id?: number;
    skuId?: number;
    attributeId?: number;
    attributeName?: string;
    attributeValue?: string;
    sort?: number;
  };

  type SkuDto = {
    id?: number;
    productId?: number;
    name?: string;
    description?: string;
    defaultImg?: string;
    title?: string;
    subtitle?: string;
    price?: number;
    saleCount?: number;
    primeDiscount?: number;
    giftCardBonus?: number;
    stock?: number;
    rating?: number;
    status?: number;
    finalPrice?: number;
    ratingCount?: number;
  };

  type SkuImageDto = {
    id?: number;
    img?: string;
    sort?: number;
    isDefault?: number;
    uid?: string;
  };

  type SkuReviewDto = {
    id?: number;
    skuId?: number;
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

  type SkuReviewInternalDto = {
    skuId?: number;
    rating?: number;
  };

  type SkuReviewReplyDto = {
    id?: number;
    skuReviewId?: number;
    replyId?: number;
  };

  type SkuSkuImageDto = {
    skuId?: number;
    skuImageId?: number;
    id?: number;
    sort?: number;
  };

  type testParams = {
    params: PaginationDto;
  };
}
