import { createComponent } from "../pretty_vdom";
import {
  div,
  h1,
  h2,
  label,
  input,
  textarea,
  button,
  p,
  strong,
  fieldset,
  legend,
} from "../pretty_vdom/element";
import { onInput, onClick, onFocus, onBlur } from "../pretty_vdom/event";

const methods = {
  updateField: (state, field, value) => ({
    ...state,
    formData: {
      ...state.formData,
      [field]: value,
    },
  }),

  setFocusedField: (state, field) => ({
    ...state,
    focusedField: field,
  }),

  clearFocus: (state) => ({
    ...state,
    focusedField: null,
  }),

  submitForm: (state) => {
    const { username, password, email, bio } = state.formData;

    // 简单验证
    const errors = {};
    if (!username.trim()) errors.username = "用户名不能为空";
    if (username.length < 3) errors.username = "用户名至少3个字符";
    if (!password.trim()) errors.password = "密码不能为空";
    if (password.length < 6) errors.password = "密码至少6个字符";
    if (!email.trim()) errors.email = "邮箱不能为空";
    if (!email.includes("@")) errors.email = "邮箱格式不正确";

    if (Object.keys(errors).length > 0) {
      return {
        ...state,
        errors,
        submitted: false,
      };
    }

    return {
      ...state,
      errors: {},
      submitted: true,
    };
  },

  resetForm: (state) => ({
    ...state,
    formData: {
      username: "",
      password: "",
      email: "",
      bio: "",
    },
    errors: {},
    submitted: false,
    focusedField: null,
  }),
};

const initialState = {
  formData: {
    username: "",
    password: "",
    email: "",
    bio: "",
  },
  errors: {},
  submitted: false,
  focusedField: null,
};

const template = ({ formData, errors, submitted, focusedField, methods }) => {
  if (submitted) {
    return div`
      ${h1`✅ 注册成功！`}
      ${p`欢迎，${formData.username}！您的账户已创建成功。`}
      ${button`${onClick(() => methods.resetForm())} 注册新用户`}
    `;
  }

  return div`
    ${h1`📝 用户注册表单`}
    ${p`展示 label-input 关联的可访问性最佳实践`}

    ${fieldset`
      ${legend`基本信息`}

      ${div`
        ${label`for="username-field" 用户名:`}
        ${input`${onInput((e) => methods.updateField("username", e.target.value))}${onFocus(() => methods.setFocusedField("username"))}${onBlur(() => methods.clearFocus())} type="text" id="username-field" name="username" placeholder="请输入用户名（至少3个字符）" value="${formData.username}" required`}
        ${errors.username ? p`${strong`❌ ${errors.username}`}` : ""}
        ${focusedField === "username" ? p`💡 用户名将用于登录，建议使用字母和数字组合` : ""}
      `}

      ${div`
        ${label`for="password-field" 密码:`}
        ${input`${onInput((e) => methods.updateField("password", e.target.value))}${onFocus(() => methods.setFocusedField("password"))}${onBlur(() => methods.clearFocus())} type="password" id="password-field" name="password" placeholder="请输入密码（至少6个字符）" value="${formData.password}" required`}
        ${errors.password ? p`${strong`❌ ${errors.password}`}` : ""}
        ${focusedField === "password" ? p`💡 密码至少需要6个字符，建议使用字母、数字和特殊字符组合` : ""}
      `}

      ${div`
        ${label`for="email-field" 邮箱地址:`}
        ${input`${onInput((e) => methods.updateField("email", e.target.value))}${onFocus(() => methods.setFocusedField("email"))}${onBlur(() => methods.clearFocus())} type="email" id="email-field" name="email" placeholder="your@example.com" value="${formData.email}" required`}
        ${errors.email ? p`${strong`❌ ${errors.email}`}` : ""}
        ${focusedField === "email" ? p`💡 邮箱将用于账户验证和重要通知` : ""}
      `}
    `}

    ${fieldset`
      ${legend`个人简介（可选）`}

      ${div`
        ${label`for="bio-field" 个人简介:`}
        ${textarea`${onInput((e) => methods.updateField("bio", e.target.value))}${onFocus(() => methods.setFocusedField("bio"))}${onBlur(() => methods.clearFocus())} id="bio-field" name="bio" placeholder="请简单介绍一下自己..." rows="4" maxlength="200"`}${formData.bio}
        ${focusedField === "bio" ? p`💡 简介帮助其他用户了解您，限制200字符` : ""}
        ${formData.bio ? p`当前字符数: ${formData.bio.length}/200` : ""}
      `}
    `}

    ${button`${onClick(() => methods.submitForm())} 🚀 提交注册`}
    ${button`${onClick(() => methods.resetForm())} 🔄 重置表单`}

    ${h2`📊 表单状态监控`}
    ${p`当前聚焦字段: ${focusedField || "无"}`}
    ${p`用户名: ${formData.username || "未填写"} (${formData.username.length} 字符)`}
    ${p`密码: ${formData.password ? "已设置" : "未设置"} (${formData.password.length} 字符)`}
    ${p`邮箱: ${formData.email || "未填写"}`}
    ${p`简介: ${formData.bio ? "已填写" : "未填写"} (${formData.bio.length} 字符)`}

    ${h2`♿ 可访问性特性`}
    ${p`✅ Label-Input 关联：每个输入框都有对应的 label，使用 for 和 id 属性关联`}
    ${p`✅ 语义化结构：使用 fieldset 和 legend 对表单进行分组`}
    ${p`✅ 键盘导航：支持 Tab 键在表单元素间导航`}
    ${p`✅ 屏幕阅读器：label 文本会被屏幕阅读器正确读取`}
    ${p`✅ 焦点指示：当前聚焦的字段会显示额外提示信息`}
    ${p`✅ 错误提示：验证错误会在对应字段下方显示`}
    ${p`✅ 表单验证：实时反馈和提交时验证`}

    ${h2`🔧 技术实现`}
    ${p`• for 属性：label 的 for 属性值对应 input 的 id 值`}
    ${p`• 事件处理：onFocus 和 onBlur 事件提供交互反馈`}
    ${p`• 状态管理：统一管理表单数据、错误和聚焦状态`}
    ${p`• 条件渲染：根据状态显示不同的提示和错误信息`}
    ${p`• HTML5 验证：使用 required、type="email" 等原生验证`}

    ${h2`💡 使用建议`}
    ${p`1. 点击 label 文本应该能聚焦到对应的输入框`}
    ${p`2. 使用 Tab 键可以在表单元素间导航`}
    ${p`3. 每个字段都有清晰的说明和验证提示`}
    ${p`4. 表单结构语义化，便于辅助技术理解`}
  `;
};

export const FormAccessibility = createComponent({
  template,
  methods,
  initialState,
});
