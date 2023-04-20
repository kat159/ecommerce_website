import React, {useEffect, useState} from 'react';
import {useModel} from "@/.umi/exports";
import axios from "axios";

export default () => {
  const [stocks, setStocks] = useState(null);
  const [stocksLoading, setStocksLoading] = useState(true);
  const fetchStocks = async () => {
    try {
      setStocksLoading(true);
      await axios.get("http://localhost:40000/api/backtest/stock").then((res) => {
        const data = res.data.map((stock) => {
          return {
            symbol: stock.symbol,
            name: stock.name,
            title: stock.symbol,
            key: stock.symbol,
            ...stock
          }
        })
        setStocks(data);
      })
      setStocksLoading(false);
    } catch (error) {
      console.error(error);
      setStocksLoading(false);
    }
  }

  const [indicators, setIndicators] = useState([]);
  const [indicatorsLoading, setIndicatorsLoading] = useState(true);
  const fetchIndicators = async () => {
    try {
      setIndicatorsLoading(true);
      await axios.get("http://localhost:40000/api/backtest/indicator").then((res) => {
        const data = res.data
        setIndicators(data);
        setIndicatorsLoading(false);
      })
    } catch (error) {
      console.error(error);
      setIndicatorsLoading(false);
      // Handle the error here
    }

  }
  const [functions, setFunctions] = useState([]);
  const [functionsLoading, setFunctionsLoading] = useState(true);
  const fetchFunctions = async () => {
    try {
      setFunctionsLoading(true);
      await axios.get("http://localhost:40000/api/backtest/function").then((res) => {
        const data = res.data
        setFunctions(data);
      })
      setFunctionsLoading(false);
    } catch (error) {
      console.error(error);
      setFunctionsLoading(false);
      // Handle the error here
    }
  }

  useEffect(() => {
    fetchStocks()
    fetchIndicators()
    fetchFunctions()
  }, [])

  return {
    stocks,
    fetchStocks,
    stocksLoading,

    indicators,
    fetchIndicators,
    indicatorsLoading,

    functions,
    fetchFunctions,
    functionsLoading,
  };
};
