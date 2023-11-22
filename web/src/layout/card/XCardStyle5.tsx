import { Card } from "antd";
import React from 'react';

export function XCardStyle5(props) {
  const headStyle={
    justifyContent: "center",
    display: "flex",
  }
  return (
    <Card headStyle={headStyle} title={props.title} {...props}>
      {props.children}
    </Card>
  );
}
