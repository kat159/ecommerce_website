import React from 'react';
import {Breadcrumb} from "antd";
import {history} from "@umijs/max";

function AccountBreadcrumb({
  title
}) {
  return (
    <Breadcrumb
      style={{
        margin: '16px 0',
        FontSize: '20px',
        fontWeight: 'bold',
      }}
    >
      <Breadcrumb.Item className={'hoverable'}>
          <span
            onClick={() => {
              history.push('/ecommerce/front/account')
            }}
          >
            Your Account
          </span>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        {title}
      </Breadcrumb.Item>
    </Breadcrumb>
  );
}

export default AccountBreadcrumb;
