// PrettyVDOM 性能监控和调试工具
class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.renderTimes = [];
    this.componentCounts = new Map();
    this.memoryUsage = [];
    this.enabled = process.env.NODE_ENV === "development";
    this.maxHistorySize = 100;
  }

  // 开始性能测量
  startMeasure(label) {
    if (!this.enabled) return;

    const startTime = performance.now();
    this.metrics.set(label, {
      startTime,
      endTime: null,
      duration: null,
      memory: this.getMemoryUsage(),
    });
  }

  // 结束性能测量
  endMeasure(label) {
    if (!this.enabled) return;

    const metric = this.metrics.get(label);
    if (!metric) {
      console.warn(`Performance measure "${label}" not found`);
      return;
    }

    const endTime = performance.now();
    metric.endTime = endTime;
    metric.duration = endTime - metric.startTime;
    metric.memoryAfter = this.getMemoryUsage();

    // 记录渲染时间
    if (label.includes("render")) {
      this.renderTimes.push({
        label,
        duration: metric.duration,
        timestamp: Date.now(),
      });

      // 保持历史记录大小
      if (this.renderTimes.length > this.maxHistorySize) {
        this.renderTimes.shift();
      }
    }

    return metric;
  }

  // 获取内存使用情况
  getMemoryUsage() {
    if (performance.memory) {
      return {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit,
      };
    }
    return null;
  }

  // 记录组件渲染
  recordComponentRender(componentName, renderTime) {
    if (!this.enabled) return;

    const current = this.componentCounts.get(componentName) || {
      count: 0,
      totalTime: 0,
      averageTime: 0,
      lastRender: null,
    };

    current.count++;
    current.totalTime += renderTime;
    current.averageTime = current.totalTime / current.count;
    current.lastRender = Date.now();

    this.componentCounts.set(componentName, current);
  }

  // 获取性能报告
  getPerformanceReport() {
    if (!this.enabled) return null;

    const slowComponents = Array.from(this.componentCounts.entries())
      .filter(([_, stats]) => stats.averageTime > 16) // 超过一帧的组件
      .sort((a, b) => b[1].averageTime - a[1].averageTime);

    const recentRenders = this.renderTimes.slice(-10);
    const avgRenderTime =
      recentRenders.length > 0
        ? recentRenders.reduce((sum, r) => sum + r.duration, 0) /
          recentRenders.length
        : 0;

    return {
      summary: {
        totalComponents: this.componentCounts.size,
        averageRenderTime: avgRenderTime.toFixed(2),
        slowComponentsCount: slowComponents.length,
        memoryUsage: this.getMemoryUsage(),
      },
      slowComponents: slowComponents.slice(0, 5),
      recentRenders,
      metrics: Object.fromEntries(this.metrics),
    };
  }

  // 检测性能问题
  detectPerformanceIssues() {
    if (!this.enabled) return [];

    const issues = [];
    const report = this.getPerformanceReport();

    // 检测慢组件
    if (report.slowComponents.length > 0) {
      issues.push({
        type: "slow_components",
        severity: "warning",
        message: `发现 ${report.slowComponents.length} 个渲染较慢的组件`,
        details: report.slowComponents.map(([name, stats]) => ({
          component: name,
          averageTime: stats.averageTime.toFixed(2),
          renderCount: stats.count,
        })),
      });
    }

    // 检测频繁重渲染
    const frequentRenders = Array.from(this.componentCounts.entries())
      .filter(([_, stats]) => stats.count > 50)
      .sort((a, b) => b[1].count - a[1].count);

    if (frequentRenders.length > 0) {
      issues.push({
        type: "frequent_renders",
        severity: "info",
        message: `发现 ${frequentRenders.length} 个频繁重渲染的组件`,
        details: frequentRenders.slice(0, 5).map(([name, stats]) => ({
          component: name,
          renderCount: stats.count,
          totalTime: stats.totalTime.toFixed(2),
        })),
      });
    }

    // 检测内存使用
    const memory = this.getMemoryUsage();
    if (memory && memory.used / memory.total > 0.8) {
      issues.push({
        type: "high_memory_usage",
        severity: "error",
        message: "内存使用率过高",
        details: {
          used: `${(memory.used / 1024 / 1024).toFixed(2)} MB`,
          total: `${(memory.total / 1024 / 1024).toFixed(2)} MB`,
          percentage: `${((memory.used / memory.total) * 100).toFixed(1)}%`,
        },
      });
    }

    return issues;
  }

  // 清理旧数据
  cleanup() {
    this.metrics.clear();
    this.renderTimes = [];
    this.componentCounts.clear();
    this.memoryUsage = [];
  }
}

// 调试工具类
class DebugTools {
  constructor() {
    this.enabled = process.env.NODE_ENV === "development";
    this.logLevel = "info"; // debug, info, warn, error
    this.componentTree = new Map();
  }

  // 设置日志级别
  setLogLevel(level) {
    this.logLevel = level;
  }

  // 记录组件层次结构
  recordComponentTree(componentId, parentId, componentName) {
    if (!this.enabled) return;

    this.componentTree.set(componentId, {
      id: componentId,
      parentId,
      name: componentName,
      children: [],
      depth: 0,
    });

    // 更新父组件的子组件列表
    if (parentId && this.componentTree.has(parentId)) {
      const parent = this.componentTree.get(parentId);
      if (!parent.children.includes(componentId)) {
        parent.children.push(componentId);
      }
    }

    // 计算深度
    this.calculateDepth(componentId);
  }

  // 计算组件深度
  calculateDepth(componentId) {
    const component = this.componentTree.get(componentId);
    if (!component) return 0;

    if (!component.parentId) {
      component.depth = 0;
      return 0;
    }

    const parent = this.componentTree.get(component.parentId);
    if (parent) {
      component.depth = this.calculateDepth(component.parentId) + 1;
    }

    return component.depth;
  }

  // 打印组件树
  printComponentTree() {
    if (!this.enabled) return;

    console.group("🌳 Component Tree");

    const roots = Array.from(this.componentTree.values()).filter(
      (c) => !c.parentId,
    );

    roots.forEach((root) => this.printComponentNode(root, 0));

    console.groupEnd();
  }

  // 打印单个组件节点
  printComponentNode(component, indent = 0) {
    const indentStr = "  ".repeat(indent);
    const children = component.children
      .map((id) => this.componentTree.get(id))
      .filter(Boolean);

    console.log(`${indentStr}📦 ${component.name} (${component.id})`);

    children.forEach((child) => {
      this.printComponentNode(child, indent + 1);
    });
  }

  // 记录状态变化
  logStateChange(componentId, componentName, oldState, newState) {
    if (!this.enabled || this.logLevel !== "debug") return;

    const changes = this.getStateChanges(oldState, newState);
    if (changes.length > 0) {
      console.group(`🔄 State Change: ${componentName} (${componentId})`);
      changes.forEach((change) => {
        console.log(
          `  ${change.key}: ${JSON.stringify(change.from)} → ${JSON.stringify(change.to)}`,
        );
      });
      console.groupEnd();
    }
  }

  // 获取状态变化详情
  getStateChanges(oldState, newState) {
    const changes = [];
    const allKeys = new Set([
      ...Object.keys(oldState || {}),
      ...Object.keys(newState || {}),
    ]);

    allKeys.forEach((key) => {
      const oldValue = oldState?.[key];
      const newValue = newState?.[key];

      if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        changes.push({
          key,
          from: oldValue,
          to: newValue,
        });
      }
    });

    return changes;
  }

  // 记录事件
  logEvent(eventType, target, details) {
    if (!this.enabled) return;

    if (this.logLevel === "debug") {
      console.log(`🎯 Event: ${eventType}`, {
        target: target?.tagName || target,
        details,
        timestamp: new Date().toISOString(),
      });
    }
  }

  // 警告检查
  checkForWarnings(componentName, props, state) {
    if (!this.enabled) return;

    const warnings = [];

    // 检查大型对象
    const stateSize = JSON.stringify(state || {}).length;
    if (stateSize > 10000) {
      warnings.push(
        `Large state object (${stateSize} chars) in ${componentName}`,
      );
    }

    // 检查函数作为props（可能导致不必要的重渲染）
    if (props) {
      Object.keys(props).forEach((key) => {
        if (typeof props[key] === "function") {
          warnings.push(
            `Function prop "${key}" in ${componentName} - consider memoization`,
          );
        }
      });
    }

    // 检查深层嵌套
    const component = Array.from(this.componentTree.values()).find(
      (c) => c.name === componentName,
    );

    if (component && component.depth > 10) {
      warnings.push(
        `Deep component nesting (depth: ${component.depth}) in ${componentName}`,
      );
    }

    warnings.forEach((warning) => {
      console.warn(`⚠️ ${warning}`);
    });

    return warnings;
  }
}

// 性能分析器
class PerformanceProfiler {
  constructor() {
    this.profiles = new Map();
    this.activeProfiles = new Set();
  }

  // 开始分析
  startProfile(name) {
    if (this.activeProfiles.has(name)) {
      console.warn(`Profile "${name}" is already active`);
      return;
    }

    this.activeProfiles.add(name);
    this.profiles.set(name, {
      name,
      startTime: performance.now(),
      events: [],
      renderCount: 0,
      totalRenderTime: 0,
    });

    console.log(`🚀 Started profiling: ${name}`);
  }

  // 记录事件
  recordEvent(profileName, eventType, duration, details = {}) {
    const profile = this.profiles.get(profileName);
    if (!profile) return;

    profile.events.push({
      type: eventType,
      duration,
      timestamp: performance.now() - profile.startTime,
      details,
    });

    if (eventType === "render") {
      profile.renderCount++;
      profile.totalRenderTime += duration;
    }
  }

  // 结束分析
  endProfile(name) {
    if (!this.activeProfiles.has(name)) {
      console.warn(`Profile "${name}" is not active`);
      return null;
    }

    const profile = this.profiles.get(name);
    profile.endTime = performance.now();
    profile.totalTime = profile.endTime - profile.startTime;

    this.activeProfiles.delete(name);

    const report = this.generateProfileReport(profile);
    console.log(`📊 Profile Report: ${name}`, report);

    return report;
  }

  // 生成分析报告
  generateProfileReport(profile) {
    const events = profile.events;
    const renderEvents = events.filter((e) => e.type === "render");

    return {
      name: profile.name,
      totalTime: profile.totalTime.toFixed(2),
      renderCount: profile.renderCount,
      averageRenderTime:
        profile.renderCount > 0
          ? (profile.totalRenderTime / profile.renderCount).toFixed(2)
          : 0,
      slowestRender:
        renderEvents.length > 0
          ? Math.max(...renderEvents.map((e) => e.duration)).toFixed(2)
          : 0,
      eventBreakdown: this.getEventBreakdown(events),
      timeline: events.slice(0, 20), // 最近20个事件
    };
  }

  // 获取事件分类统计
  getEventBreakdown(events) {
    const breakdown = {};

    events.forEach((event) => {
      if (!breakdown[event.type]) {
        breakdown[event.type] = {
          count: 0,
          totalTime: 0,
          averageTime: 0,
        };
      }

      breakdown[event.type].count++;
      breakdown[event.type].totalTime += event.duration;
      breakdown[event.type].averageTime =
        breakdown[event.type].totalTime / breakdown[event.type].count;
    });

    return breakdown;
  }
}

// 全局实例
const performanceMonitor = new PerformanceMonitor();
const debugTools = new DebugTools();
const performanceProfiler = new PerformanceProfiler();

// 便捷的性能装饰器
export const withPerformanceTracking = (componentFactory, componentName) => {
  return (props) => {
    const component = componentFactory(props);

    // 包装原始的渲染方法
    const originalRender = component.render;
    component.render = function () {
      performanceMonitor.startMeasure(`render_${componentName}`);
      debugTools.recordComponentTree(this.id, null, componentName);

      const result = originalRender.call(this);

      const metric = performanceMonitor.endMeasure(`render_${componentName}`);
      if (metric) {
        performanceMonitor.recordComponentRender(
          componentName,
          metric.duration,
        );
      }

      return result;
    };

    // 包装状态更新方法
    const originalSetState = component.setState;
    component.setState = function (newState) {
      const oldState = { ...this.state };
      const result = originalSetState.call(this, newState);
      debugTools.logStateChange(this.id, componentName, oldState, this.state);
      return result;
    };

    return component;
  };
};

// 开发工具接口
export const DevTools = {
  // 性能监控
  performance: {
    getReport: () => performanceMonitor.getPerformanceReport(),
    detectIssues: () => performanceMonitor.detectPerformanceIssues(),
    cleanup: () => performanceMonitor.cleanup(),
    startMeasure: (label) => performanceMonitor.startMeasure(label),
    endMeasure: (label) => performanceMonitor.endMeasure(label),
  },

  // 调试工具
  debug: {
    setLogLevel: (level) => debugTools.setLogLevel(level),
    printComponentTree: () => debugTools.printComponentTree(),
    logEvent: (type, target, details) =>
      debugTools.logEvent(type, target, details),
  },

  // 性能分析
  profiler: {
    start: (name) => performanceProfiler.startProfile(name),
    end: (name) => performanceProfiler.endProfile(name),
    record: (profile, type, duration, details) =>
      performanceProfiler.recordEvent(profile, type, duration, details),
  },

  // 全局状态
  getGlobalState: () => ({
    activeComponents: Array.from(debugTools.componentTree.values()),
    performanceMetrics: performanceMonitor.getPerformanceReport(),
    activeProfiles: Array.from(performanceProfiler.activeProfiles),
  }),
};

// 控制台命令
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  window.__PRETTY_VDOM_DEVTOOLS__ = DevTools;

  console.log(`
🎨 PrettyVDOM DevTools Available!

使用方法:
- __PRETTY_VDOM_DEVTOOLS__.performance.getReport() - 获取性能报告
- __PRETTY_VDOM_DEVTOOLS__.debug.printComponentTree() - 打印组件树
- __PRETTY_VDOM_DEVTOOLS__.profiler.start('myProfile') - 开始性能分析
- __PRETTY_VDOM_DEVTOOLS__.getGlobalState() - 获取全局状态

性能监控自动启用。查看控制台获取性能警告。
  `);
}

// 导出
export {
  PerformanceMonitor,
  DebugTools,
  PerformanceProfiler,
  performanceMonitor,
  debugTools,
  performanceProfiler,
};
