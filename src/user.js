import { createComponent } from "../pretty_vdom";
import { div } from "../pretty_vdom/element";
import { onClick } from "../pretty_vdom/event";

const methods = {
  changeName: (state, firstName) => ({ ...state, firstName }),
};

const initialState = { firstName: "Marvin", lastName: "Me" };

const template = ({ firstName, lastName, methods }) =>
  div`${onClick(() =>
    methods.changeName("Fuck"),
  )} Hello ${firstName} ${lastName}`;

export const User = createComponent({
  template,
  methods,
  initialState,
});
