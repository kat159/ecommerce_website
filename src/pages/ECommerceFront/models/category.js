import React, {useEffect, useState} from 'react';
import dbmsProduct from "@/services/dbms-product";
const categoryService = dbmsProduct.categoryController
export default () => {
  const [categoryForest, setCategoryForest] = React.useState([]);
  const [categoryIdMap, setCategoryIdMap] = React.useState({});
  const [loading, setLoading] = useState(true);

  const fetchCategoryForest = async () => {
    const data = await categoryService.forest();

    setCategoryForest(data.data);

    const newCategoryIdMap = {};
    const getCategoryIdMap = (category) => {
      newCategoryIdMap[category.id] = category;
      category.children.forEach((child) => {
        getCategoryIdMap(child);
      });
    }
    data.data.forEach((category) => {
      getCategoryIdMap(category);
    })
    setCategoryIdMap(newCategoryIdMap);
    setLoading(false);
  }

  useEffect(() => {
    fetchCategoryForest();
  }, []);

  return {
    categoryForest,
    loading,
    categoryIdMap,
  };
};
