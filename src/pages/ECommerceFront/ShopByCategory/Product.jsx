import React, {useState, useEffect, useMemo} from "react";
import {
  Row,
  Col,
  Card,
  Select,
  Typography,
  Divider,
  Tabs,
  Rate,
  List,
  Button,
  Carousel,
  Input,
  Radio, Space, Descriptions
} from 'antd';

const {Option} = Select;
const {Title, Text} = Typography;
import MyImage from "@/components/DataDisplay/MyImage";

const {FitSize} = MyImage;

import dbmsProduct from "@/services/dbms-product";
import Gallery from "@/components/DataDisplay/MyImage/Gallery";
import ImageGallery from "react-image-gallery";
import {TaobaoSquareFilled} from "@ant-design/icons";

const productService = dbmsProduct.productController;

const ProductPage = ({}) => {
  const data = {
    "id": 38,
    "categoryId": 31,
    "brandId": 22,
    "name": "BBphone 4s",
    "description": "a good phone",
    "publishStatus": 1,
    "brandName": "BBphone",
    "categoryName": "cell phone",
    "images": [
      {
        "id": 79,
        "productId": 38,
        "url": "https://firebasestorage.googleapis.com/v0/b/ecommerce-6ee5d.appspot.com/o/product-image%2F1677243250156_undefined?alt=media&token=f9add4d2-3f5a-41e3-b1ff-efef87ce4360",
        "sort": null,
        "isDefault": null
      },
      {
        "id": 80,
        "productId": 38,
        "url": "https://firebasestorage.googleapis.com/v0/b/ecommerce-6ee5d.appspot.com/o/product-image%2F1677243250158_undefined?alt=media&token=f894f274-f090-43d0-9a45-cd6a6594f993",
        "sort": null,
        "isDefault": null
      }
    ],
    "attributeGroups": [
      {
        "id": 51,
        "name": "Design",
        "sort": 1,
        "description": null,
        "icon": null,
        "attributes": [
          {
            "id": 10,
            "attributeGroupId": 51,
            "name": "Color",
            "icon": null,
            "searchStatus": 1,
            "selective": 0,
            "selectableValueList": [
              "black",
              "white",
              "red"
            ],
            "type": 0,
            "status": null,
            "display": 0
          }
        ]
      },
      {
        "id": 53,
        "name": "Display",
        "sort": 2,
        "description": null,
        "icon": null,
        "attributes": [
          {
            "id": 12,
            "attributeGroupId": 53,
            "name": "size",
            "icon": null,
            "searchStatus": 0,
            "selective": 1,
            "selectableValueList": [
              "4.7\"",
              "6.4\"",
              "7.1\""
            ],
            "type": 1,
            "status": null,
            "display": 0
          },
          {
            "id": 13,
            "attributeGroupId": 53,
            "name": "Resolution",
            "icon": null,
            "searchStatus": 1,
            "selective": 0,
            "selectableValueList": [
              "1280 x 720",
              "1600 x 900",
              "1920 x 1080"
            ],
            "type": 1,
            "status": null,
            "display": 0
          },
          {
            "id": 14,
            "attributeGroupId": 53,
            "name": "Pixel Density",
            "icon": null,
            "searchStatus": 0,
            "selective": 0,
            "selectableValueList": [
              "266 ppi",
              "326 ppi",
              "401 ppi"
            ],
            "type": 1,
            "status": null,
            "display": 0
          },
          {
            "id": 23,
            "attributeGroupId": 53,
            "name": "Aspect Ratio",
            "icon": null,
            "searchStatus": 1,
            "selective": null,
            "selectableValueList": [
              "16:9",
              "18.5:9",
              "19.5:9",
              "21:9"
            ],
            "type": 1,
            "status": null,
            "display": 0
          }
        ]
      },
      {
        "id": 52,
        "name": "Configuration",
        "sort": 3,
        "description": null,
        "icon": null,
        "attributes": [
          {
            "id": 11,
            "attributeGroupId": 52,
            "name": "Storage",
            "icon": null,
            "searchStatus": 1,
            "selective": 1,
            "selectableValueList": [
              "64GB",
              "128GB",
              "256GB",
              "512GB"
            ],
            "type": 0,
            "status": null,
            "display": 0
          },
          {
            "id": 15,
            "attributeGroupId": 52,
            "name": "RAM",
            "icon": null,
            "searchStatus": 1,
            "selective": 0,
            "selectableValueList": [
              "2GB",
              "4GB",
              "6GB",
              "8GB"
            ],
            "type": 1,
            "status": null,
            "display": 0
          }
        ]
      },
      {
        "id": 54,
        "name": " Battery",
        "sort": 4,
        "description": null,
        "icon": null,
        "attributes": [
          {
            "id": 16,
            "attributeGroupId": 54,
            "name": "Type",
            "icon": null,
            "searchStatus": 0,
            "selective": null,
            "selectableValueList": [
              "Non-removable Li-Po Battery"
            ],
            "type": 1,
            "status": null,
            "display": 0
          },
          {
            "id": 17,
            "attributeGroupId": 54,
            "name": "Operating Time",
            "icon": null,
            "searchStatus": 1,
            "selective": null,
            "selectableValueList": [
              "Up to 6 Hours",
              "6 to 12 Hours",
              "12 to 18 Hours",
              "18 Hours & Above"
            ],
            "type": 1,
            "status": null,
            "display": 0
          },
          {
            "id": 18,
            "attributeGroupId": 54,
            "name": "Capacity",
            "icon": null,
            "searchStatus": 0,
            "selective": null,
            "selectableValueList": [
              "3000 mAh",
              "3600 mAh",
              "4200 mAh",
              "5000 mAh"
            ],
            "type": 1,
            "status": null,
            "display": 0
          },
          {
            "id": 19,
            "attributeGroupId": 54,
            "name": "Talk Time",
            "icon": null,
            "searchStatus": 0,
            "selective": null,
            "selectableValueList": [
              "Up to 24 Hours",
              "Up to 30 Hours",
              "Up to 36 Hours",
              "Up to 42 Hours & more"
            ],
            "type": 1,
            "status": null,
            "display": 0
          },
          {
            "id": 24,
            "attributeGroupId": 54,
            "name": "Charging",
            "icon": null,
            "searchStatus": 0,
            "selective": null,
            "selectableValueList": [
              "Fast Charging",
              "Quick Charge 3.0",
              "Quick Charge 4.0",
              "Quick Charge 4+",
              "Wireless Charging"
            ],
            "type": 1,
            "status": null,
            "display": 0
          }
        ]
      },
      {
        "id": 58,
        "name": "Dimensions & Weight",
        "sort": 5,
        "description": null,
        "icon": null,
        "attributes": [
          {
            "id": 25,
            "attributeGroupId": 58,
            "name": "Dimensions",
            "icon": null,
            "searchStatus": 0,
            "selective": null,
            "selectableValueList": [
              "6.47\" x 3.15\" x 0.35\"",
              "6.5\" x 3.2\" x 0.4\"",
              "6.7\" x 3.3\" x 0.4\""
            ],
            "type": 1,
            "status": null,
            "display": 0
          },
          {
            "id": 26,
            "attributeGroupId": 58,
            "name": "Weight",
            "icon": null,
            "searchStatus": 0,
            "selective": null,
            "selectableValueList": [
              "5.64 oz",
              "6.14 oz",
              "6.63 oz",
              "7.13 oz"
            ],
            "type": 1,
            "status": null,
            "display": 0
          }
        ]
      }
    ],
    "productAttributeValues": [
      {
        "id": 344,
        "productId": 38,
        "attributeId": 10,
        "attributeValue": "white<----->black<----->red",
        "attributeSort": null,
        "display": null,
        "attributeName": "Color",
        "attributeType": 0,
        "attributeValueList": [
          "white",
          "black",
          "red"
        ]
      },
      {
        "id": 345,
        "productId": 38,
        "attributeId": 11,
        "attributeValue": "512GB<----->256GB<----->128GB",
        "attributeSort": null,
        "display": null,
        "attributeName": "Storage",
        "attributeType": 0,
        "attributeValueList": [
          "512GB",
          "256GB",
          "128GB"
        ]
      },
      {
        "id": 346,
        "productId": 38,
        "attributeId": 12,
        "attributeValue": "7.1\"",
        "attributeSort": null,
        "display": null,
        "attributeName": "size",
        "attributeType": 1,
        "attributeValueList": [
          "7.1\""
        ]
      },
      {
        "id": 347,
        "productId": 38,
        "attributeId": 13,
        "attributeValue": "1920 x 1080",
        "attributeSort": null,
        "display": null,
        "attributeName": "Resolution",
        "attributeType": 1,
        "attributeValueList": [
          "1920 x 1080"
        ]
      },
      {
        "id": 348,
        "productId": 38,
        "attributeId": 14,
        "attributeValue": "266 ppi",
        "attributeSort": null,
        "display": null,
        "attributeName": "Pixel Density",
        "attributeType": 1,
        "attributeValueList": [
          "266 ppi"
        ]
      },
      {
        "id": 349,
        "productId": 38,
        "attributeId": 23,
        "attributeValue": "19.5:9",
        "attributeSort": null,
        "display": null,
        "attributeName": "Aspect Ratio",
        "attributeType": 1,
        "attributeValueList": [
          "19.5:9"
        ]
      },
      {
        "id": 350,
        "productId": 38,
        "attributeId": 15,
        "attributeValue": "6GB",
        "attributeSort": null,
        "display": null,
        "attributeName": "RAM",
        "attributeType": 1,
        "attributeValueList": [
          "6GB"
        ]
      },
      {
        "id": 351,
        "productId": 38,
        "attributeId": 16,
        "attributeValue": "Non-removable Li-Po Battery",
        "attributeSort": null,
        "display": null,
        "attributeName": "Type",
        "attributeType": 1,
        "attributeValueList": [
          "Non-removable Li-Po Battery"
        ]
      },
      {
        "id": 352,
        "productId": 38,
        "attributeId": 17,
        "attributeValue": "Up to 6 Hours",
        "attributeSort": null,
        "display": null,
        "attributeName": "Operating Time",
        "attributeType": 1,
        "attributeValueList": [
          "Up to 6 Hours"
        ]
      },
      {
        "id": 353,
        "productId": 38,
        "attributeId": 18,
        "attributeValue": "5000 mAh",
        "attributeSort": null,
        "display": null,
        "attributeName": "Capacity",
        "attributeType": 1,
        "attributeValueList": [
          "5000 mAh"
        ]
      },
      {
        "id": 354,
        "productId": 38,
        "attributeId": 19,
        "attributeValue": "Up to 24 Hours",
        "attributeSort": null,
        "display": null,
        "attributeName": "Talk Time",
        "attributeType": 1,
        "attributeValueList": [
          "Up to 24 Hours"
        ]
      },
      {
        "id": 355,
        "productId": 38,
        "attributeId": 24,
        "attributeValue": "Fast Charging",
        "attributeSort": null,
        "display": null,
        "attributeName": "Charging",
        "attributeType": 1,
        "attributeValueList": [
          "Fast Charging"
        ]
      },
      {
        "id": 356,
        "productId": 38,
        "attributeId": 25,
        "attributeValue": "6.47\" x 3.15\" x 0.35\"",
        "attributeSort": null,
        "display": null,
        "attributeName": "Dimensions",
        "attributeType": 1,
        "attributeValueList": [
          "6.47\" x 3.15\" x 0.35\""
        ]
      },
      {
        "id": 357,
        "productId": 38,
        "attributeId": 26,
        "attributeValue": "7.13 oz",
        "attributeSort": null,
        "display": null,
        "attributeName": "Weight",
        "attributeType": 1,
        "attributeValueList": [
          "7.13 oz"
        ]
      }
    ],
    "skuImages": [
      {
        "id": 400,
        "img": "https://firebasestorage.googleapis.com/v0/b/ecommerce-6ee5d.appspot.com/o/sku-image%2F1677243264883_undefined?alt=media&token=b470aa49-e7d1-4288-9393-90765fbf418f",
        "sort": null,
        "isDefault": null
      },
      {
        "id": 401,
        "img": "https://firebasestorage.googleapis.com/v0/b/ecommerce-6ee5d.appspot.com/o/sku-image%2F1677243277791_undefined?alt=media&token=9779adee-6f7b-4689-8ed1-f6ca3bc0715a",
        "sort": null,
        "isDefault": null
      },
      {
        "id": 402,
        "img": "https://firebasestorage.googleapis.com/v0/b/ecommerce-6ee5d.appspot.com/o/sku-image%2F1677243277793_undefined?alt=media&token=ee5f3082-7d7a-4593-8602-7c61d649114b",
        "sort": null,
        "isDefault": null
      },
      {
        "id": 403,
        "img": "https://firebasestorage.googleapis.com/v0/b/ecommerce-6ee5d.appspot.com/o/sku-image%2F1677243277796_undefined?alt=media&token=9cb53e2f-a7a6-4d97-a75a-bf5295a884e0",
        "sort": null,
        "isDefault": null
      },
      {
        "id": 395,
        "img": "https://firebasestorage.googleapis.com/v0/b/ecommerce-6ee5d.appspot.com/o/sku-image%2F1677243255816_undefined?alt=media&token=d0d077c5-90f1-4aae-9b17-39cf966b6142",
        "sort": null,
        "isDefault": null
      },
      {
        "id": 396,
        "img": "https://firebasestorage.googleapis.com/v0/b/ecommerce-6ee5d.appspot.com/o/sku-image%2F1677243255818_undefined?alt=media&token=d723417c-8adf-4a22-a275-18cb36e33902",
        "sort": null,
        "isDefault": null
      },
      {
        "id": 397,
        "img": "https://firebasestorage.googleapis.com/v0/b/ecommerce-6ee5d.appspot.com/o/sku-image%2F1677243255820_undefined?alt=media&token=3e999432-5089-4235-84fb-10ad03d669ec",
        "sort": null,
        "isDefault": null
      },
      {
        "id": 398,
        "img": "https://firebasestorage.googleapis.com/v0/b/ecommerce-6ee5d.appspot.com/o/sku-image%2F1677243264880_undefined?alt=media&token=520fe7d3-f4c8-4000-9819-cdbface7c60b",
        "sort": null,
        "isDefault": null
      },
      {
        "id": 399,
        "img": "https://firebasestorage.googleapis.com/v0/b/ecommerce-6ee5d.appspot.com/o/sku-image%2F1677243264881_undefined?alt=media&token=6b41132e-e03d-4cff-8ed2-c8314e9f4482",
        "sort": null,
        "isDefault": null
      }
    ],
    "skus": [
      {
        "id": 186,
        "productId": 38,
        "name": "BBphone 4s red 64GB",
        "description": "BBphone 4s Color red Storage 64GB",
        "defaultImg": null,
        "title": "BBphone 4s red 64GB",
        "subtitle": "subtitle",
        "price": 68343.0372,
        "saleCount": 911,
        "primeDiscount": 84,
        "giftCardBonus": 318,
        "stock": 264,
        "rating": 1.8421,
        "skuSkuImages": [
          {
            "skuId": 186,
            "skuImageId": 401,
            "id": 492,
            "sort": null,
            "url": null
          },
          {
            "skuId": 186,
            "skuImageId": 402,
            "id": 493,
            "sort": null,
            "url": null
          },
          {
            "skuId": 186,
            "skuImageId": 403,
            "id": 494,
            "sort": null,
            "url": null
          }
        ],
        "saleAttrValues": [
          {
            "id": 354,
            "skuId": 186,
            "attributeId": 10,
            "attributeName": null,
            "attributeValue": "red",
            "sort": null
          },
          {
            "id": 355,
            "skuId": 186,
            "attributeId": 11,
            "attributeName": null,
            "attributeValue": "64GB",
            "sort": null
          }
        ],
        "reviews": null,
        "skuImages": null,
        "status": 1
      },
      {
        "id": 187,
        "productId": 38,
        "name": "BBphone 4s red 128GB",
        "description": "BBphone 4s Color red Storage 128GB",
        "defaultImg": null,
        "title": "BBphone 4s red 128GB",
        "subtitle": "subtitle",
        "price": 70177.5808,
        "saleCount": 94,
        "primeDiscount": 39,
        "giftCardBonus": 994,
        "stock": 224,
        "rating": 3.3979,
        "skuSkuImages": [
          {
            "skuId": 187,
            "skuImageId": 401,
            "id": 495,
            "sort": null,
            "url": null
          },
          {
            "skuId": 187,
            "skuImageId": 402,
            "id": 496,
            "sort": null,
            "url": null
          },
          {
            "skuId": 187,
            "skuImageId": 403,
            "id": 497,
            "sort": null,
            "url": null
          }
        ],
        "saleAttrValues": [
          {
            "id": 356,
            "skuId": 187,
            "attributeId": 10,
            "attributeName": null,
            "attributeValue": "red",
            "sort": null
          },
          {
            "id": 357,
            "skuId": 187,
            "attributeId": 11,
            "attributeName": null,
            "attributeValue": "128GB",
            "sort": null
          }
        ],
        "reviews": null,
        "skuImages": null,
        "status": 1
      },
      {
        "id": 188,
        "productId": 38,
        "name": "BBphone 4s red 256GB",
        "description": "BBphone 4s Color red Storage 256GB",
        "defaultImg": null,
        "title": "BBphone 4s red 256GB",
        "subtitle": "subtitle",
        "price": 74253.2317,
        "saleCount": 258,
        "primeDiscount": 91,
        "giftCardBonus": 907,
        "stock": 284,
        "rating": 4.5866,
        "skuSkuImages": [
          {
            "skuId": 188,
            "skuImageId": 401,
            "id": 498,
            "sort": null,
            "url": null
          },
          {
            "skuId": 188,
            "skuImageId": 402,
            "id": 499,
            "sort": null,
            "url": null
          },
          {
            "skuId": 188,
            "skuImageId": 403,
            "id": 500,
            "sort": null,
            "url": null
          }
        ],
        "saleAttrValues": [
          {
            "id": 358,
            "skuId": 188,
            "attributeId": 10,
            "attributeName": null,
            "attributeValue": "red",
            "sort": null
          },
          {
            "id": 359,
            "skuId": 188,
            "attributeId": 11,
            "attributeName": null,
            "attributeValue": "256GB",
            "sort": null
          }
        ],
        "reviews": null,
        "skuImages": null,
        "status": 1
      },
      {
        "id": 189,
        "productId": 38,
        "name": "BBphone 4s red 512GB",
        "description": "BBphone 4s Color red Storage 512GB",
        "defaultImg": null,
        "title": "BBphone 4s red 512GB",
        "subtitle": "subtitle",
        "price": 14810.33,
        "saleCount": 205,
        "primeDiscount": 12,
        "giftCardBonus": 997,
        "stock": 356,
        "rating": 0.0644,
        "skuSkuImages": [
          {
            "skuId": 189,
            "skuImageId": 401,
            "id": 501,
            "sort": null,
            "url": null
          },
          {
            "skuId": 189,
            "skuImageId": 402,
            "id": 502,
            "sort": null,
            "url": null
          },
          {
            "skuId": 189,
            "skuImageId": 403,
            "id": 503,
            "sort": null,
            "url": null
          }
        ],
        "saleAttrValues": [
          {
            "id": 360,
            "skuId": 189,
            "attributeId": 10,
            "attributeName": null,
            "attributeValue": "red",
            "sort": null
          },
          {
            "id": 361,
            "skuId": 189,
            "attributeId": 11,
            "attributeName": null,
            "attributeValue": "512GB",
            "sort": null
          }
        ],
        "reviews": null,
        "skuImages": null,
        "status": 1
      },
      {
        "id": 190,
        "productId": 38,
        "name": "BBphone 4s white 64GB",
        "description": "BBphone 4s Color white Storage 64GB",
        "defaultImg": null,
        "title": "BBphone 4s white 64GB",
        "subtitle": "subtitle",
        "price": 10670.5829,
        "saleCount": 158,
        "primeDiscount": 1,
        "giftCardBonus": 678,
        "stock": 846,
        "rating": 1.1244,
        "skuSkuImages": [
          {
            "skuId": 190,
            "skuImageId": 398,
            "id": 504,
            "sort": null,
            "url": null
          },
          {
            "skuId": 190,
            "skuImageId": 399,
            "id": 505,
            "sort": null,
            "url": null
          },
          {
            "skuId": 190,
            "skuImageId": 400,
            "id": 506,
            "sort": null,
            "url": null
          }
        ],
        "saleAttrValues": [
          {
            "id": 362,
            "skuId": 190,
            "attributeId": 10,
            "attributeName": null,
            "attributeValue": "white",
            "sort": null
          },
          {
            "id": 363,
            "skuId": 190,
            "attributeId": 11,
            "attributeName": null,
            "attributeValue": "64GB",
            "sort": null
          }
        ],
        "reviews": null,
        "skuImages": null,
        "status": 1
      },
      {
        "id": 191,
        "productId": 38,
        "name": "BBphone 4s white 128GB",
        "description": "BBphone 4s Color white Storage 128GB",
        "defaultImg": null,
        "title": "BBphone 4s white 128GB",
        "subtitle": "subtitle",
        "price": 58360.1628,
        "saleCount": 599,
        "primeDiscount": 28,
        "giftCardBonus": 352,
        "stock": 111,
        "rating": 1.7488,
        "skuSkuImages": [
          {
            "skuId": 191,
            "skuImageId": 398,
            "id": 507,
            "sort": null,
            "url": null
          },
          {
            "skuId": 191,
            "skuImageId": 399,
            "id": 508,
            "sort": null,
            "url": null
          },
          {
            "skuId": 191,
            "skuImageId": 400,
            "id": 509,
            "sort": null,
            "url": null
          }
        ],
        "saleAttrValues": [
          {
            "id": 364,
            "skuId": 191,
            "attributeId": 10,
            "attributeName": null,
            "attributeValue": "white",
            "sort": null
          },
          {
            "id": 365,
            "skuId": 191,
            "attributeId": 11,
            "attributeName": null,
            "attributeValue": "128GB",
            "sort": null
          }
        ],
        "reviews": null,
        "skuImages": null,
        "status": 1
      },
      {
        "id": 192,
        "productId": 38,
        "name": "BBphone 4s white 256GB",
        "description": "BBphone 4s Color white Storage 256GB",
        "defaultImg": null,
        "title": "BBphone 4s white 256GB",
        "subtitle": "subtitle",
        "price": 26626.099,
        "saleCount": 164,
        "primeDiscount": 64,
        "giftCardBonus": 346,
        "stock": 292,
        "rating": 3.3646,
        "skuSkuImages": [
          {
            "skuId": 192,
            "skuImageId": 398,
            "id": 510,
            "sort": null,
            "url": null
          },
          {
            "skuId": 192,
            "skuImageId": 399,
            "id": 511,
            "sort": null,
            "url": null
          },
          {
            "skuId": 192,
            "skuImageId": 400,
            "id": 512,
            "sort": null,
            "url": null
          }
        ],
        "saleAttrValues": [
          {
            "id": 366,
            "skuId": 192,
            "attributeId": 10,
            "attributeName": null,
            "attributeValue": "white",
            "sort": null
          },
          {
            "id": 367,
            "skuId": 192,
            "attributeId": 11,
            "attributeName": null,
            "attributeValue": "256GB",
            "sort": null
          }
        ],
        "reviews": null,
        "skuImages": null,
        "status": 1
      },
      {
        "id": 193,
        "productId": 38,
        "name": "BBphone 4s white 512GB",
        "description": "BBphone 4s Color white Storage 512GB",
        "defaultImg": null,
        "title": "BBphone 4s white 512GB",
        "subtitle": "subtitle",
        "price": 97861.5532,
        "saleCount": 531,
        "primeDiscount": 59,
        "giftCardBonus": 55,
        "stock": 600,
        "rating": 3.532,
        "skuSkuImages": [
          {
            "skuId": 193,
            "skuImageId": 398,
            "id": 513,
            "sort": null,
            "url": null
          },
          {
            "skuId": 193,
            "skuImageId": 399,
            "id": 514,
            "sort": null,
            "url": null
          },
          {
            "skuId": 193,
            "skuImageId": 400,
            "id": 515,
            "sort": null,
            "url": null
          }
        ],
        "saleAttrValues": [
          {
            "id": 368,
            "skuId": 193,
            "attributeId": 10,
            "attributeName": null,
            "attributeValue": "white",
            "sort": null
          },
          {
            "id": 369,
            "skuId": 193,
            "attributeId": 11,
            "attributeName": null,
            "attributeValue": "512GB",
            "sort": null
          }
        ],
        "reviews": null,
        "skuImages": null,
        "status": 1
      },
      {
        "id": 194,
        "productId": 38,
        "name": "BBphone 4s black 64GB",
        "description": "BBphone 4s Color black Storage 64GB",
        "defaultImg": null,
        "title": "BBphone 4s black 64GB",
        "subtitle": "subtitle",
        "price": 86025.7729,
        "saleCount": 878,
        "primeDiscount": 60,
        "giftCardBonus": 981,
        "stock": 789,
        "rating": 0.8641,
        "skuSkuImages": [
          {
            "skuId": 194,
            "skuImageId": 395,
            "id": 516,
            "sort": null,
            "url": null
          },
          {
            "skuId": 194,
            "skuImageId": 396,
            "id": 517,
            "sort": null,
            "url": null
          },
          {
            "skuId": 194,
            "skuImageId": 397,
            "id": 518,
            "sort": null,
            "url": null
          }
        ],
        "saleAttrValues": [
          {
            "id": 370,
            "skuId": 194,
            "attributeId": 10,
            "attributeName": null,
            "attributeValue": "black",
            "sort": null
          },
          {
            "id": 371,
            "skuId": 194,
            "attributeId": 11,
            "attributeName": null,
            "attributeValue": "64GB",
            "sort": null
          }
        ],
        "reviews": null,
        "skuImages": null,
        "status": 1
      },
      {
        "id": 195,
        "productId": 38,
        "name": "BBphone 4s black 128GB",
        "description": "BBphone 4s Color black Storage 128GB",
        "defaultImg": null,
        "title": "BBphone 4s black 128GB",
        "subtitle": "subtitle",
        "price": 42321.9948,
        "saleCount": 831,
        "primeDiscount": 67,
        "giftCardBonus": 254,
        "stock": 860,
        "rating": 2.2884,
        "skuSkuImages": [
          {
            "skuId": 195,
            "skuImageId": 395,
            "id": 519,
            "sort": null,
            "url": null
          },
          {
            "skuId": 195,
            "skuImageId": 396,
            "id": 520,
            "sort": null,
            "url": null
          },
          {
            "skuId": 195,
            "skuImageId": 397,
            "id": 521,
            "sort": null,
            "url": null
          }
        ],
        "saleAttrValues": [
          {
            "id": 372,
            "skuId": 195,
            "attributeId": 10,
            "attributeName": null,
            "attributeValue": "black",
            "sort": null
          },
          {
            "id": 373,
            "skuId": 195,
            "attributeId": 11,
            "attributeName": null,
            "attributeValue": "128GB",
            "sort": null
          }
        ],
        "reviews": null,
        "skuImages": null,
        "status": 1
      },
      {
        "id": 196,
        "productId": 38,
        "name": "BBphone 4s black 256GB",
        "description": "BBphone 4s Color black Storage 256GB",
        "defaultImg": null,
        "title": "BBphone 4s black 256GB",
        "subtitle": "subtitle",
        "price": 96697.0983,
        "saleCount": 500,
        "primeDiscount": 84,
        "giftCardBonus": 843,
        "stock": 702,
        "rating": 0.8804,
        "skuSkuImages": [
          {
            "skuId": 196,
            "skuImageId": 395,
            "id": 522,
            "sort": null,
            "url": null
          },
          {
            "skuId": 196,
            "skuImageId": 396,
            "id": 523,
            "sort": null,
            "url": null
          },
          {
            "skuId": 196,
            "skuImageId": 397,
            "id": 524,
            "sort": null,
            "url": null
          }
        ],
        "saleAttrValues": [
          {
            "id": 374,
            "skuId": 196,
            "attributeId": 10,
            "attributeName": null,
            "attributeValue": "black",
            "sort": null
          },
          {
            "id": 375,
            "skuId": 196,
            "attributeId": 11,
            "attributeName": null,
            "attributeValue": "256GB",
            "sort": null
          }
        ],
        "reviews": null,
        "skuImages": null,
        "status": 1
      },
      {
        "id": 197,
        "productId": 38,
        "name": "BBphone 4s black 512GB",
        "description": "BBphone 4s Color black Storage 512GB",
        "defaultImg": null,
        "title": "BBphone 4s black 512GB",
        "subtitle": "subtitle",
        "price": 24984.2329,
        "saleCount": 735,
        "primeDiscount": 1,
        "giftCardBonus": 241,
        "stock": 586,
        "rating": 0.9974,
        "skuSkuImages": [
          {
            "skuId": 197,
            "skuImageId": 395,
            "id": 525,
            "sort": null,
            "url": null
          },
          {
            "skuId": 197,
            "skuImageId": 396,
            "id": 526,
            "sort": null,
            "url": null
          },
          {
            "skuId": 197,
            "skuImageId": 397,
            "id": 527,
            "sort": null,
            "url": null
          }
        ],
        "saleAttrValues": [
          {
            "id": 376,
            "skuId": 197,
            "attributeId": 10,
            "attributeName": null,
            "attributeValue": "black",
            "sort": null
          },
          {
            "id": 377,
            "skuId": 197,
            "attributeId": 11,
            "attributeName": null,
            "attributeValue": "512GB",
            "sort": null
          }
        ],
        "reviews": null,
        "skuImages": null,
        "status": 1
      }
    ]
  }

  // selected sale attributes, changed by click
  const productSaleAttrs = data.productAttributeValues.filter((item) => item.attributeType === 0 || item.attributeType === 2);
  const [selectedSaleAttrValuesMap, setSelectedSaleAttrValuesMap]
    = useState(
    productSaleAttrs.reduce((acc, cur) => {
      acc[cur.attributeId] = cur.attributeValueList[0];
      return acc;
    }, {})
  )
  console.log(selectedSaleAttrValuesMap)
  // selected sku, change when selected sale attributes changed
  const [selectedSku, setSelectedSku] = useState(null);
  // change selected sku when selected sale attributes changed
  useEffect(() => {
    // TODO: 如果初始的selectedSaleAttrValuesMap的sku缺货/不存在，需要重新选择，要在初始前就判断筛选所有可用的选项
    console.log(data.skus)
    console.log('selectedSaleAttrValuesMap', selectedSaleAttrValuesMap)
    for (const sku of data.skus) {
      let match = true;
      for (const saleAttr of sku.saleAttrValues) {
        const {attributeId, attributeValue} = saleAttr;
        console.log(attributeId, attributeValue, selectedSaleAttrValuesMap[attributeId])
        if (saleAttr.attributeValue !== selectedSaleAttrValuesMap[saleAttr.attributeId]) {
          match = false;
          break;
        }
      }
      if (match) {
        setSelectedSku(sku);
      }
    }
  }, [selectedSaleAttrValuesMap])

  const skuImageIdMap = useMemo(() => {
    return data.skuImages.reduce((acc, cur) => {
      const {id, img} = cur;
      const image = new Image();
      image.src = img;
      acc[cur.id] = <FitSize url={img}/>
      return acc;
    }, {});
  }, [data.skuImages])
  const SkuImages = useMemo(() => {
    // console.log('data.skuImages', data.skuImages)
  }, [data.skuImages])
  const LeftImageGallery = useMemo(() => {

    const imagesOfSelectedSku = selectedSku?.skuSkuImages?.map((item) => skuImageIdMap[item.skuImageId]) ?? [];
    console.log('imagesOfSelectedSku', imagesOfSelectedSku)
    let imageData = imagesOfSelectedSku.map((imageComponent) => ({
      original: imageComponent,
      thumbnail: imageComponent,
    }))
    // imageData = imageData.concat(imageData)
    return (
      // <Gallery urls={imagesOfSelectedSku.map((imageVo) => imageVo.img)}/>
      <ImageGallery
        className="image-gallery"
        items={imageData}
        showPlayButton={false}
        showFullscreenButton={false}
        showNav={false}
        showBullets={false}
        showThumbnails={true}
        showIndex={false}
        renderItem={(item) => (
          <div
            style={{
              padding: '0 min(10%, 10px)',
            }}
          >
            {item.original}
          </div>
        )}
        thumbnailWidth={50}
        renderThumbInner={(item) => (
          <div
            style={{
              padding: 'min(10%, 10px)',
              border: '1px solid #e8e8e8',
            }}
          >
            {/*<MyImage.FitSize url={item.original} style={{}}/>*/}
            {item.original}
          </div>
        )}
      />
      // <div>111</div>
    )
  }, [selectedSku])
  const RightProductInfo = useMemo(() => {
    if (!selectedSku) {
      return null
    }
    const {
      name,
      title,
      subtitle,
      price,
      stock,
      rating,
      saleCount,
      description,
      primeDiscount,
      giftCardBonus
    } = selectedSku;
    const Price = (
      <div>
          <span
            style={{
              textDecoration: 'line-through',
              fontSize: '14px',
              color: '#999',
              fontFamily: 'Arial, Helvetica, sans-serif',
            }}
          >
            ${price.toFixed(2)}
          </span>
        <span
          style={{
            fontSize: '25px',
            color: 'black',
            fontWeight: 'bold',
            fontFamily: 'Arial, Helvetica, sans-serif',
          }}
        >
            ${(price * (1 - primeDiscount / 100)).toFixed(2)}
          </span>
      </div>
    )
    const SaleAttrSelector = (
      <div>
        <Space direction={'vertical'}>
          {productSaleAttrs.map((item, index) => {
            const {attributeId: saleAttrId, attributeValueList: saleAttrValues} = item;
            return (
              <div key={index}>
                <div
                  style={{
                    marginBottom: '5px',
                  }}
                >
                    <span
                      style={{
                        color: '#7a7a7a',
                      }}
                    >{item.attributeName}: </span>
                  <span
                    style={{
                      color: 'black',
                      fontWeight: '500',
                      fontSize: '16px',
                    }}
                  >{selectedSaleAttrValuesMap[saleAttrId]}</span>
                </div>
                <Space>
                  {
                    saleAttrValues.map((value, index) => {
                      return (
                        <Button
                          key={index}
                          // type={selectedSaleAttrValuesMap[saleAttrId] === value ? 'primary' : 'default'}
                          onClick={() => {
                            setSelectedSaleAttrValuesMap({
                              ...selectedSaleAttrValuesMap,
                              [saleAttrId]: value
                            })
                          }}
                          type="default"
                          style={{
                            borderColor: selectedSaleAttrValuesMap[saleAttrId] === value ? '#1890ff' : '#d9d9d9',
                          }}
                        >
                          {value}
                        </Button>
                      )
                    })
                  }
                </Space>
              </div>
            )
          })}
        </Space>
      </div>
    )
    const ByGrid = (
      <Col
        gutter={[16, 16]}
      >
        <Row>
          {/*<Title className={'flex-nowrap'} level={3}>{name}</Title>*/}
          <Title
            level={3}
            style={{
              maxHeight: '100px',
              display: 'flex',
              overflow: 'hidden',
            }}
          >
            {name}fgggggggggggggggggggggg
          </Title>
        </Row>
        <Row>
          <div>
            {Price}
          </div>
        </Row>
        <Row>
          <div>
            {SaleAttrSelector}
          </div>
        </Row>
        <Row>
          <Text type="secondary">Stock: {stock}</Text>
        </Row>
        <Divider/>
        <Row>
          <Button type="primary" size="large" block>Add to Cart</Button>
        </Row>
      </Col>
    )
    const BySpace = (
      <div>
        <Typography.Title
          level={3}
          ellipsis={{
            rows: 5,
          }}
          style={{
            marginTop: '0px',
          }}
        >
          {name}fgggggggggggggg ggggggggggggggggg gggggggggggggggggggggggggggg
        </Typography.Title>
        <Rate
          disabled
          value={rating}
          style={{
            fontSize: '14px',
          }}
        />
        <Divider style={{marginTop: '10px',}}/>
        <div
        >
          {Price}
        </div>
        <Title style={{marginTop: '10px',}} level={5} type="success">Stock: {stock}</Title>
        <Divider style={{marginTop: '15px',}}/>
        {SaleAttrSelector}

        <Divider/>
        <Button type="primary" size="large" block>Add to Cart</Button>
      </div>
    )
    return BySpace
  }, [selectedSku])

  const Detail = useMemo(() => {
    const {attributeGroups} = data;
    const AttributeGroups = () => {
      const AttributeGroup = ({attributeGroup}) => {
        const {name, attributes} = attributeGroup;
        return (
          <Descriptions title={name} bordered column={1}>
            {
              attributes.map((attribute) => {
                const {id: attrId, name: attrName, selectableValueList} = attribute;
                let attrValue;
                if (selectedSaleAttrValuesMap[attrId]) {
                  attrValue = selectedSaleAttrValuesMap[attrId];
                } else {
                  attrValue = selectableValueList.join(', ');
                }
                return <Descriptions.Item
                  label={attribute.name}
                  key={attribute.id}
                >
                  {attrValue}
                </Descriptions.Item>
              })
            }
          </Descriptions>
        );
      };
      return (
        <div className={'description-list'}
        >
          {attributeGroups.map((attributeGroup) => (
            <AttributeGroup
              key={attributeGroup.id}
              attributeGroup={attributeGroup}
            />
          ))}
        </div>
      );
    };

    return (
      <Tabs
        defaultActiveKey="1"
        type="card"
        items={[
          {
            key: '1',
            label: 'Description',
            children: <AttributeGroups/>,
          },
          {
            key: '2',
            label: 'Specifications',
            children: <AttributeGroups/>,
          }
        ]}
      >
      </Tabs>
    )
  }, [selectedSku])
  return (
    selectedSku && <div
      className={'product-page'}
    >
      <Col
        style={{
          maxWidth: '1600px',
        }}
      >
        <Row className={'ant-row-no-newline'}
             gutter={30}
        >
          <Col
            style={{
              minWidth: '300px',
            }}
            span={10}
          >
            {LeftImageGallery}
          </Col>
          <Col className={''}
            flex={'auto'}
          >
            {RightProductInfo}
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col
            flex={'auto'}
            className={'product-page-detail'}
          >
            {Detail}
          </Col>
        </Row>
      </Col>
    </div>
  );
};

function Product({
  skuId
}) {
  const [data, setData] = React.useState(null);

  useEffect(() => {
    console.log("skuId11", skuId)
    if (skuId !== undefined && skuId !== null) {
      productService.getDetailBySkuId({id: skuId}).then((res) => {
        console.log("res", res);
        setData(res.data);
      })
    }
  }, [])
  return (
    // data && <PhoneProductPage data={data}/>
    <ProductPage
      data={data}
    />
    // 1
  )
}

export default Product;
