import React, {useEffect, useState} from 'react';
import axios from "axios";
import {Col, Row, Spin, Tree, Typography, message} from "antd";
import EChartsReact from "echarts-for-react";
import * as echarts from 'echarts/core';
import {
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  VisualMapComponent,
  LegendComponent,
  BrushComponent,
  DataZoomComponent
} from 'echarts/components';
import {CandlestickChart, LineChart, BarChart} from 'echarts/charts';
import {UniversalTransition} from 'echarts/features';
import {CanvasRenderer} from 'echarts/renderers';
import {useModel} from "umi";

echarts.use([
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  VisualMapComponent,
  LegendComponent,
  BrushComponent,
  DataZoomComponent,
  CandlestickChart,
  LineChart,
  BarChart,
  CanvasRenderer,
  UniversalTransition
]);

const RightStockDisplayer = ({
  symbol,
  indicators,
}) => {
  const [data, setData] = React.useState(null);
  const [indicatorsData, setIndicatorsData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const upColor = '#00da3c';
  const downColor = '#ec0000';

  function calculateMA(dayCount, data) {
    let result = [];
    let i = 0, len = data.values.length;
    for (; i < len; i++) {
      if (i < dayCount) {
        result.push('-');
        continue;
      }
      let sum = 0;
      for (let j = 0; j < dayCount; j++) {
        sum += data.values[i - j][1];
      }
      result.push(+(sum / dayCount).toFixed(3));
    }
    return result;
  }

  const fetchStockData = async () => {
    try {
      setLoading(true);
      await axios({
        method: 'post',
        url: 'http://localhost:40000/api/backtest/stock/' + symbol,
        data: {
          indicators
        }
      }).then((res) => {
        let categoryData = [];
        let values = [];
        let volumes = [];
        const {close, high, low, open, volume, date, indicators: indicatorDataList} = res.data;
        console.log('11111111111', res.data);
        res.data.open.forEach((item, i) => {
          categoryData.push(date[i]);
          values.push([open[i], close[i], low[i], high[i], volume[i]]);
          volumes.push([i, volume[i], open[i] > close[i] ? 1 : -1]);
        })
        setData({categoryData, values, volumes, indicators: indicatorDataList});
      })
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchStockData();
  }, [symbol, indicators])
  const indiConfig = data?.indicators?.map((indicator, index) => {
    return {
      name: indicator.name,
      type: 'line',
      xAxisIndex: 2,
      yAxisIndex: 2,
      data: indicator.data,
      smooth: true,
      symbol: 'none',
      lineStyle: {
        opacity: 0.5
      }
    }
  }) ?? []
  console.log('indiConfig', indiConfig);
  return (
    <div
      style={{
        height: '90vh',
      }}
    >
      {
        // /*
        loading ? null : <EChartsReact
          style={{
            height: '100%',
          }}
          option={{
            animation: false,
            legend: {
              orient: 'vertical',
              top: 50,
              left: 10,
              itemGap: 20,
              // bottom: 10,
              // left: 'center',
              data: ['MA5', 'MA10', 'MA20', 'MA30', ...indiConfig.map(item => item.name)],
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'cross'
              },
              borderWidth: 1,
              borderColor: '#ccc',
              padding: 10,
              textStyle: {
                color: '#000'
              },
              position: function (pos, params, el, elRect, size) {
                // Compute the height of the tooltip
                const tooltipHeight = el.offsetHeight;

                // Compute the height of the chart
                const chartHeight = size.viewSize[1];

                // Compute the maximum allowed top position to prevent overflow
                const maxTop = chartHeight - tooltipHeight;

                const mouseInUpperHalf = pos[1] < chartHeight / 2;

                const obj = {
                  left: 10 + pos[0],
                  top: Math.min(maxTop, pos[1]),
                };
                return obj;
              }
              // extraCssText: 'width: 170px'
            },
            axisPointer: {
              link: [
                {
                  xAxisIndex: 'all',
                }
              ],
              label: {
                backgroundColor: '#777'
              }
            },
            toolbox: {
              feature: {
                dataZoom: {
                  yAxisIndex: false
                },
                brush: {
                  type: ['lineX', 'clear']
                },
              }
            },
            brush: {
              xAxisIndex: 'all',
              brushLink: 'all',
              outOfBrush: {
                colorAlpha: 0.1
              }
            },
            visualMap: {
              show: false,
              seriesIndex: 5,
              dimension: 2,
              pieces: [
                {
                  value: 1,
                  color: downColor
                },
                {
                  value: -1,
                  color: upColor
                }
              ]
            },
            grid: [
              {
                id: 'g1',
                left: '10%',
                right: '8%',
                height: '50%',
                legend: {
                  orient: 'vertical',
                  left: 10,
                  top: 10,
                  data: ['MA5', 'MA10', 'MA20', 'MA30']
                },
              },
              {
                left: '10%',
                right: '8%',
                top: '63%',
                height: '16%',
              },
              {
                left: '10%',
                right: '8%',
                top: '80%',
                height: '16%',
              },
            ],
            xAxis: [
              {
                type: 'category',
                data: data.categoryData,
                boundaryGap: false,
                axisLine: {onZero: false},
                splitLine: {show: false},

                min: 'dataMin',
                max: 'dataMax',
                axisPointer: {
                  // show: false,
                  z: 100
                }
              },
              {
                type: 'category',
                gridIndex: 1,
                data: data.categoryData,
                boundaryGap: false,
                axisLine: {onZero: false},
                axisTick: {show: false},
                splitLine: {show: false},
                axisLabel: {show: false},
                axisPointer: {
                  // show: false
                },
                min: 'dataMin',
                max: 'dataMax'
              },
              {
                type: 'category',
                gridIndex: 2,
                data: data.categoryData,
                boundaryGap: false,
                axisLine: {onZero: false},
                axisTick: {show: false},
                splitLine: {show: false},
                axisLabel: {show: false,},
                axisPointer: {
                  // show: false
                },
                min: 'dataMin',
                max: 'dataMax'
              }
            ],
            yAxis: [
              {
                scale: true,
                splitArea: {
                  show: true
                }
              },
              {
                scale: true,
                gridIndex: 1,
                splitNumber: 2,
                axisLabel: {show: false},
                axisLine: {show: false},
                axisTick: {show: false},
                splitLine: {show: false}
              },
              {
                scale: true,
                gridIndex: 2,
                splitNumber: 2,
                axisLabel: {show: false},
                axisLine: {show: false},
                axisTick: {show: false},
                splitLine: {show: false}
              }
            ],
            dataZoom: [
              {
                type: 'inside',
                xAxisIndex: [0, 1, 2],
                start: 98,
                end: 100
              },
              // {
              //   // show: true,
              //   xAxisIndex: [0, 1],
              //   type: 'slider',
              //   top: '85%',
              //   start: 98,
              //   end: 100
              // }
            ],
            series: [
              {
                name: 'Dow-Jones index',
                type: 'candlestick',
                data: data.values,
                itemStyle: {
                  color: upColor,
                  color0: downColor,
                  borderColor: undefined,
                  borderColor0: undefined
                },
                // tooltip: {
                //   formatter: function (param) {
                //     param = param[0];
                //     return [
                //       // 'Date: ' + param.name + '<hr size=1 style="margin: 3px 0">',
                //       // 'Open: ' + param.data[0] + '<br/>',
                //       // 'Close: ' + param.data[1] + '<br/>',
                //       // 'Lowest: ' + param.data[2] + '<br/>',
                //       // 'Highest: ' + param.data[3] + '<br/>'
                //     ].join('');
                //   }
                // }
              },
              {
                name: 'MA5',
                type: 'line',
                data: calculateMA(5, data),
                smooth: true,
                symbol: 'none',
                lineStyle: {
                  opacity: 0.5
                }
              },
              {
                name: 'MA10',
                type: 'line',
                data: calculateMA(10, data),
                smooth: true,
                symbol: 'none',
                lineStyle: {
                  opacity: 0.5
                }
              },
              {
                name: 'MA20',
                type: 'line',
                data: calculateMA(20, data),
                smooth: true,
                symbol: 'none',
                lineStyle: {
                  opacity: 0.5
                }
              },
              {
                name: 'MA30',
                type: 'line',
                data: calculateMA(30, data),
                smooth: true,
                symbol: 'none',
                lineStyle: {
                  opacity: 0.5
                }
              },
              {
                name: 'Volume',
                type: 'bar',
                xAxisIndex: 1,
                yAxisIndex: 1,
                data: data.volumes
              },
              ...indiConfig,
            ]
          }}
        />
        // */
      }

    </div>
  );
}

function Market(props) {
  // const [stocks, setStocks] = React.useState([]);
  const {
    stocks, fetchStocks, stocksLoading,
    indicators, fetchIndicators, indicatorsLoading,
    functions, fetchFunctions, functionsLoading,
  } = useModel('backtest')
  console.log('stocks', stocks, stocksLoading)
  console.log('indicators', indicators, indicatorsLoading)
  const [selectedStockSymbol, setSelectedStockSymbol] = React.useState(null);
  const [selectedIndicators, setSelectedIndicators] = React.useState([]);
  useEffect(() => {
    !stocksLoading && stocks && stocks.length > 0 && setSelectedStockSymbol(stocks[0].symbol)
  }, [stocks])
  const LeftStockSelector = () => {
    return <Spin spinning={stocksLoading || stocks === null}>
      <div
        style={{height: '70vh'}}
      >
        <Typography.Title level={4}>Stocks</Typography.Title>
        <div
          style={{
            height: '100%',
            overflowY: 'scroll'
          }}
        >
          <ul
            style={{
              paddingLeft: 0,
              marginTop: 0,
            }}
          >
            {stocks?.map((item, index) => {
              return <li
                key={item.symbol}
                style={{
                  padding: '5px',
                  cursor: 'pointer',
                  backgroundColor: selectedStockSymbol === item.symbol ? 'lightblue' : 'white'
                }}
                onClick={() => setSelectedStockSymbol(item.symbol)}
              >
                {item.symbol}
              </li>
            })}
          </ul>
        </div>
      </div>
    </Spin>
  }
  console.log('selectedIndicators', selectedIndicators,)
  const LeftIndicatorSelector = () => {
    return <Spin spinning={indicatorsLoading || indicators === null}>
      <div
        style={{height: '70vh'}}
      >
        <Typography.Title level={4}>Indicators</Typography.Title>
        <div
          style={{
            height: '100%',
            overflowY: 'scroll'
          }}
        >
          <ul
            style={{
              paddingLeft: 0,
              marginTop: 0,
            }}
          >
            {indicators?.map((item, index) => {
              return <li
                key={index}
                style={{
                  padding: '5px',
                  cursor: 'pointer',
                  backgroundColor: selectedIndicators.includes(index) ? 'lightblue' : 'white'
                }}
                onClick={() => {
                  const newSelectedIndicators = [...selectedIndicators]
                  if (newSelectedIndicators.includes(index)) {
                    newSelectedIndicators.splice(newSelectedIndicators.indexOf(index), 1)
                  } else {
                    if (selectedIndicators.length >= 3) {
                      message.warning('Maximum 3 indicators')
                      return
                    }
                    newSelectedIndicators.push(index)
                  }
                  setSelectedIndicators(newSelectedIndicators)
                }}
              >
                {item.name}
              </li>
            })}
          </ul>
        </div>
      </div>
    </Spin>
  }
  return (
    <Row>
      <Col
        style={{
          marginLeft: 20,
          width: '150px',
        }}
      >
        <LeftStockSelector/>
      </Col>
      <Col
        style={{
          marginLeft: 20,
          width: '150px',
        }}
      >
        <LeftIndicatorSelector/>
      </Col>
      <Col span={18}>
        {
          selectedStockSymbol && <RightStockDisplayer
            symbol={selectedStockSymbol}
            indicators={indicators.filter((item, index) => selectedIndicators.includes(index))}/>
        }
      </Col>
    </Row>
  );
}

export default Market;
