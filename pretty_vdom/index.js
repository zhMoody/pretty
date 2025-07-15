import { init as snabbdomInit, h } from "snabbdom";
import { eventListenersModule } from "snabbdom/build/modules/eventlisteners";
import { attributesModule } from "snabbdom/build/modules/attributes";
const patch = snabbdomInit([eventListenersModule, attributesModule]);

// 存储当前活跃的组件实例
let activeComponentVnode = null;

export const init = (selector, component) => {
  const app = document.querySelector(selector);
  const componentInstance = component();
  activeComponentVnode = patch(app, componentInstance.template);

  // 将更新函数绑定到组件实例
  if (componentInstance.update) {
    componentInstance.setupUpdate(activeComponentVnode);
  }
};

export const createComponent = ({
  template,
  methods = {},
  initialState = {},
}) => {
  let componentState = initialState;
  let currentVnode = null;

  // 更新函数
  const updateComponent = () => {
    const newRendered = template({
      ...componentState,
      methods: mappedMethods,
    });

    if (currentVnode && newRendered.template) {
      currentVnode = patch(currentVnode, newRendered.template);
    }
  };

  const mappedMethods = Object.keys(methods).reduce(
    (acc, key) => ({
      ...acc,
      [key]: (...args) => {
        console.log(`Method ${key} called with args:`, args);
        componentState = methods[key](componentState, ...args);
        console.log(`New state:`, componentState);
        updateComponent();
        return componentState;
      },
    }),
    {},
  );

  return (props = {}) => {
    // 合并props到初始状态
    componentState = { ...componentState, ...props };

    const rendered = template({
      ...componentState,
      methods: mappedMethods,
    });

    return {
      template: rendered.template,
      state: componentState,
      methods: mappedMethods,
      update: updateComponent,
      setupUpdate: (vnode) => {
        currentVnode = vnode;
      },
    };
  };
};

// 导出数组渲染辅助函数
export const renderList = (items, renderFn) => {
  return items.map(renderFn).join("");
};

// 导出条件渲染辅助函数
export const when = (condition, content) => {
  return condition ? content : "";
};
