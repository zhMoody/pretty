export const onClick = (f) => ({
  type: "event",
  click: () => {
    console.log("Hello world");
    console.log("onClick triggered");
    return f();
  },
});

// 鼠标事件
export const onMouseOver = (f) => ({
  type: "event",
  mouseover: () => {
    console.log("onMouseOver triggered");
    return f();
  },
});

export const onMouseOut = (f) => ({
  type: "event",
  mouseout: () => {
    console.log("onMouseOut triggered");
    return f();
  },
});

export const onMouseDown = (f) => ({
  type: "event",
  mousedown: () => {
    console.log("onMouseDown triggered");
    return f();
  },
});

export const onMouseUp = (f) => ({
  type: "event",
  mouseup: () => {
    console.log("onMouseUp triggered");
    return f();
  },
});

// 键盘事件
export const onKeyDown = (f) => ({
  type: "event",
  keydown: (e) => {
    console.log("onKeyDown triggered");
    return f(e);
  },
});

export const onKeyUp = (f) => ({
  type: "event",
  keyup: (e) => {
    console.log("onKeyUp triggered");
    return f(e);
  },
});

export const onKeyPress = (f) => ({
  type: "event",
  keypress: (e) => {
    console.log("onKeyPress triggered");
    return f(e);
  },
});

// 表单事件
export const onChange = (f) => ({
  type: "event",
  change: (e) => {
    console.log("onChange triggered");
    return f(e);
  },
});

export const onInput = (f) => ({
  type: "event",
  input: (e) => {
    console.log("onInput triggered");
    return f(e);
  },
});

export const onSubmit = (f) => ({
  type: "event",
  submit: (e) => {
    console.log("onSubmit triggered");
    e.preventDefault();
    return f(e);
  },
});

export const onFocus = (f) => ({
  type: "event",
  focus: (e) => {
    console.log("onFocus triggered");
    return f(e);
  },
});

export const onBlur = (f) => ({
  type: "event",
  blur: (e) => {
    console.log("onBlur triggered");
    return f(e);
  },
});

// 其他常用事件
export const onDoubleClick = (f) => ({
  type: "event",
  dblclick: () => {
    console.log("onDoubleClick triggered");
    return f();
  },
});

export const onScroll = (f) => ({
  type: "event",
  scroll: (e) => {
    console.log("onScroll triggered");
    return f(e);
  },
});

export const onResize = (f) => ({
  type: "event",
  resize: (e) => {
    console.log("onResize triggered");
    return f(e);
  },
});
