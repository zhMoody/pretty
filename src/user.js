import { createComponent } from "../pretty_vdom";
import { div, button } from "../pretty_vdom/element";
import { onClick } from "../pretty_vdom/event";

const methods = {
  changeName: (state, firstName) => ({ ...state, firstName }),
};

const initialState = { firstName: "Marvin", lastName: "Me" };

const template = ({ firstName, lastName, methods }) =>
  div`
    Hello ${firstName} ${lastName}!
    ${button`${onClick(() => methods.changeName("张三"))} 更改名字`}
    欢迎使用 PrettyVDOM 框架
  `;

export const User = createComponent({
  template,
  methods,
  initialState,
});
