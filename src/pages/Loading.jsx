import React from 'react';
import {Spin} from "antd";

function Loading(props) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Spin size={'large'}/>
    </div>
  );
}

export default Loading;
