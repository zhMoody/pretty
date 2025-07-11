export const onClick = (f) => ({
  type: "event",
  click: () => {
    console.log("Hello world");
    return f();
  },
});
