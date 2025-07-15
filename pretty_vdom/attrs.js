import { h } from "snabbdom";

// 创建带属性的元素函数
export const withAttrs = (tagName, attrs = {}, content = "") => {
  // 处理Snabbdom的属性格式
  const props = {};

  // 分离事件处理器和普通属性
  const eventHandlers = {};
  const htmlAttrs = {};

  Object.keys(attrs).forEach(key => {
    if (key.startsWith('on') && typeof attrs[key] === 'function') {
      // 事件处理器
      const eventName = key.slice(2).toLowerCase(); // onClick -> click
      eventHandlers[eventName] = attrs[key];
    } else {
      // 普通HTML属性
      htmlAttrs[key] = attrs[key];
    }
  });

  // 构建props对象
  if (Object.keys(htmlAttrs).length > 0) {
    props.attrs = htmlAttrs;
  }
  if (Object.keys(eventHandlers).length > 0) {
    props.on = eventHandlers;
  }

  return {
    type: "element",
    template: h(tagName, props, content)
  };
};

// 创建常用的带属性元素函数
export const inputWithAttrs = (attrs = {}, content = "") => withAttrs("input", attrs, content);
export const textareaWithAttrs = (attrs = {}, content = "") => withAttrs("textarea", attrs, content);
export const buttonWithAttrs = (attrs = {}, content = "") => withAttrs("button", attrs, content);
export const divWithAttrs = (attrs = {}, content = "") => withAttrs("div", attrs, content);
export const selectWithAttrs = (attrs = {}, content = "") => withAttrs("select", attrs, content);
export const optionWithAttrs = (attrs = {}, content = "") => withAttrs("option", attrs, content);

// 便捷的输入框创建函数
export const input = (type = "text", placeholder = "", otherAttrs = {}) => {
  return inputWithAttrs({
    type,
    placeholder,
    ...otherAttrs
  });
};

// 便捷的文本域创建函数
export const textarea = (placeholder = "", rows = 4, otherAttrs = {}) => {
  return textareaWithAttrs({
    placeholder,
    rows,
    ...otherAttrs
  });
};

// 便捷的按钮创建函数
export const button = (text, onClick, otherAttrs = {}) => {
  return buttonWithAttrs({
    onClick,
    ...otherAttrs
  }, text);
};

// 便捷的带样式div创建函数
export const styledDiv = (className = "", content = "", otherAttrs = {}) => {
  return divWithAttrs({
    class: className,
    ...otherAttrs
  }, content);
};
