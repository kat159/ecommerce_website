import React from 'react';
import {Col, Row, Typography} from "antd";

function MyDescription({
  data
}) {
  return (
    <Typography.Paragraph
      style={{
        marginBottom: 0,
      }}
    >
      {
        data.map((item, index) => {
          return (
            <Typography.Paragraph
              key={index}
              style={{
                marginBottom: 0,
              }}
            >
              <span
                style={{
                  marginBottom: 0,
                  color: '#5e5e5e',
                }}
              >
                {item.label}:
              </span>
              <span
                style={{
                  marginBottom: 0,
                  fontWeight: 600,
                  marginLeft: 5,
                }}
              >
                {item.value}
                </span>
            </Typography.Paragraph>
          )
        })
      }
    </Typography.Paragraph>
  );
}

  export default MyDescription;
