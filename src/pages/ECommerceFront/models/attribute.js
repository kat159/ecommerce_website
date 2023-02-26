import React, {useEffect, useState} from 'react';
import dbmsProduct from "@/services/dbms-product";

const categoryService = dbmsProduct.categoryController
export default () => {
  const [loading, setLoading] = useState(true);

  const [thirdLevelCategoryId, setThirdLevelCategoryId] = useState([]);
  const [attrGroups, setAttrGroups] = useState([]);
  const [saleAttrs, setSaleAttrs] = useState([]);
  const [searchSaleAttrs, setSearchSaleAttrs] = useState([]);
  const [specAttrs, setSpecAttrs] = useState([])
  const [searchSpecAttrs, setSearchSpecAttrs] = useState([]);
  const fetchAttrGroups = async (newThirdLevelCategoryId) => {
    if (newThirdLevelCategoryId === thirdLevelCategoryId) {
      setLoading(false);
      return;
    } else {
      setLoading(true);
      categoryService.getAllAttrGroup({
        id: newThirdLevelCategoryId,
        include: 'attr'
      }).then((data) => {

        const newAttrGroups = data.data ?? [];

        const newSaleAttrs = [];
        const newSpecAttrs = [];
        const newSearchSaleAttrs = [];
        const newSearchSpecAttrs = [];
        for (let attrGroup of newAttrGroups) {
          const attrs = attrGroup.attributes ?? [];
          for (let attr of attrs) {
            const newAttr = {
              attrGroupId: attrGroup.id,
              attrId: attr.id,
              attrName: attr.name,
              attrGroupName: attrGroup.name,
              selectableValueList: attr.selectableValueList ?? [],
            }
            if (attr?.type === 0 || attr?.type === 2) {

              newSaleAttrs.push(newAttr);
              if (attr?.searchStatus === 1) {
                newSearchSaleAttrs.push(newAttr);
              }
            } else if (attr?.type === 1) {
              newSpecAttrs.push(newAttr);
              if (attr?.searchStatus === 1) {
                newSearchSpecAttrs.push(newAttr);
              }
            }
          }
        }
        setLoading(false);
        setThirdLevelCategoryId(newThirdLevelCategoryId);
        setAttrGroups(data.data);
        setSaleAttrs(newSaleAttrs);
        setSearchSaleAttrs(newSearchSaleAttrs);
        setSpecAttrs(newSpecAttrs);
        setSearchSpecAttrs(newSearchSpecAttrs);
      }).catch((e) => {
        setLoading(false);
        setThirdLevelCategoryId(null)
        setAttrGroups([]);
        setSaleAttrs([]);
        setSearchSaleAttrs([]);
        setSpecAttrs([]);
        setSearchSpecAttrs([]);
      })
    }

  }

  return {
    thirdLevelCategoryId,
    loading,
    attrGroups,
    fetchAttrGroups,
    saleAttrs,
    searchSaleAttrs,
    specAttrs,
    searchSpecAttrs,
  };
};
