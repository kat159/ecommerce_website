import React from 'react';
import {OrderIcon, ProfileIcon, ShippingAddressIcon} from "@/components/icons/Icon";
import {Card, Col, Row} from "antd";
import {history} from "umi";

function Account(props) {
  return (
    <Row
      style={{
        justifyContent: 'center',
        marginTop: 200,
      }}
      gutter={[16, 16]}
    >
      <Col>
        <Card
          hoverable={true}
          style={{
            width: 250,
          }}
          title={'Your Shipping Address'}
          onClick={() => {
            history.push('/ecommerce/front/account/address')
          }}
        >
            <span
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <ShippingAddressIcon
                style={{
                  fontSize: '150px',
                }}
              />
            </span>
        </Card>
      </Col>
      <Col>
        <Card
          hoverable={true}
          style={{
            width: 250,
          }}
          title={'Your Orders'}
          onClick={() => {
            history.push('/ecommerce/front/account/order')
          }}
        >
            <span
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <OrderIcon
                style={{
                  fontSize: '150px',
                }}
              />
            </span>
        </Card>
      </Col>
      <Col>
        <Card
          hoverable={true}
          style={{
            width: 250,
          }}
          title={'Your Profile'}
          onClick={() => {
            history.push('/ecommerce/front/account/profile')
          }}
        >
            <span
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <ProfileIcon
                style={{
                  fontSize: '150px',
                }}
              />
            </span>
        </Card>
      </Col>
    </Row>
  );
}

export default Account;
