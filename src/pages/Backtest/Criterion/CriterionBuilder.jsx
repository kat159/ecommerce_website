import React, {useState} from 'react';
import {v4 as uuid} from "uuid";
import {Cascader, Col, Divider, Input, Row, Tooltip} from "antd";
import {DeleteOutlined, ExpandAltOutlined, FieldNumberOutlined, ShrinkOutlined} from "@ant-design/icons";
import _constant from "@/pages/Backtest/Criterion/_constant";

const {
  VARIABLE, PARAM, FUNCTION, INDICATOR, DATA, INPUT,
  VARIABLE_COLOR, PARAM_COLOR, FUNCTION_COLOR, INDICATOR_COLOR, DATA_COLOR, INPUT_COLOR,
} = _constant

function CriterionBuilder({
  criterion,
  setNewCriterion,
  itemIdMap,
  itemOptions,
  tooltipsOnHover
}) {
  const {_expanded: expanded} = criterion;
  const onSelect = ({selectedItemId, nodeId}) => {
    const newCriterion = structuredClone(criterion)
    const selectedItem = structuredClone(itemIdMap[selectedItemId])
    const update = (node) => {
      if (node._nodeId === nodeId) {
        node.value = selectedItem
        selectedItem.params?.forEach(param => {
          param._nodeId = uuid()
          param.value = null
        })
      } else {
        node?.value?.params?.forEach(update)
      }
    }
    update(newCriterion)
    setNewCriterion(newCriterion)
  }
  const onInputBlur = ({nodeId, value}) => {
    const newCriterion = structuredClone(criterion)
    const update = (node) => {
      if (node._nodeId === nodeId) {
        node.value = {
          _type: INPUT,
          value
        }
      } else {
        node?.value?.params?.forEach(update)
      }
    }
    update(newCriterion)
    setNewCriterion(newCriterion)
  }
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
  const ComponentBuilder = ({value, _nodeId, selectable, inputable, depth = 0, isLastParam = true}) => {  // criterion tree : params = children
    const {_type} = value ?? {}
    const color = _type === DATA ? DATA_COLOR
      : _type === INPUT ? INPUT_COLOR
        : _type === PARAM ? PARAM_COLOR
          : _type === VARIABLE ? VARIABLE_COLOR
            : _type === FUNCTION ? FUNCTION_COLOR
              : _type === INDICATOR ? INDICATOR_COLOR
                : '#620000'
    // const fontWeight = value?._type === FUNCTION || value?._type === INDICATOR ? 'bold' : 'normal'
    const fontWeight = 'bold'
    const ItemSelector = ({
      inputable = true,
      selectable = true,
      initialInputValue = null,
    }) => {
      const [isSelecting, setIsSelecting] = useState(initialInputValue === null)

      const Selector = <Cascader
        size={'small'}
        style={{width: '50px'}}
        options={itemOptions}
        onChange={(value, selectedOptions) => {
          if (value === undefined || value === null) {
            return
          }
          const last = selectedOptions[selectedOptions.length - 1]
          const {type, value: v, info} = last
          const item = itemIdMap[v]
          onSelect({selectedItemId: v, nodeId: _nodeId})
        }}
        showSearch={{
          filter: (inputValue, path) => {
            return path && inputValue && path?.length > 1 && path?.[1]?.value !== path?.[0]?.value && path?.[1]?.value?.toLowerCase().indexOf(inputValue?.toLowerCase()) > -1
          },
          render: (inputValue, path) => {
            return path && inputValue && path?.length > 1 && path?.[1]?.value !== path?.[0]?.value && path?.[1]?.value?.toLowerCase().indexOf(inputValue?.toLowerCase()) > -1 &&
              <Row style={{width: '100%'}}>
                <Col>{path[0].label} : </Col>
                <Col style={{marginLeft: '5px',}} flex={'auto'}>
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
        defaultValue={initialInputValue}
        size={'small'}
        style={{width: '35px', padding: '0 0px'}}
        onBlur={(e) => {
          onInputBlur({nodeId: _nodeId, value: e.target.value})
        }}
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
      return !inputable ? Selector : !selectable ? MyInput : Both
    }
    const CurItem = () => {
      let Res = null
      if (value === null || value === undefined) { // empty, go select
        Res = <ItemSelector selectable={selectable} inputable={inputable}/>
      } else {
        if ([DATA].includes(value._type)) {  // DATA -> no param -> end
          Res = <span>{value.name}</span>
        } else if ([PARAM, VARIABLE].includes(value._type)) {  // custom param / custom variable -> has no param -> end of branch
          // detect user change on custom param / custom variable by item id
          const item = itemIdMap[value.id]
          if (item === undefined || item === null) {  // item deleted, re-select
            Res = <ItemSelector selectable={selectable} inputable={inputable}/>
          } else {
            Res = <span>{item.name}</span>
          }
        } else if ([FUNCTION, INDICATOR].includes(value._type)) {  // FUNCTION / INDICATOR -> has params -> continue
          Res = <span>
            {/*{value.name}*/}
            {getFunctionTooltip(value, value.name, 'right', color)}
            <span style={{marginRight: '5px'}}>(</span>
            {
              value.params.map((param, index) => <span key={index}>
              <ComponentBuilder {...param} depth={depth + 1} isLastParam={index === value.params.length - 1}/>
              </span>
              )
            }
            {' )'}
          </span>
        } else if ([INPUT].includes(value._type)) {  // INPUT -> no param -> end
          // Res = <ItemSelector selectable={selectable} inputable={inputable} initialInputValue={value.value}/>
          Res = <span>{value.value}</span>
        } else {
          console.error('unknown type', value._type)
        }
      }
      return Res;
    }
    const DeleteIcon = () => {
      return (
        value
        && (
          [INDICATOR, FUNCTION, PARAM, VARIABLE, DATA,].includes(value._type)
          && itemIdMap[value.id]
          || [INPUT,].includes(value._type)
        )
        && <DeleteOutlined
          className={'my-click-icon'} style={{color: '#999',}}
          onClick={() => {
            const newCriterion = structuredClone(criterion)
            const update = (node) => {
              if (node._nodeId === _nodeId) {
                node.value = null
              } else {
                node?.value?.params?.forEach(update)
              }
            }
            update(newCriterion)
            setNewCriterion(newCriterion)
          }}/>
      )
    }
    console.log('render', value)
    return <span
      style={{
        color,
        fontWeight,
        marginLeft: !expanded ? 0 : depth === 0 ? 0 : `30px`,
        display: !expanded ? 'inline' : 'block',
      }}
    >
        <DeleteIcon/>
        <CurItem/>
      <span style={{marginLeft: '1px'}}>{!isLastParam && ', '}</span>
    </span>

  }
  return <Row>
    <Col
      onClick={() => {
        const newCriterion = {...criterion}
        newCriterion._expanded = !newCriterion._expanded
        setNewCriterion(newCriterion)
      }}
      style={{marginTop: '2px',}}
    >
      {/*{expanded ? <CaretDownOutlined/> : <CaretRightOutlined/>}*/}
      {expanded ? <ExpandAltOutlined className={'my-click-icon'}/> : <ShrinkOutlined className={'my-click-icon'}/>}
    </Col>
    <Col style={{marginLeft: '5px'}}>
      <ComponentBuilder {...criterion}/>
    </Col>
  </Row>
}

export default CriterionBuilder;
