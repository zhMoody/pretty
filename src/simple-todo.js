import { createComponent } from "../pretty_vdom";
import {
  div,
  h2,
  input,
  button,
  p,
  span,
  strong,
} from "../pretty_vdom/element";
import { onClick, onInput, onKeyDown } from "../pretty_vdom/event";

const methods = {
  addTodo: (state, text) => {
    if (!text.trim()) return state;

    const newTodo = {
      id: Date.now(),
      text: text.trim(),
      completed: false,
    };

    return {
      ...state,
      todos: [...state.todos, newTodo],
      inputValue: "",
    };
  },

  toggleTodo: (state, todoId) => {
    console.log("Toggling todo:", todoId);
    return {
      ...state,
      todos: state.todos.map((todo) =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo,
      ),
    };
  },

  deleteTodo: (state, todoId) => {
    console.log("Deleting todo:", todoId);
    return {
      ...state,
      todos: state.todos.filter((todo) => todo.id !== todoId),
    };
  },

  updateInput: (state, value) => ({
    ...state,
    inputValue: value,
  }),

  clearCompleted: (state) => ({
    ...state,
    todos: state.todos.filter((todo) => !todo.completed),
  }),
};

const initialState = {
  todos: [
    { id: 1, text: "学习虚拟DOM", completed: false },
    { id: 2, text: "完成PrettyVDOM框架", completed: true },
    { id: 3, text: "编写示例代码", completed: false },
  ],
  inputValue: "",
};

const template = ({ todos, inputValue, methods }) => {
  const activeTodos = todos.filter((todo) => !todo.completed);
  const completedTodos = todos.filter((todo) => todo.completed);

  return div`
    ${h2`📝 简单待办列表`}

    添加新任务:
    ${input`${onInput((e) => methods.updateInput(e.target.value))}${onKeyDown(
      (e) => {
        if (e.key === "Enter") {
          methods.addTodo(inputValue);
        }
      },
    )} placeholder="输入新任务..."`}
    ${button`${onClick(() => methods.addTodo(inputValue))} 添加任务`}

    ${p`统计: 总计 ${todos.length} 项 | 未完成 ${activeTodos.length} 项 | 已完成 ${completedTodos.length} 项`}

    未完成任务:
    ${
      activeTodos.length === 0
        ? p`🎉 没有未完成的任务！`
        : div`
          任务1: ${activeTodos[0] ? activeTodos[0].text : "无"}
          ${activeTodos[0] ? button`${onClick(() => methods.toggleTodo(activeTodos[0].id))} ✓完成` : ""}
          ${activeTodos[0] ? button`${onClick(() => methods.deleteTodo(activeTodos[0].id))} 🗑️删除` : ""}

          ${activeTodos[1] ? p`任务2: ${activeTodos[1].text}` : ""}
          ${activeTodos[1] ? button`${onClick(() => methods.toggleTodo(activeTodos[1].id))} ✓完成` : ""}
          ${activeTodos[1] ? button`${onClick(() => methods.deleteTodo(activeTodos[1].id))} 🗑️删除` : ""}

          ${activeTodos[2] ? p`任务3: ${activeTodos[2].text}` : ""}
          ${activeTodos[2] ? button`${onClick(() => methods.toggleTodo(activeTodos[2].id))} ✓完成` : ""}
          ${activeTodos[2] ? button`${onClick(() => methods.deleteTodo(activeTodos[2].id))} 🗑️删除` : ""}

          ${activeTodos[3] ? p`任务4: ${activeTodos[3].text}` : ""}
          ${activeTodos[3] ? button`${onClick(() => methods.toggleTodo(activeTodos[3].id))} ✓完成` : ""}
          ${activeTodos[3] ? button`${onClick(() => methods.deleteTodo(activeTodos[3].id))} 🗑️删除` : ""}
        `
    }

    已完成任务:
    ${
      completedTodos.length === 0
        ? p`还没有完成任何任务`
        : div`
          ${completedTodos[0] ? p`✅ ${completedTodos[0].text}` : ""}
          ${completedTodos[0] ? button`${onClick(() => methods.toggleTodo(completedTodos[0].id))} ↩️撤销` : ""}
          ${completedTodos[0] ? button`${onClick(() => methods.deleteTodo(completedTodos[0].id))} 🗑️删除` : ""}

          ${completedTodos[1] ? p`✅ ${completedTodos[1].text}` : ""}
          ${completedTodos[1] ? button`${onClick(() => methods.toggleTodo(completedTodos[1].id))} ↩️撤销` : ""}
          ${completedTodos[1] ? button`${onClick(() => methods.deleteTodo(completedTodos[1].id))} 🗑️删除` : ""}
        `
    }

    ${
      completedTodos.length > 0
        ? button`${onClick(() => methods.clearCompleted())} 🧹 清除所有已完成任务`
        : ""
    }

    操作说明:
    ${p`• 在输入框中输入任务，按回车或点击"添加任务"按钮`}
    ${p`• 点击"✓完成"按钮来标记完成任务`}
    ${p`• 点击"🗑️删除"按钮删除任务`}
    ${p`• 点击"↩️撤销"按钮将已完成任务恢复为未完成`}
    ${p`• 使用"🧹清除所有已完成任务"按钮批量清理`}

    技术说明:
    ${p`✅ 状态管理：使用数组存储待办事项`}
    ${p`✅ 条件渲染：根据完成状态显示不同内容`}
    ${p`✅ 事件处理：支持键盘和鼠标操作`}
    ${p`✅ 数据计算：实时统计任务数量`}
    ${p`⚠️ 当前版本最多显示前4个未完成任务和前2个已完成任务`}
  `;
};

export const SimpleTodo = createComponent({
  template,
  methods,
  initialState,
});
