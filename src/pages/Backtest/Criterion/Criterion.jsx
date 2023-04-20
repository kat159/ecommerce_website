import React, {useMemo, useState} from 'react';
import {useModel} from "@/.umi/exports";
import {
  Button,
  Cascader,
  Col,
  Collapse,
  Divider,
  Input,
  Radio,
  Row,
  Switch,
  Tooltip,
  Typography,
  message,
  InputNumber
} from "antd";
import {
  CaretDownOutlined, CaretRightOutlined, DeleteOutlined, EditOutlined,
  ExpandAltOutlined,
  FieldBinaryOutlined,
  FieldNumberOutlined, MinusOutlined, PlusOutlined,
  ShrinkOutlined
} from "@ant-design/icons";
import _constant from "@/pages/Backtest/Criterion/_constant";
import {v4 as uuid} from 'uuid';
import './criterion.less'
import CriterionBuilder from "@/pages/Backtest/Criterion/CriterionBuilder";

const {
  VARIABLE, PARAM, FUNCTION, INDICATOR, DATA, INPUT,
  VARIABLE_COLOR, PARAM_COLOR, FUNCTION_COLOR, INDICATOR_COLOR, DATA_COLOR, INPUT_COLOR,
} = _constant

const marketData = ['open', 'close', 'high', 'low', 'volume'].map((v) => ({_type: DATA, name: v, id: v}))

function Criterion(props) {
  const {
    stocks, fetchStocks, stocksLoading,
    indicators, fetchIndicators, indicatorsLoading,
    functions, fetchFunctions, functionsLoading,
  } = useModel('backtest')
  const [variables, setVariables] = React.useState([])
  const [params, setParams] = React.useState([])
  const [finalCriterion, setFinalCriterion] = React.useState({
    selectable: true,
    inputable: false,
    value: null,
    _nodeId: uuid(),
  })
  const itemIdMap = useMemo(() => {
    const map = {}
    marketData.forEach(item => {
      map[item.name] = {
        ...item,
        id: item.name,
        _type: DATA
      }
    })
    indicators.forEach(indicator => {
      map[indicator.name] = {
        ...indicator,
        id: indicator.name,
        _type: INDICATOR,
      }
    })
    functions.forEach(func => {
      map[func.name] = {
        ...func,
        id: func.name,
        _type: FUNCTION,
      }
    })
    variables.forEach(variable => {
      map[variable.id] = {
        ...variable,
        _type: VARIABLE,
      }
    })
    params.forEach(param => {
      map[param.id] = {
        ...param,
        _type: PARAM,
      }
    })
    return map
  }, [indicators, functions, variables, params])
  const [variableNum, setVariableNum] = React.useState(0)
  const [paramNum, setParamNum] = React.useState(0)
  const [tooltipsOnHover, setTooltipsOnHover] = React.useState(true)
  const getFunctionLabel = (func) => {
    const {return_type, name, params} = func
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = '17px Arial';
    let maxParamWidth = 0;
    params.forEach(param => {
      const {name, types} = param
      const width = context.measureText(`${name}: ${types}`).width
      if (width > maxParamWidth) {
        maxParamWidth = width
      }
    })
    return <span>
      <span style={{
        display: 'flex',
        justifyContent: 'space-between',
      }}
      >
          <span>{func.name}</span>
          <Tooltip
            placement={'right'}
            overlayInnerStyle={{
              width: maxParamWidth + 10,
            }}
            title={
              <div
                onClick={e => {
                  e.stopPropagation()
                  e.preventDefault()
                }}
              >
                <div>Params:</div>
                <div>
                  {params.map(param => <div style={{marginLeft: '10px'}}
                                            key={param.name}>{param.name}: {param.types}</div>)}
                </div>
                <Divider style={{margin: '5px 0', borderColor: '#e8e8e8'}} dashed/>
                <div>Return:</div>
                <div style={{marginLeft: '10px'}}>{return_type}</div>
                {
                  func.comments && <div>
                    <Divider style={{margin: '5px 0', borderColor: '#e8e8e8'}} dashed/>
                    <div>Description:</div>
                    {
                      func.comments.split('\n').filter(line => line.trim() !== '').map((line, index) => <div
                        style={{marginLeft: '10px'}} key={index}>{line}</div>)
                    }
                  </div>

                }
              </div>
            }
            trigger={tooltipsOnHover ? ['hover', 'click'] : ['click']}
            destroyTooltipOnHide={false}
          >
            <span
              style={{color: '#1890ff', marginLeft: '5px'}}
              onClick={e => {
                e.stopPropagation()
                e.preventDefault()
              }}
            >?</span>
          </Tooltip>
        </span>
      </span>
  }
  const itemOptions = [
    {
      value: 'data',
      // label: 'data',
      label: <span style={{color: DATA_COLOR}}>data</span>,
      type: DATA,
      children: marketData.map(item => ({
        value: item.name,
        label: <span style={{display: 'flex', justifyContent: 'space-between'}}>
                <span>{item.name}</span>
                <Tooltip
                  placement={'right'}
                  title={
                    <span
                      onClick={e => {
                        e.stopPropagation()
                        e.preventDefault()
                      }}
                    >Return: Series[Number]</span>
                  }
                  trigger={tooltipsOnHover ? ['hover', 'click'] : ['click']}
                  destroyTooltipOnHide={false}
                >
                  <span
                    style={{color: '#1890ff', marginLeft: '5px'}}
                    onClick={e => {
                      e.stopPropagation()
                      e.preventDefault()
                    }}
                  >?</span>
                </Tooltip>
              </span>,
        type: DATA,
      }))
    },
    {
      value: 'function',
      // label: 'function',
      label: <span style={{color: FUNCTION_COLOR}}>function</span>,
      type: FUNCTION,
      children: functions.map(func => {
        return {
          value: func.name,
          label: getFunctionLabel(func),
          type: FUNCTION,
          info: func,
        }
      })
    },
    {
      value: 'indicator',
      // label: 'indicator',
      label: <span style={{color: INDICATOR_COLOR}}>indicator</span>,
      type: INDICATOR,
      children: indicators.map(indicator => {
        return {
          value: indicator.name,
          label: getFunctionLabel(indicator),
          type: INDICATOR,
          info: indicator,
        }
      })
    },
  ].concat(variables.length === 0 ? [] : [{
    value: 'variable',
    // label: 'custom variable',
    label: <span style={{color: VARIABLE_COLOR}}>custom variable</span>,
    type: VARIABLE,
    children: variables.map(variable => {
      return {
        value: variable.id,
        label: variable.name,
        type: VARIABLE,
      }
    })
  }]).concat(params.length === 0 ? [] : [{
    value: 'param',
    // label: 'custom param',
    label: <span style={{color: PARAM_COLOR}}>custom param</span>,
    type: PARAM,
    children: params.map(param => {
      return {
        value: param.id,
        label: param.name,
        type: PARAM,
      }
    })
  }])
  const checkParamAndVariableName = (name) => {
    for (const variable of variables) {
      if (variable.name === name) {
        message.error('Param name already exists')
        return false
      }
    }
    for (const param of params) {
      if (param.name === name) {
        message.error('Duplicate param name with vairable name')
        return false
      }
    }
    const valid = /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)
    if (!valid) {
      message.error('Name must start with a letter or underscore, and only contain letters, numbers and underscores')
      return false
    }
    return true
  }
  const checkDuplicateName = (name) => {
    for (const variable of variables) {
      if (variable.name === name) {
        return false
      }
    }
    for (const param of params) {
      if (param.name === name) {
        return false
      }
    }
    return true
  }
  const ParamsList = () => {
    return (
      <Row>
        {
          params.map((param, index) => {
            return <Col key={index}>
              <Row>
                <Col style={{marginLeft: 10, fontWeight: 'bold'}}
                >
                  <DeleteOutlined
                    className={'my-click-icon'}
                    onClick={() => {
                      const newParams = [...params]
                      newParams.splice(index, 1)
                      setParams(newParams)
                    }}
                    style={{
                      color: '#999',
                    }}
                  />
                  <EditOutlined
                    className={'my-click-icon'}
                    style={{
                      color: '#999',
                    }}
                    onClick={() => {
                      const newParams = [...params]
                      const name = prompt('Enter new variable name', params[index].name)
                      if (checkParamAndVariableName(name)) {
                        newParams[index].name = name
                        setParams(newParams)
                      }
                    }}
                  />
                  <span
                    style={{
                      marginRight: 5,
                      color: PARAM_COLOR,
                    }}
                  >
                    {param.name}:
                  </span>

                </Col>
                <Col style={{marginLeft: 5}}>
                  <InputNumber
                    size={'small'}
                    style={{
                      width: '100px',
                    }}
                    defaultValue={param.value}
                    onBlur={(e) => {
                      console.log('onBlur', e.target.value)
                      const newParams = [...params]
                      newParams[index].value = e.target.value
                      setParams(newParams)
                    }}
                  />
                </Col>
              </Row>
            </Col>
          })
        }
      </Row>
    )
  }
  const addParam = () => {
    let validNum = paramNum
    while (!checkDuplicateName(`param${validNum}`)) {
      validNum++
    }
    const newParams = [...params, {
      _type: PARAM,
      selectable: false,
      inputable: true,
      name: `param${validNum}`,
      value: null,
      id: uuid(),
    }]
    setParamNum(validNum + 1)
    setParams(newParams)
  }
  const addVariable = () => {
    let validNum = variableNum
    while (!checkDuplicateName(`var${validNum}`)) {
      validNum++
    }
    const newVars = [...variables, {
      _type: VARIABLE,
      selectable: true,
      inputable: false,
      name: `var${validNum}`,
      value: null,
      id: uuid(),
    }]
    setVariableNum(validNum + 1)
    setVariables(newVars)
  }
  const deleteVariable = (index) => {
    const newVars = [...variables]
    newVars.splice(index, 1)
    setVariables(newVars)
  }
  const updateVariableName = (index) => {
    const newVariables = [...variables]
    const name = prompt('Enter new variable name', newVariables[index].name)
    if (checkParamAndVariableName(name)) {
      newVariables[index].name = name
      setVariables(newVariables)
    }
  }
  const checkVariableCycleReference = () => {
    const checkOneVariable = (node, visitedVariables) => {
      const {_type, _nodeId, id, params, value} = node
      if ([DATA, INPUT, PARAM].includes(_type)) {
        // no children
        return {hasCycle: false,}
      } else if (VARIABLE === _type) {
        const variable = itemIdMap[id]
        if (variable === undefined || variable === null) {
          return {hasCycle: false,}
        }
        if (visitedVariables.includes(id)) {
          return {hasCycle: true,}
        } else {
          visitedVariables.add(id)
          const res = checkOneVariable(value, visitedVariables)
          visitedVariables.delete(id)
          return res
        }
      } else if ([FUNCTION, INDICATOR].includes(_type)) {
        const item = itemIdMap[id]
        if (item === undefined || item === null) {
          return {hasCycle: false,}
        }
        for (const param of params) {
          const {value} = param
          return checkOneVariable(value, visitedVariables)
        }
      } else {
        console.error('unknown node type', node)
        return {hasCycle: false,}
      }
    }
    const visitedVariables = new Set()
    for (const variable of variables) {
      const res = checkOneVariable(variable, visitedVariables)
      const {hasCycle, cycleVariableId} = res
      if (hasCycle) {
        return res
      }
    }
    return {
      hasCycle: false,
    }
  }
  const VariablesList = () => {
    return (
      <div>
        {
          variables.map((variable, index) => <Row key={index} style={{marginBottom: 10}}>
              <Col
                style={{
                  marginTop: 2
                }}
              >
                <DeleteOutlined
                  className={'my-click-icon'}
                  style={{marginRight: '2px',}}
                  onClick={() => deleteVariable(index)}
                />
                <EditOutlined
                  className={'my-click-icon'}
                  onClick={() => {
                    updateVariableName(index)
                  }}
                />
                <span style={{marginLeft: '2px', fontWeight: 'bold', color: VARIABLE_COLOR}}>{variable.name}: </span>

              </Col>
              <Col style={{marginLeft: '8px',}}>
                <CriterionBuilder
                  criterion={variable} depth={0}
                  // isLastParam={index === variables.length - 1}
                  setNewCriterion={(newCriterion) => {
                    const newVariables = variables.map((variable, i) => i === index ? newCriterion : variable)
                    setVariables(newVariables)
                  }}
                  itemIdMap={itemIdMap}
                  itemOptions={itemOptions}
                  tooltipsOnHover={tooltipsOnHover}
                />
              </Col>

            </Row>
          )
        }
      </div>
    )
  }
  return (
    <Row className={'criterion-builder-page'}>
      <Col span={20} style={{marginLeft: '20px',}}>
        <Row className={'criterion-builder-toolbox'} style={{marginTop: '20px',}}>
          <Col span={1}/>
          <Col>
            <Radio onClick={() => {
              setTooltipsOnHover(!tooltipsOnHover)
            }} checked={tooltipsOnHover}
            >
              Tooltips on hover
            </Radio>
          </Col>
        </Row>

        <Divider orientation="left">Custom Parameters
          <PlusOutlined className={'my-click-icon'} style={{marginLeft: '10px',}} onClick={addParam}/>
        </Divider>
        <Row className={'criterion-builder-params'} style={{alignItems: 'center',}}>
          <Col span={1}/>
          <ParamsList/>
        </Row>

        <Divider orientation="left">Custom Variables
          <PlusOutlined className={'my-click-icon'} style={{marginLeft: '10px',}} onClick={addVariable}/>
        </Divider>
        <Row className={'criterion-builder-variables'}>
          <Col span={1}/>
          <Col>
            <VariablesList/>
          </Col>
        </Row>

        <Divider orientation="left">Return</Divider>
        <Row className={'criterion-builder-return'}>
          <Col span={2}/>
          <Col>
            <CriterionBuilder
              criterion={finalCriterion}
              setNewCriterion={(newCriterion) => setFinalCriterion(newCriterion)}
              itemIdMap={itemIdMap}
              itemOptions={itemOptions}
              tooltipsOnHover={tooltipsOnHover}
            />
          </Col>
        </Row>

      </Col>

    </Row>
  );
}

export default Criterion;
