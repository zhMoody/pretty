import { createComponent } from "../pretty_vdom";
import {
  div,
  h2,
  label,
  input,
  textarea,
  button,
  p,
  strong,
} from "../pretty_vdom/element";
import { onInput, onClick } from "../pretty_vdom/event";

const methods = {
  updateField: (state, field, value) => ({
    ...state,
    formData: {
      ...state.formData,
      [field]: value,
    },
  }),

  submitForm: (state) => {
    const { name, email, message } = state.formData;

    // 简单验证
    const errors = {};
    if (!name.trim()) errors.name = "姓名不能为空";
    if (!email.trim()) errors.email = "邮箱不能为空";
    if (!email.includes("@")) errors.email = "邮箱格式不正确";
    if (!message.trim()) errors.message = "消息不能为空";

    if (Object.keys(errors).length > 0) {
      return {
        ...state,
        errors,
        submitted: false,
      };
    }

    // 模拟提交成功
    return {
      ...state,
      errors: {},
      submitted: true,
      formData: { name: "", email: "", message: "" },
    };
  },

  resetForm: (state) => ({
    ...state,
    submitted: false,
    errors: {},
    formData: { name: "", email: "", message: "" },
  }),
};

const initialState = {
  formData: {
    name: "",
    email: "",
    message: "",
  },
  errors: {},
  submitted: false,
};

const template = ({ formData, errors, submitted, methods }) => {
  if (submitted) {
    return div`
      ${h2`✅ 提交成功！`}
      ${p`感谢您的留言，我们会尽快回复您。`}
      ${button`${onClick(() => methods.resetForm())} 提交新的消息`}
    `;
  }

  return div`
    ${h2`📞 联系我们`}

    ${label`for="name-input" 姓名:`}
    ${input`${onInput((e) => methods.updateField("name", e.target.value))} type="text" id="name-input" placeholder="请输入您的姓名" value="${formData.name}"`}
    ${errors.name ? p`${strong`❌ ${errors.name}`}` : ""}

    ${label`for="email-input" 邮箱:`}
    ${input`${onInput((e) => methods.updateField("email", e.target.value))} type="email" id="email-input" placeholder="请输入您的邮箱" value="${formData.email}"`}
    ${errors.email ? p`${strong`❌ ${errors.email}`}` : ""}

    ${label`for="message-input" 消息:`}
    ${textarea`${onInput((e) => methods.updateField("message", e.target.value))} id="message-input" placeholder="请输入您的消息" rows="4"`}${formData.message}
    ${errors.message ? p`${strong`❌ ${errors.message}`}` : ""}

    ${button`${onClick(() => methods.submitForm())} 📤 发送消息`}

    ${h2`📊 当前表单状态`}
    ${p`姓名: ${formData.name || "未填写"}`}
    ${p`邮箱: ${formData.email || "未填写"}`}
    ${p`消息: ${formData.message ? "已填写" : "未填写"}`}

    ${h2`🔧 技术特性展示`}
    ${p`✅ HTML属性解析：placeholder、type、rows等`}
    ${p`✅ 表单输入事件：onInput实时响应`}
    ${p`✅ 数据验证：必填项和格式检查`}
    ${p`✅ 错误处理：实时错误提示`}
    ${p`✅ 状态管理：统一的状态更新`}
    ${p`✅ 条件渲染：成功页面切换`}
  `;
};

export const SimpleForm = createComponent({
  template,
  methods,
  initialState,
});
