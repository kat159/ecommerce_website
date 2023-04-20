import React from 'react'
import {Form, Select, Spin} from 'antd';
import debounce from 'lodash/debounce';
import {useMemo, useRef, useState} from 'react';
import {useEffect} from 'react';
/**
 * if AA Many to many BB, AA will not have the ability to change BB,
 *  but only change the join table, so no need to cache change
 *
 */

/**
 * Pure Join Table, no additional data
 */

// const options = ['Apples', 'Nails', 'Bananas', 'Helicopters'];
export const TagSelector = ({
                              primaryId,
                              crudManager,
                              serviceKey,
                              formItemLabel,
                              foreignTitleFieldName,
                              foreignIdFieldName,
                            }) => {
  const service = crudManager.getCrudService(serviceKey)

  const [joinItems, setJoinItems] = useState([])
  const [foreignOptions, setForeignOptions] = useState([])
  const [options, setOptions] = useState([])
  const [selectedItems, setSelectedItems] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const foreignOptions = await service.getAllOption() // 外键所有选项

    const joinItems = await service.getAll(primaryId) // join table的item

    const selectedOptionIdSet = new Set()
    joinItems.forEach(joinItem => {
      const foreignId = joinItem[foreignIdFieldName]
      selectedOptionIdSet.add(foreignId)
    })

    const options = foreignOptions.map((item, index) => ({
      label: item[foreignTitleFieldName],
      value: item.id,
      key: index,
    })).filter(({value}) => !selectedOptionIdSet.has(value))

    const foreignOptionsMap = new Map()
    foreignOptions.forEach(item => {
      foreignOptionsMap.set(item.id, item)

    })

    let selectedItems = joinItems.map((item, index) => {
      const fItem = foreignOptionsMap.get(item[foreignIdFieldName])
      return {
        label: fItem && fItem[foreignTitleFieldName],
        value: item.id,
        key: index,
      }
    })


    setForeignOptions(foreignOptions)
    setJoinItems(joinItems)
    setOptions(options)
    setSelectedItems(selectedItems)
  }

  const onOptionClick = ({value: childId, label: childName}) => {

    let foreignItem = foreignOptions.find(item => item.id === childId)
    service.add({[foreignIdFieldName]: childId}, primaryId, childId)
    fetchData()
  }

  const onOptionRemove = ({value: joinTableId}) => {
    service.remove(joinTableId)
    fetchData()
  }

  return (
    <Form.Item label={formItemLabel}>

      <Select
        mode="multiple"
        placeholder="Add Categories of Products"
        value={selectedItems}
        onSelect={onOptionClick}
        onDeselect={onOptionRemove}
        style={{
          width: '100%',
        }}
        showSearch={true}
        optionFilterProp="children"
        filterOption={(input, option) => {
          return option?.label?.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }}
        options={options}
        labelInValue={true}
      />
    </Form.Item>
  );
};

