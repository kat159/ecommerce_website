declare namespace API {
  type AttributeAttributeGroupDto = {
    id?: number;
    attrId?: number;
    attrGroupId?: number;
    attrSort?: number;
  };

  type AttributeDto = {
    id?: number;
    name?: string;
    icon?: string;
    searchStatus?: number;
    isSingleValue?: number;
    valueList?: string;
    type?: number;
    status?: number;
    categoryId?: number;
    display?: number;
  };

  type AttributeGroupDto = {
    id?: number;
    name?: string;
    sort?: number;
    description?: string;
    icon?: string;
    categoryId?: number;
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
    productUnit?: string;
    productCount?: number;
    subCategories?: CategoryDto[];
    children?: CategoryDto[];
  };

  type CommentReplyDto = {
    id?: number;
    commentId?: number;
    replyId?: number;
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

  type pageParams = {
    params: Record<string, any>;
  };

  type pageParams = {
    params: Record<string, any>;
  };

  type pageParams = {
    params: Record<string, any>;
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

  type ProductCommentDto = {
    id?: number;
    skuId?: number;
    productId?: number;
    productName?: string;
    memberNickname?: string;
    rating?: number;
    thumbsUp?: number;
    thumbsDowm?: number;
    createTime?: string;
    status?: number;
    productAttributes?: string;
    likesCount?: number;
    replyCount?: number;
    resources?: string;
    content?: string;
    memberAvatar?: string;
    commentType?: number;
  };

  type ProductDescriptionDto = {
    productId?: number;
    description?: string;
  };

  type ProductDto = {
    id?: number;
    name?: string;
    description?: string;
    categoryId?: number;
    brandId?: number;
    weight?: number;
    publishStatus?: number;
    createTime?: string;
    updateTime?: string;
  };

  type ProductImagesDto = {
    id?: number;
    productId?: number;
    imgName?: string;
    imgUrl?: string;
    imgSort?: number;
    defaultImg?: number;
  };

  type Result = {
    success?: boolean;
    total?: number;
    code?: number;
    msg?: string;
    data?: Record<string, any>;
  };

  type SkuAttrValueDto = {
    id?: number;
    skuId?: number;
    attrId?: number;
    attrName?: string;
    attrValue?: string;
    attrSort?: number;
  };

  type SkuDto = {
    id?: number;
    productId?: number;
    name?: string;
    description?: string;
    categoryId?: number;
    brandId?: number;
    defaultImg?: string;
    title?: string;
    subtitle?: string;
    price?: number;
    saleCount?: number;
  };

  type SkuImgDto = {
    id?: number;
    skuId?: number;
    img?: string;
    sort?: number;
    isDefault?: number;
  };
}
