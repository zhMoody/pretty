import { h } from "snabbdom";

// 解析HTML属性的函数
const parseAttributes = (content) => {
  const attributes = {};
  let textContent = content;

  // 匹配属性的正则表达式
  const attrRegex = /(\w+)=["']([^"']*?)["']/g;
  let match;

  while ((match = attrRegex.exec(content)) !== null) {
    const [fullMatch, attrName, attrValue] = match;

    // 处理不同类型的属性
    switch (attrName) {
      case "placeholder":
        attributes.placeholder = attrValue;
        break;
      case "type":
        attributes.type = attrValue;
        break;
      case "value":
        attributes.value = attrValue;
        break;
      case "rows":
        attributes.rows = parseInt(attrValue) || attrValue;
        break;
      case "cols":
        attributes.cols = parseInt(attrValue) || attrValue;
        break;
      case "class":
        attributes.class = attrValue;
        break;
      case "id":
        attributes.id = attrValue;
        break;
      case "style":
        attributes.style = attrValue;
        break;
      case "name":
        attributes.name = attrValue;
        break;
      case "href":
        attributes.href = attrValue;
        break;
      case "src":
        attributes.src = attrValue;
        break;
      case "alt":
        attributes.alt = attrValue;
        break;
      case "title":
        attributes.title = attrValue;
        break;
      case "maxlength":
        attributes.maxlength = parseInt(attrValue) || attrValue;
        break;
      case "minlength":
        attributes.minlength = parseInt(attrValue) || attrValue;
        break;
      case "min":
        attributes.min = attrValue;
        break;
      case "max":
        attributes.max = attrValue;
        break;
      case "step":
        attributes.step = attrValue;
        break;
      case "for":
        attributes.for = attrValue;
        break;
      default:
        attributes[attrName] = attrValue;
    }

    // 从文本内容中移除已解析的属性
    textContent = textContent.replace(fullMatch, "");
  }

  // 处理布尔属性（没有值的属性）
  const booleanAttrs = [
    "disabled",
    "readonly",
    "checked",
    "selected",
    "required",
    "autofocus",
    "multiple",
  ];
  booleanAttrs.forEach((attr) => {
    const boolRegex = new RegExp(`\\b${attr}\\b`);
    if (boolRegex.test(textContent)) {
      attributes[attr] = true;
      textContent = textContent.replace(boolRegex, "");
    }
  });

  return {
    attributes,
    textContent: textContent.trim(),
  };
};

// 创建元素的函数
const createElement = (tagName) => {
  return (strings, ...args) => {
    let content = "";
    let eventHandlers = {};

    // 处理模板字符串
    if (Array.isArray(strings)) {
      for (let i = 0; i < strings.length; i++) {
        content += strings[i];

        if (args[i] !== undefined) {
          const arg = args[i];

          // 检查是否是事件处理器
          if (arg && typeof arg === "object" && arg.type === "event") {
            Object.keys(arg).forEach((key) => {
              if (key !== "type") {
                eventHandlers[key] = arg[key];
              }
            });
          } else if (arg && typeof arg === "object" && arg.type === "element") {
            // 嵌套元素 - 暂时用占位符
            content += `[NESTED_ELEMENT_${i}]`;
          } else {
            // 普通值
            content += String(arg);
          }
        }
      }
    } else {
      // 直接调用
      content = strings || "";
    }

    // 解析HTML属性
    const parsed = parseAttributes(content);
    const attributes = parsed.attributes;
    let textContent = parsed.textContent;

    // 处理嵌套元素
    const children = [];
    if (textContent) {
      // 检查是否有嵌套元素占位符
      let processedContent = textContent;

      for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (arg && typeof arg === "object" && arg.type === "element") {
          const placeholder = `[NESTED_ELEMENT_${i}]`;
          const index = processedContent.indexOf(placeholder);
          if (index !== -1) {
            // 分割内容
            const before = processedContent.substring(0, index);
            const after = processedContent.substring(
              index + placeholder.length,
            );

            if (before.trim()) children.push(before.trim());
            children.push(arg.template);
            processedContent = after;
          }
        }
      }

      if (processedContent.trim()) {
        children.push(processedContent.trim());
      }

      // 如果没有嵌套元素，直接使用文本内容
      if (children.length === 0 && textContent.trim()) {
        children.push(textContent.trim());
      }
    }

    // 构建Snabbdom的props对象
    const props = {};

    // 添加HTML属性
    if (Object.keys(attributes).length > 0) {
      props.attrs = attributes;
    }

    // 添加事件处理器
    if (Object.keys(eventHandlers).length > 0) {
      props.on = eventHandlers;
    }

    // 返回虚拟DOM节点
    return {
      type: "element",
      template: h(
        tagName,
        props,
        children.length > 0 ? children : textContent || "",
      ),
    };
  };
};

// 基础HTML标签
export const div = createElement("div");
export const p = createElement("p");
export const span = createElement("span");
export const button = createElement("button");
export const input = createElement("input");

// 标题标签
export const h1 = createElement("h1");
export const h2 = createElement("h2");
export const h3 = createElement("h3");
export const h4 = createElement("h4");
export const h5 = createElement("h5");
export const h6 = createElement("h6");

// 文本相关标签
export const a = createElement("a");
export const strong = createElement("strong");
export const em = createElement("em");
export const small = createElement("small");
export const code = createElement("code");
export const pre = createElement("pre");

// 列表标签
export const ul = createElement("ul");
export const ol = createElement("ol");
export const li = createElement("li");

// 表单标签
export const form = createElement("form");
export const label = createElement("label");
export const textarea = createElement("textarea");
export const select = createElement("select");
export const option = createElement("option");

// 媒体标签
export const img = createElement("img");
export const video = createElement("video");
export const audio = createElement("audio");

// 布局标签
export const header = createElement("header");
export const footer = createElement("footer");
export const nav = createElement("nav");
export const section = createElement("section");
export const article = createElement("article");
export const aside = createElement("aside");
export const main = createElement("main");

// 表格标签
export const table = createElement("table");
export const thead = createElement("thead");
export const tbody = createElement("tbody");
export const tr = createElement("tr");
export const th = createElement("th");
export const td = createElement("td");
