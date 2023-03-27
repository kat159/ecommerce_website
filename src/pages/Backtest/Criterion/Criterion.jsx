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
import {v4 as uuid} from 'uuid';
import './criterion.less'
const VARIABLE = 'variable'
const PARAM = 'param'
const FUNCTION = 'function'
const INDICATOR = 'indicator'
const DATA = 'data'
const INPUT = 'input'
const marketData = [
  {
    name: 'open',
  },
  {
    name: 'close',
  },
  {
    name: 'high',
  },
  {
    name: 'low',
  },
  {
    name: 'volume',
  },
]

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
    _id: uuid(),
  })
  const idMap = useMemo(() => {
    const map = {}
    marketData.forEach(item => {
      map[item.name] = {
        ...item,
        _type: DATA
      }
    })
    indicators.forEach(indicator => {
      map[indicator.name] = {
        ...indicator,
        _type: INDICATOR,
      }
    })
    functions.forEach(func => {
      map[func.name] = {
        ...func,
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
  const getFunctionTooltip = (func, text = '?', position = 'right', color = '#1890ff') => {
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
      <Tooltip

        placement={position}
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
          style={{color: color}}
          onClick={e => {
            e.stopPropagation()
            e.preventDefault()
          }}
        >{text}</span>
      </Tooltip>
    </span>
  }
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
  const options = [
    {
      value: 'data',
      label: 'data',
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
      label: 'function',
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
      label: 'indicator',
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
    label: 'custom variable',
    type: VARIABLE,
    children: variables.map(variable => {
      return {
        value: variable.id,
        label: variable.id,
        type: VARIABLE,
      }
    })
  }]).concat(params.length === 0 ? [] : [{
    value: 'param',
    label: 'custom param',
    type: PARAM,
    children: params.map(param => {
      return {
        value: param.id,
        label: param.id,
        type: PARAM,
      }
    })
  }])
  const CriterionBuilder = ({criterion, setNewCriterion}) => {
    const [expanded, setExpanded] = useState(criterion._expanded ?? false)
    const onSelect = ({selectedItemId, nodeId}) => {
      const newCriterion = structuredClone(criterion)
      const selectedItem = structuredClone(idMap[selectedItemId])

      const update = (node) => {
        if (node._id === nodeId) {
          node.value = selectedItem
          selectedItem.params?.forEach(param => {
            param._id = uuid()
            param.value = null
          })
        } else {
          node?.value?.params?.forEach(update)
        }
      }
      update(newCriterion)
      setNewCriterion(newCriterion)
    }
    const ComponentBuilder = ({value, _id, selectable, inputable, depth = 0, isLastParam = true}) => {  // criterion tree : params = children
      const CriterionSelector = ({
        inputable = true,
        selectable = true,
      }) => {
        const [isSelecting, setIsSelecting] = useState(true)

        const Selector = <Cascader
          size={'small'}
          style={{width: '50px'}}
          options={options}
          onChange={(value, selectedOptions) => {
            if (value === undefined || value === null) {
              return
            }
            const last = selectedOptions[selectedOptions.length - 1]
            const {type, value: v, info} = last
            const item = idMap[v]
            onSelect({selectedItemId: v, nodeId: _id})
          }}
          showSearch={{
            filter: (inputValue, path) => {
              return path && inputValue && path?.length > 1 && path?.[1]?.value !== path?.[0]?.value && path?.[1]?.value?.toLowerCase().indexOf(inputValue?.toLowerCase()) > -1
            },
            render: (inputValue, path) => {
              return path && inputValue && path?.length > 1 && path?.[1]?.value !== path?.[0]?.value && path?.[1]?.value?.toLowerCase().indexOf(inputValue?.toLowerCase()) > -1 &&
                <Row
                  style={{width: '100%'}}
                >
                  <Col>{path[0].label} : </Col>
                  <Col style={{
                    marginLeft: '5px',
                  }}
                       flex={'auto'}
                  >
                    {path[1].label}
                  </Col>
                </Row>
            }
          }}
          displayRender={(labels) => labels[labels.length - 1]}
          onSearch={(value) => {
          }}
        />
        const MyInput = <Input
          size={'small'}
          style={{width: '35px', padding: '0 0px'}}
        />
        const Both = <span>
                <span>
                  {isSelecting ? Selector : MyInput}
                </span>
                <span style={{marginLeft: '5px'}}>
                  <FieldNumberOutlined
                    className={'my-click-icon'}
                    style={{
                      fontSize: '16px',
                      color: !isSelecting ? '#1890ff' : '#999',
                    }}
                    onClick={() => setIsSelecting(!isSelecting)}
                  />
                    {/*{isSelecting ? 'Input' : 'Select'}*/}
                  {/*</FieldNumberOutlined>*/}
                </span>
              </span>
        return !inputable ? Selector
          : !selectable ? MyInput
            : Both
      }
      let Res = null
      const color = value?._type === DATA || value?._type === INPUT ? '#000000' : value?._type === PARAM ? '#52c41a' : value?._type === VARIABLE ? '#faad14' : value?._type === FUNCTION ? '#722ed1' : value?._type === INDICATOR ? '#13c2c2' : '#999'
      const fontWeight = value?._type === FUNCTION || value?._type === INDICATOR ? 'bold' : 'normal'
      if (expanded) {
        if (value === null || value === undefined) {
          Res = <CriterionSelector selectable={selectable} inputable={inputable}/>
        } else {
          if (value._type === DATA || value._type === PARAM || value._type === VARIABLE) {  // DATA / custom param / custom variable -> no param -> end
            Res = <span>{value.name}</span>
          } else if (value._type === FUNCTION || value._type === INDICATOR) {  // FUNCTION / INDICATOR -> has params -> continue
            Res = <span>
            {/*{value.name}*/}
              {getFunctionTooltip(value, value.name, 'right', color)}
              <span style={{marginRight: '5px'}}>(</span>
              {
                value.params.map((param, index) => <span key={index}>
                {index > 0 ? expanded ? '' : ', ' : ''}
                    <ComponentBuilder {...param} depth={depth + 1} isLastParam={index === value.params.length - 1}/>
              </span>
                )
              }
              {' )'}
          </span>
          } else {
            console.error('unknown type', value._type)
          }
        }
        return <div
          style={{
            color,
            fontWeight,
            marginLeft: depth === 0 ? 0 : `40px`,
          }}
        >
          {
            [INDICATOR, FUNCTION, PARAM, VARIABLE, DATA].includes(value?._type)
            && <DeleteOutlined
              className={'my-click-icon'} style={{color: '#999',}}
              onClick={() => {
                const newCriterion = structuredClone(criterion)
                const update = (node) => {
                  if (node._id === _id) {
                    node.value = null
                  } else {
                    node?.value?.params?.forEach(update)
                  }
                }
                update(newCriterion)
                setNewCriterion(newCriterion)
              }}/>
          }
          {Res}
          {expanded && !isLastParam && ', '}
        </div>
      } else {
        if (value === null || value === undefined) {
          Res = <CriterionSelector selectable={selectable} inputable={inputable}/>
        } else {
          if (value._type === DATA || value._type === PARAM || value._type === VARIABLE) {  // DATA / custom param / custom variable -> no param -> end
            Res = <span>{value.name}</span>
          } else if (value._type === FUNCTION || value._type === INDICATOR) {  // FUNCTION / INDICATOR -> has params -> continue
            Res = <span>
            {getFunctionTooltip(value, value.name, 'bottomRight', color)}
              <span style={{marginRight: '5px'}}>(</span>
              {
                value.params.map((param, index) => <span key={index}>
                {index > 0 ? ', ' : ''}
                    <ComponentBuilder {...param} depth={depth + 1}/>
              </span>
                )
              }
              {' )'}
          </span>
          } else {
            console.error('unknown type', value._type)
          }
        }
        return <span style={{
          fontWeight,
          color
        }}>
          {
            [INDICATOR, FUNCTION, PARAM, VARIABLE, DATA].includes(value?._type)
            && <DeleteOutlined
              className={'my-click-icon'} style={{color: '#999',}}
              onClick={() => {
                const newCriterion = structuredClone(criterion)
                const update = (node) => {
                  if (node._id === _id) {
                    node.value = null
                  } else {
                    node?.value?.params?.forEach(update)
                  }
                }
                update(newCriterion)
                setNewCriterion(newCriterion)
              }}/>
          }
          {Res}
        </span>
      }
    }
    return <Row
      // style={{alignItems: 'center',}}
    >
      <Col onClick={() => {
        // setExpanded(!expanded)
        const newCriterion = {...criterion}
        newCriterion._expanded = !newCriterion._expanded
        setNewCriterion(newCriterion)
      }}>
        {/*{expanded ? <CaretDownOutlined/> : <CaretRightOutlined/>}*/}
        {expanded ? <ExpandAltOutlined className={'my-click-icon'}/> : <ShrinkOutlined className={'my-click-icon'}/>}
      </Col>
      <Col style={{marginLeft: '5px'}}>
        <ComponentBuilder {...criterion}/>
      </Col>
    </Row>
  }
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
                  {param.name}:
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
      _id: uuid(),
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
      _id: uuid()
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
  const VariablesList = () => {
    return (
      <div>
        {
          variables.map((variable, index) => <Row key={index}>
              <Col>
                <DeleteOutlined
                  className={'my-click-icon'}
                  style={{marginRight: '2px',}}
                  onClick={() => deleteVariable(index)}
                />
                <EditOutlined
                  className={'my-click-icon'}
                  onClick={() => {updateVariableName(index)}}
                />
                <span style={{marginLeft: '2px', fontWeight: 'bold',}}>{variable.name}: </span>
              </Col>
              <Col style={{marginLeft: '8px',}}>
                <CriterionBuilder
                  criterion={variable} depth={0}
                  isLastParam={index === variables.length - 1}
                  setNewCriterion={(newCriterion) => {
                    const newVariables = variables.map((variable, i) => i === index ? newCriterion : variable)
                    setVariables(newVariables)
                  }}
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
            <Radio onClick={() => {setTooltipsOnHover(!tooltipsOnHover)}} checked={tooltipsOnHover}
            >
              Tooltips on hover
            </Radio>
          </Col>
        </Row>

        <Divider orientation="left">Custom Parameters
          <PlusOutlined className={'my-click-icon'} style={{marginLeft: '10px',}} onClick={addParam}/>
        </Divider>
        <Row className={'criterion-builder-params'}>
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
            />
          </Col>
        </Row>

      </Col>

    </Row>
  );
}

export default Criterion;
