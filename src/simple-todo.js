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

  toggleTodo: (state, todoId) => ({
    ...state,
    todos: state.todos.map((todo) =>
      todo.id === todoId ? { ...todo, completed: !todo.completed } : todo,
    ),
  }),

  deleteTodo: (state, todoId) => ({
    ...state,
    todos: state.todos.filter((todo) => todo.id !== todoId),
  }),

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

  // 手动创建待办事项列表的文本表示
  let activeList = "";
  activeTodos.forEach((todo, index) => {
    activeList += `${index + 1}. ${todo.text} [完成] [删除] `;
  });

  let completedList = "";
  completedTodos.forEach((todo, index) => {
    completedList += `${index + 1}. ✅ ${todo.text} [撤销] [删除] `;
  });

  return div`
    ${h2`📝 简单待办列表`}

    添加新任务:
    ${input`${onInput((e) => methods.updateInput(e.target.value))}${onKeyDown(
      (e) => {
        if (e.key === "Enter") {
          methods.addTodo(inputValue);
        }
      },
    )} value="${inputValue}" placeholder="输入新任务..."`}
    ${button`${onClick(() => methods.addTodo(inputValue))} 添加任务`}

    ${p`统计: 总计 ${todos.length} 项 | 未完成 ${activeTodos.length} 项 | 已完成 ${completedTodos.length} 项`}

    未完成任务:
    ${activeTodos.length === 0 ? p`🎉 没有未完成的任务！` : p`${activeList}`}

    已完成任务:
    ${completedTodos.length === 0 ? p`还没有完成任何任务` : p`${completedList}`}

    ${
      completedTodos.length > 0
        ? div`
        ${button`${onClick(() => methods.clearCompleted())} 🧹 清除所有已完成任务`}
      `
        : ""
    }

    操作说明:
    ${p`• 在输入框中输入任务，按回车或点击"添加任务"按钮`}
    ${p`• 点击任务后的[完成]按钮来标记完成`}
    ${p`• 点击[删除]按钮删除任务`}
    ${p`• 使用"清除所有已完成任务"按钮批量清理`}

    技术说明:
    ${p`✅ 状态管理：使用数组存储待办事项`}
    ${p`✅ 条件渲染：根据完成状态显示不同内容`}
    ${p`✅ 事件处理：支持键盘和鼠标操作`}
    ${p`✅ 数据计算：实时统计任务数量`}
  `;
};

export const SimpleTodo = createComponent({
  template,
  methods,
  initialState,
});
