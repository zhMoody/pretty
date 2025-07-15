import { init, createComponent } from "./pretty_vdom";
import { User } from "./src/user";
import { SimpleTodo } from "./src/simple-todo";
import { SimpleForm } from "./src/simple-form";
import { div, h1, h2, button, p } from "./pretty_vdom/element";
import { onClick } from "./pretty_vdom/event";

// 全局状态来管理当前显示的组件
let currentComponentVnode = null;
let currentComponentType = "intro";

// 内置计数器组件
const counterMethods = {
  increment: (state) => ({ ...state, count: state.count + 1 }),
  decrement: (state) => ({ ...state, count: state.count - 1 }),
  reset: (state) => ({ ...state, count: 0 }),
};

const Counter = createComponent({
  template: ({ count, methods }) => div`
    ${h2`🔢 计数器组件`}
    当前计数: ${count}
    ${button`${onClick(() => methods.increment())} +1`}
    ${button`${onClick(() => methods.decrement())} -1`}
    ${button`${onClick(() => methods.reset())} 重置`}
    状态: ${count > 0 ? "正数 ✅" : count < 0 ? "负数 ❌" : "零 ⚪"}
  `,
  methods: counterMethods,
  initialState: { count: 0 }
});

// 介绍组件
const Intro = createComponent({
  template: () => div`
    ${h1`🎨 PrettyVDOM 框架演示`}
    ${p`欢迎使用 PrettyVDOM！这是一个优雅的虚拟DOM框架。`}
    ${p`点击下方按钮切换不同的组件示例，体验框架的各种功能。`}

    ${h2`框架特性:`}
    ✅ 模板字符串语法
    ✅ 事件处理系统
    ✅ 状态管理
    ✅ 组件化架构
    ✅ 虚拟DOM渲染

    ${p`选择一个示例开始体验吧！`}
  `,
  methods: {},
  initialState: {}
});

// 主导航组件
const Navigation = createComponent({
  template: ({ currentType, methods }) => div`
    ${h1`🎨 PrettyVDOM 演示`}

    导航菜单:
    ${button`${onClick(() => methods.switchTo("intro"))} ${currentType === "intro" ? "👉 " : ""}介绍`}
    ${button`${onClick(() => methods.switchTo("user"))} ${currentType === "user" ? "👉 " : ""}用户组件`}
    ${button`${onClick(() => methods.switchTo("counter"))} ${currentType === "counter" ? "👉 " : ""}计数器`}
    ${button`${onClick(() => methods.switchTo("todo"))} ${currentType === "todo" ? "👉 " : ""}待办列表`}
    ${button`${onClick(() => methods.switchTo("form"))} ${currentType === "form" ? "👉 " : ""}表单`}

    ${p`当前显示: ${getCurrentTypeName(currentType)}`}
  `,
  methods: {
    switchTo: (state, newType) => {
      console.log(`切换到: ${newType}`);
      switchComponent(newType);
      return { ...state, currentType: newType };
    }
  },
  initialState: { currentType: "intro" }
});

// 获取类型显示名称
function getCurrentTypeName(type) {
  const names = {
    intro: "框架介绍",
    user: "用户组件",
    counter: "计数器组件",
    todo: "待办列表",
    form: "联系表单"
  };
  return names[type] || "未知";
}

// 切换组件函数
function switchComponent(type) {
  currentComponentType = type;

  const appContainer = document.querySelector("#app");
  if (!appContainer) return;

  // 清空当前内容
  appContainer.innerHTML = '';

  // 创建新的容器结构
  const navContainer = document.createElement('div');
  navContainer.id = 'nav-container';
  navContainer.style.cssText = 'padding: 20px; border-bottom: 2px solid #eee; background: #f8f9fa;';

  const contentContainer = document.createElement('div');
  contentContainer.id = 'content-container';
  contentContainer.style.cssText = 'padding: 20px;';

  appContainer.appendChild(navContainer);
  appContainer.appendChild(contentContainer);

  // 渲染导航
  const nav = Navigation();
  nav.state.currentType = type;
  init('#nav-container', () => nav);

  // 渲染对应的组件
  let component;
  switch (type) {
    case "intro":
      component = Intro;
      break;
    case "user":
      component = () => User({ firstName: "张三", lastName: "李四" });
      break;
    case "counter":
      component = Counter;
      break;
    case "todo":
      component = SimpleTodo;
      break;
    case "form":
      component = SimpleForm;
      break;
    default:
      component = Intro;
  }

  try {
    init('#content-container', component);
    console.log(`✅ 成功切换到 ${getCurrentTypeName(type)}`);
  } catch (error) {
    console.error(`❌ 切换到 ${type} 失败:`, error);
    contentContainer.innerHTML = `<p>加载组件失败: ${error.message}</p>`;
  }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
  console.log("🚀 PrettyVDOM 演示系统启动...");

  try {
    // 初始化显示介绍页面
    switchComponent("intro");
    console.log("✅ 演示系统启动成功！");
  } catch (error) {
    console.error("❌ 演示系统启动失败:", error);
    document.querySelector("#app").innerHTML = `
      <div style="padding: 20px; color: red;">
        <h1>启动失败</h1>
        <p>错误: ${error.message}</p>
        <pre>${error.stack}</pre>
      </div>
    `;
  }
});

// 导出供其他文件使用
export { Navigation, Intro, Counter, switchComponent };
