import React from 'react';
import {Card, Col, Row, Typography} from "antd";
import MyImage from "@/components/DataDisplay/MyImage";
import {history} from "@umijs/max";

function MyProjects(props) {
  return (
    <div>
      <Row className={'ant-row-no-newline'}
           gutter={30}
      >
        <Col xs={{span: 12}} sm={{span: 12}} md={{span: 8}} lg={{span: 6}} xl={{span: 6}} xxl={{span: 6}}>
          <Card
            title={'Back-Trading'}
            className={'my-image-card'}
            onClick={(e) => {
              e.stopPropagation()
              // history.push('/backtest')
              window.open('/backtest')
            }}
            hoverable
            cover={
              <MyImage.FitSize url={'https://firebasestorage.googleapis.com/v0/b/ecommerce-6ee5d.appspot.com/o/sku-image%2F1677596430929_undefined?alt=media&token=1a39c22a-a61f-4f3f-9d34-a7e997b348c3'}/>
            }
          >
            <Card.Meta
              title={
                <Typography.Title
                  level={5}
                  style={{
                    marginBottom: '0px',
                    marginTop: '0px',
                  }}
                  ellipsis={{
                    rows: 1,
                    tooltip: name,
                  }}
                >
                  Back-Trading
                </Typography.Title>
              }
            />
          </Card>
        </Col>
        <Col xs={{span: 12}} sm={{span: 12}} md={{span: 8}} lg={{span: 6}} xl={{span: 6}} xxl={{span: 6}}>
          <Card
            title={'E-Commerce Front'}
            className={'my-image-card'}
            onClick={(e) => {
              e.stopPropagation()
              // history.push('/ecommerce/front')
              window.open('/ecommerce/front')
            }}
            hoverable
            cover={
              <MyImage.FitSize url={'https://firebasestorage.googleapis.com/v0/b/ecommerce-6ee5d.appspot.com/o/sku-image%2F1677596430929_undefined?alt=media&token=1a39c22a-a61f-4f3f-9d34-a7e997b348c3'}/>
            }
          >
            <Card.Meta
              title={
                <Typography.Title
                  level={5}
                  style={{
                    marginBottom: '0px',
                    marginTop: '0px',
                  }}
                  ellipsis={{
                    rows: 1,
                    tooltip: name,
                  }}
                >
                  E-Commerce Front
                </Typography.Title>
              }
            />
          </Card>
        </Col>
        <Col xs={{span: 12}} sm={{span: 12}} md={{span: 8}} lg={{span: 6}} xl={{span: 6}} xxl={{span: 6}}>
          <Card
            title={'E-Commerce Admin'}
            className={'my-image-card'}
            onClick={(e) => {
              e.stopPropagation()
              // window.history.push('/ecommerce/admin')
              window.open('/ecommerce/admin')
            }}
            hoverable
            cover={
              <MyImage.FitSize url={'https://firebasestorage.googleapis.com/v0/b/ecommerce-6ee5d.appspot.com/o/sku-image%2F1677596430929_undefined?alt=media&token=1a39c22a-a61f-4f3f-9d34-a7e997b348c3'}/>
            }
          >
            <Card.Meta
              title={
                <Typography.Title
                  level={5}
                  style={{
                    marginBottom: '0px',
                    marginTop: '0px',
                  }}
                  ellipsis={{
                    rows: 1,
                    tooltip: name,
                  }}
                >
                  E-Commerce Admin
                </Typography.Title>
              }
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default MyProjects;
