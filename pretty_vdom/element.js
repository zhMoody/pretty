import { h } from "snabbdom";

// 创建一个智能的元素构造器
const createElement = (tagName) => {
  return (strings, ...args) => {
    let content = "";
    let eventHandlers = {};
    let attributes = {};

    // 处理模板字符串和插值
    if (Array.isArray(strings)) {
      // 这是模板字符串调用: div`content ${value}`
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
            // 嵌套元素，添加到内容中
            content += `[NESTED_ELEMENT_${i}]`;
          } else {
            // 普通值
            content += String(arg);
          }
        }
      }
    } else {
      // 直接调用: div("content")
      content = strings || "";
    }

    // 构建props对象
    const props = { ...attributes };
    if (Object.keys(eventHandlers).length > 0) {
      props.on = eventHandlers;
    }

    // 处理嵌套元素
    let children = [];
    if (content) {
      // 检查是否有嵌套元素标记
      const nestedElements = [];
      let processedContent = content;

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

            if (before) children.push(before);
            children.push(arg.template);
            processedContent = after;
          }
        }
      }

      if (processedContent) {
        children.push(processedContent);
      }

      // 如果没有嵌套元素，直接使用content作为文本
      if (children.length === 0 && content.trim()) {
        children = content.trim();
      }
    }

    return {
      type: "element",
      template: h(tagName, props, children),
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
