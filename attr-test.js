import { input, textarea } from "./pretty_vdom/element";

// 测试属性解析
console.log("=== 开始属性解析测试 ===");

// 测试1: 简单的input
console.log("\n测试1: 简单input");
const testInput1 = input`type="text" placeholder="测试输入"`;
console.log("结果:", testInput1);

// 测试2: textarea
console.log("\n测试2: textarea");
const testTextarea = textarea`rows="4" placeholder="多行文本"`;
console.log("结果:", testTextarea);

// 测试3: 带内容的input
console.log("\n测试3: 带内容的input");
const testInput2 = input`type="email" placeholder="邮箱地址" value="test@example.com"`;
console.log("结果:", testInput2);

console.log("\n=== 属性解析测试完成 ===");
