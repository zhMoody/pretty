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
import { onSubmit, onInput, onChange, onClick } from "../pretty_vdom/event";

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
      ${h2`提交成功！`}
      ${p`感谢您的留言，我们会尽快回复您。`}
      ${button`${onClick(() => methods.resetForm())} 提交新的消息`}
    `;
  }

  return div`
    ${h2`📞 联系我们`}

    ${div`
      ${label`姓名:`}
      ${input`${onInput((e) => methods.updateField("name", e.target.value))} type="text" value="${formData.name}" placeholder="请输入您的姓名"`}
      ${errors.name ? p`${strong`错误: ${errors.name}`}` : ""}
    `}

    ${div`
      ${label`邮箱:`}
      ${input`${onInput((e) => methods.updateField("email", e.target.value))} type="email" value="${formData.email}" placeholder="请输入您的邮箱"`}
      ${errors.email ? p`${strong`错误: ${errors.email}`}` : ""}
    `}

    ${div`
      ${label`消息:`}
      ${textarea`${onInput((e) => methods.updateField("message", e.target.value))} placeholder="请输入您的消息" rows="4"${formData.message}`}
      ${errors.message ? p`${strong`错误: ${errors.message}`}` : ""}
    `}

    ${div`
      ${button`${onClick((e) => {
        e.preventDefault();
        methods.submitForm();
      })} 发送消息`}
    `}

    ${div`
      ${p`表单状态:`}
      ${p`姓名: ${formData.name || "未填写"}`}
      ${p`邮箱: ${formData.email || "未填写"}`}
      ${p`消息: ${formData.message ? "已填写" : "未填写"}`}
    `}
  `;
};

export const SimpleForm = createComponent({
  template,
  methods,
  initialState,
});
