import { init } from "./pretty_vdom";
import { User } from "./src/user";

init("#app", User({ firstName: "fuck", lastName: "me" }, {}, {}));
