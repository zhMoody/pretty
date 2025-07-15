# 🎨 PrettyVDOM （Pretty Virtual DOM）Beta

> 一个优雅简洁的虚拟DOM框架，提供组件化开发和高性能渲染

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-0.0.1-blue.svg)](https://github.com/your-username/pretty-vdom)

## ✨ 特性

- 🚀 **轻量级** - 基于 Snabbdom 构建，核心代码简洁高效
- 📝 **模板字符串语法** - 直观的 JSX 替代方案，无需编译步骤
- 🔧 **组件化架构** - 支持状态管理和生命周期
- ⚡ **高性能** - 内置性能监控和调试工具
- 🎯 **助手函数** - 丰富的内置助手，简化开发
- 🔍 **开发工具** - 强大的调试和性能分析功能

## 🚀 快速开始

### 安装

```bash
# 克隆项目
git clone https://github.com/your-username/pretty-vdom.git
cd pretty-vdom

# 安装依赖
npm install
# 或
pnpm install

# 启动开发服务器
npm run dev
```

### 基础用法

```javascript
import { createComponent, init } from "./pretty_vdom";
import { div, h1, button, p } from "./pretty_vdom/element";
import { onClick } from "./pretty_vdom/event";

// 创建组件
const Counter = createComponent({
  template: ({ count, methods }) => div`
    ${h1`计数器: ${count}`}
    ${button`${onClick(() => methods.increment())} +1`}
    ${button`${onClick(() => methods.decrement())} -1`}
    ${p`当前值: ${count}`}
  `,

  methods: {
    increment: (state) => ({ ...state, count: state.count + 1 }),
    decrement: (state) => ({ ...state, count: state.count - 1 })
  },

  initialState: { count: 0 }
});

// 渲染到页面
init('#app', Counter);
```

## 📖 核心概念

### 组件定义

PrettyVDOM 使用简洁的对象语法定义组件：

```javascript
const MyComponent = createComponent({
  // 模板函数 - 返回虚拟DOM
  template: ({ state, props, methods }) => {
    return div`
      ${h2`Hello ${props.name}!`}
      ${button`${onClick(() => methods.doSomething())} 点击我`}
    `;
  },

  // 方法定义
  methods: {
    doSomething: (state, ...args) => {
      // 返回新的状态
      return { ...state, clicked: true };
    }
  },

  // 初始状态
  initialState: {
    clicked: false
  }
});
```

### 模板语法

使用 ES6 模板字符串创建元素：

```javascript
// 基础元素
div`Hello World`

// 带属性
input`type="text" placeholder="输入内容..." class="form-control"`

// 嵌套元素
div`
  ${h1`标题`}
  ${p`段落内容`}
  ${ul`
    ${li`列表项 1`}
    ${li`列表项 2`}
  `}
`

// 条件渲染
div`
  ${when(isVisible, h1`显示的标题`)}
  ${unless(isLoading, p`内容已加载`)}
`
```

### 事件处理

```javascript
import { onClick, onInput, onChange } from "./pretty_vdom/event";

// 点击事件
button`${onClick(() => handleClick())} 点击我`

// 输入事件
input`${onInput(e => handleInput(e.target.value))} type="text"`

// 表单事件
form`${onSubmit(e => handleSubmit(e))}`
```

## 🛠️ 内置助手函数

### 列表渲染

```javascript
import { each } from "./pretty_vdom";

const users = [
  { id: 1, name: "张三" },
  { id: 2, name: "李四" }
];

// 渲染用户列表
div`
  ${each(users, (user, index) =>
    div`用户 ${index + 1}: ${user.name}`
  )}
`
```

### 条件渲染

```javascript
import { when, unless } from "./pretty_vdom";

// 条件显示
when(user.isAdmin, div`管理员面板`)

// 反向条件
unless(user.isLoggedIn, div`请先登录`)
```

### 样式和类名

```javascript
import { cls } from "./pretty_vdom";

// 动态类名
const className = cls("btn", {
  "btn-primary": isPrimary,
  "btn-disabled": isDisabled
});

button`class="${className}" 按钮`
```

### 数据格式化

```javascript
import { num, safe } from "./pretty_vdom";

// 数字格式化
div`价格: ¥${num(99.99, 2)}`

// 安全内容处理
div`${safe(user.name)}`
```

### 表单验证

```javascript
import { validate } from "./pretty_vdom";

const errors = {};
const username = "test";

// 验证用户名
const usernameError = validate.required(username, "用户名不能为空");
if (usernameError) errors.username = usernameError;

// 验证邮箱
const emailError = validate.email(email, "请输入有效邮箱");
if (emailError) errors.email = emailError;
```

## 📊 性能监控

PrettyVDOM 内置了强大的性能监控系统：

### 开发者工具

在浏览器控制台中使用：

```javascript
// 获取性能报告
__PRETTY_VDOM_DEVTOOLS__.performance.getReport()

// 检测性能问题
__PRETTY_VDOM_DEVTOOLS__.performance.detectIssues()

// 打印组件树
__PRETTY_VDOM_DEVTOOLS__.debug.printComponentTree()

// 开始性能分析
__PRETTY_VDOM_DEVTOOLS__.profiler.start('myAnalysis')

// 结束性能分析
__PRETTY_VDOM_DEVTOOLS__.profiler.end('myAnalysis')
```

### 性能监控功能

- ✅ **渲染时间监控** - 自动记录组件渲染耗时
- ✅ **内存使用追踪** - 实时监控 JavaScript 堆内存
- ✅ **慢组件检测** - 自动识别渲染时间超过 16ms 的组件
- ✅ **组件树可视化** - 完整的组件层次结构展示
- ✅ **状态变化追踪** - 记录组件状态的每次变更

## 🌟 示例项目

查看 `src/` 目录下的示例组件：

### 📝 待办事项列表
```javascript
// src/simple-todo.js
const SimpleTodo = createComponent({
  template: ({ todos, inputValue, methods }) => div`
    ${h2`📝 待办事项`}

    ${input`${onInput(e => methods.updateInput(e.target.value))}
             value="${inputValue}"
             placeholder="输入新任务..."`}

    ${button`${onClick(() => methods.addTodo(inputValue))} 添加`}

    ${each(todos, todo =>
      div`class="${cls({ completed: todo.completed })}"
        ${span`${todo.text}`}
        ${button`${onClick(() => methods.toggle(todo.id))}
                  ${todo.completed ? '↩️' : '✓'}`}
        ${button`${onClick(() => methods.delete(todo.id))} 🗑️`}
      `
    )}
  `,

  methods: {
    addTodo: (state, text) => ({
      ...state,
      todos: [...state.todos, {
        id: Date.now(),
        text: text.trim(),
        completed: false
      }],
      inputValue: ""
    }),

    toggle: (state, id) => ({
      ...state,
      todos: state.todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    }),

    delete: (state, id) => ({
      ...state,
      todos: state.todos.filter(todo => todo.id !== id)
    }),

    updateInput: (state, value) => ({ ...state, inputValue: value })
  },

  initialState: {
    todos: [],
    inputValue: ""
  }
});
```

### 📋 表单组件
```javascript
// src/simple-form.js
const SimpleForm = createComponent({
  template: ({ formData, errors, methods }) => div`
    ${h2`📋 联系表单`}

    ${div`class="form-field"
      ${label`姓名:`}
      ${input`${onInput(e => methods.updateField('name', e.target.value))}
               value="${formData.name}"
               class="${cls({ error: errors.name })}"`}
      ${when(errors.name, div`class="error" ${errors.name}`)}
    `}

    ${div`class="form-field"
      ${label`邮箱:`}
      ${input`${onInput(e => methods.updateField('email', e.target.value))}
               type="email"
               value="${formData.email}"
               class="${cls({ error: errors.email })}"`}
      ${when(errors.email, div`class="error" ${errors.email}`)}
    `}

    ${button`${onClick(() => methods.submit())} 提交`}
  `,

  methods: {
    updateField: (state, field, value) => ({
      ...state,
      formData: { ...state.formData, [field]: value },
      errors: { ...state.errors, [field]: null }
    }),

    submit: (state) => {
      const errors = {};
      if (!state.formData.name) errors.name = "姓名不能为空";
      if (!state.formData.email) errors.email = "邮箱不能为空";

      return Object.keys(errors).length > 0
        ? { ...state, errors }
        : { ...state, submitted: true };
    }
  },

  initialState: {
    formData: { name: "", email: "" },
    errors: {},
    submitted: false
  }
});
```

## 🏗️ 项目结构

```
pretty/
├── pretty_vdom/           # 框架核心
│   ├── index.js          # 主入口文件
│   ├── element.js        # HTML 元素定义
│   ├── event.js          # 事件处理器
│   ├── performance.js    # 性能监控系统
│   └── attrs.js          # 属性处理
├── src/                  # 示例组件
│   ├── simple-todo.js    # 待办事项示例
│   ├── simple-form.js    # 表单示例
│   └── user.js           # 用户组件示例
├── demo.js               # 演示页面
├── index.html            # 主页面
├── main.js               # 应用入口
└── package.json          # 项目配置
```

## 🔧 开发指南

### 创建新组件

1. **定义组件结构**
```javascript
const MyComponent = createComponent({
  template: ({ state, methods }) => {
    // 返回虚拟DOM
  },
  methods: {
    // 定义方法
  },
  initialState: {
    // 初始状态
  }
});
```

2. **使用内置助手**
```javascript
import { each, when, cls, num, validate } from "./pretty_vdom";
```

3. **添加性能监控**
```javascript
// 性能监控会自动启用
// 使用开发者工具查看性能数据
```

### 最佳实践

1. **保持组件简单** - 每个组件专注单一职责
2. **使用助手函数** - 利用内置助手简化代码
3. **性能监控** - 定期检查性能报告
4. **状态管理** - 保持状态结构扁平化
5. **事件处理** - 使用提供的事件处理器

## 🚀 部署

### 构建生产版本

```bash
# 使用 Vite 构建
npm run build

# 或者使用自定义构建脚本
# 确保正确处理 ES6 模块
```

### 浏览器兼容性

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 11+
- ✅ Edge 79+

*需要支持 ES6 模块和模板字符串*

## 🤝 贡献

欢迎贡献代码！请遵循以下步骤：

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

### 开发规范

- 代码风格：使用 Prettier 格式化
- 提交信息：使用约定式提交
- 测试：确保所有功能正常工作
- 文档：更新相关文档

## 📝 许可证

本项目基于 [MIT 许可证](LICENSE) 开源。

## 🙏 致谢

- [Snabbdom](https://github.com/snabbdom/snabbdom) - 提供虚拟DOM核心
- [Vite](https://vitejs.dev/) - 开发构建工具
- 所有贡献者和用户的支持

## 📞 联系我们

- 🐛 [报告问题](https://https://github.com/zhMoody/pretty/issues)

<div align="center">

**如果这个项目对你有帮助，请给个 ⭐ Star 支持一下！**

Made with ❤️ by zhMoody

</div>
