import React from 'react';
import {Button, Divider, Space, Steps} from "antd";

function MySteps({
  current, setCurrent,
  steps,
  onFinish = () => {},
  beforeNextStep = async () => {},
  children,
}) {
  const items = steps.map((item, index) => {
    return {title: item.title}
  })
  const stepMap = steps.reduce((acc, item, index) => {
    acc[index] = item.content
    return acc
  }, {})
  const PrevButton = current > 0 && <Button onClick={(e) => {
    e.stopPropagation();
    setCurrent(Math.max(0, current - 1))
  }}>Previous</Button>
  const NextButton = current < items.length - 1
    ? <Button onClick={(e) => {
      e.stopPropagation();
      beforeNextStep().then(() => {
        setCurrent(Math.min(items.length - 1, current + 1))
      })
    }}>Next</Button>
    : <Button onClick={beforeNextStep}>Finish</Button>
  return (
    <div>
      <Steps
        current={current}
        items={items}
      />
      <Divider/>
      {children}
      <Space>
        {PrevButton}
        {NextButton}
      </Space>
    </div>
  );
}

export default MySteps;
