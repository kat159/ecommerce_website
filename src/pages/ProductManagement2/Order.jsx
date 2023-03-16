import React from 'react';
import {Radio} from "antd";

function Order(props) {
  return (
    <div>
      <Radio.Group>
        <Radio.Button value="a">
          Pending (30 min to cancel)
        </Radio.Button>
        <Radio.Button value="b">
          Waiting for shipping
        </Radio.Button>
        <Radio.Button value="c">
          In transit
        </Radio.Button>
        <Radio.Button value="d">
          Delivered
        </Radio.Button>
        <Radio.Button value="e">
          Cancelled
        </Radio.Button>
      </Radio.Group>
    </div>
  );
}

export default Order;
