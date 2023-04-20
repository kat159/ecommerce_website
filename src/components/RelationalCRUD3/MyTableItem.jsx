import {Button, Col, Input, Row, Tag} from "antd"
import MySpace from "../Layout/MySpace"
import React from "react";

const Image = ({
  src,
  alt,
}, a, b) => {
  //
  return <img
    src={src}
    alt={alt}
    style={{
      maxHeight: 'min(10vh,40px)',
    }}
  />
}

const TagGroup = ({
  values
}) => {
  const tagValues = values.slice(0, 20)
  return <MySpace>
    {tagValues && tagValues.map((item, index) => <Tag key={index}>{item}</Tag>)}
  </MySpace>
}

const SearchAndAddHeader = ({
  entityName,
  onInsert,
  onSearch
}) => {
  return (
    <Row
      justify="space-evenly">
      <Col span={4}>
        <Input.Search
          placeholder={`Search ${entityName}`}
          onSearch={onSearch}
        />
      </Col>
      <Col span={4}>
        <Button
          type="primary"
          onClick={onInsert}
        >
          Add a New {entityName}
        </Button>
      </Col>
    </Row>
  )

}

export default {
  Image, TagGroup, SearchAndAddHeader
}
