import React from "react";

export interface InstanceFn {
  (): void;
  disabled?: boolean;
}

export default interface PropsType {
  disabled: boolean;
  visible: boolean;
  onClose?: InstanceFn;
  children?:React.ReactNode;
}
