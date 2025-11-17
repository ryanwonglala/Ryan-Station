# 🎨 WebGL Shader 背景集成指南

## 📋 实现原理详解

### 核心技术栈
- **Three.js**: WebGL 框架，处理 3D 渲染管线
- **GLSL Shader**: GPU 着色器语言，实现像素级混合
- **智能混合算法**: 基于 HSL 色彩空间的智能过渡

### 工作流程

```
1. 加载两张背景图 → Three.js Texture
2. 创建全屏平面 → PlaneGeometry
3. 应用自定义 Shader Material
4. GPU 并行处理每个像素：
   - 分析像素的色相(H)、饱和度(S)、亮度(L)
   - 根据亮度差异选择混合策略
   - 输出过渡后的颜色
5. 实时渲染到 Canvas
```

---

## 🔧 集成步骤

### Step 1: 修改 index.html

在 `</body>` 标签前添加：

```html
<!-- WebGL 背景系统 -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script src="background-shader.js"></script>
```

### Step 2: 修改 style.css

**移除或注释掉原有的背景样式**：

```css
/* 注释掉原来的背景设置 */
body {
  font-family: 'Arial', 'Microsoft YaHei', sans-serif;
  
  /* ❌ 注释掉这些
  background-color: #0f172a;
  background-image: ...;
  background-size: ...;
  background-attachment: fixed;
  */
  
  min-height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  transition: background var(--transition-speed) ease;
}

/* 也要注释掉 light-mode 的背景 */
body.light-mode {
  /* ❌ 注释掉 background-* 属性 */
}

/* body::before 动画可以保留，作为额外的光效 */
body::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 20% 50%, var(--body-bg-pulse-color) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, var(--body-bg-pulse-color) 0%, transparent 50%);
  animation: pulse 15s ease-in-out infinite;
  z-index: -1; /* 确保在 shader 背景之上 */
}
```

### Step 3: 修改 script.js

找到 `toggleTheme()` 函数，添加 Shader 调用：

```javascript
// 切换主题
function toggleTheme() {
  body.classList.toggle('light-mode');

  // 🎨 触发 Shader 背景过渡
  if (window.shaderBackground) {
    if (body.classList.contains('light-mode')) {
      window.shaderBackground.transitionToLight(1500); // 1.5秒过渡
    } else {
      window.shaderBackground.transitionToDark(1500);
    }
  }

  // 保存主题选择
  if (body.classList.contains('light-mode')) {
    localStorage.setItem('theme', 'light-mode');
  } else {
    localStorage.setItem('theme', 'dark-mode');
  }
}

// 修改 loadSavedTheme() 函数
function loadSavedTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light-mode') {
    body.classList.add('light-mode');
    
    // 🎨 确保 Shader 背景同步
    if (window.shaderBackground) {
      window.shaderBackground.transitionProgress = 1;
    }
  }
}
```

---

## 🎯 核心算法解析

### 1. 智能混合策略

```glsl
vec4 smartBlend(vec4 dark, vec4 light, float t) {
  // 转换到 HSL 色彩空间
  vec3 darkHSL = rgb2hsl(dark.rgb);
  vec3 lightHSL = rgb2hsl(light.rgb);
  
  // 计算亮度差异
  float lumDiff = abs(darkHSL.z - lightHSL.z);
  
  // 策略选择：
  // - 亮度相近（< 0.3）→ 结构性元素，平滑过渡
  // - 亮度差异大 → 光照区域，加权混合
  
  if (lumDiff < 0.3) {
    // 保持结构，只改变色调
    vec3 blendedHSL = mix(darkHSL, lightHSL, t);
    return vec4(hsl2rgb(blendedHSL), 1.0);
  } else {
    // 动态光照区域
    float weight = smoothstep(0.0, 1.0, t);
    vec3 blended = mix(dark.rgb, light.rgb, weight);
    return vec4(blended, 1.0);
  }
}
```

**为什么用 HSL？**
- **H (Hue 色相)**: 控制颜色类型（红/蓝/绿）
- **S (Saturation 饱和度)**: 控制颜色鲜艳程度
- **L (Lightness 亮度)**: 控制明暗

在 HSL 空间中混合可以更好地保持物体的结构特征，只改变光照效果。

### 2. 平滑缓动函数

```javascript
// ease-in-out 缓动
const eased = progress < 0.5
  ? 2 * progress * progress
  : 1 - Math.pow(-2 * progress + 2, 2) / 2;
```

这个缓动曲线让过渡：
- 开始时慢速启动
- 中间加速
- 结束时减速停止

就像真实世界的光线变化一样自然。

---

## 🎨 效果对比

### 传统 CSS 方案
```
两张完全独立的图片
↓
简单的透明度淡入淡出
↓
视觉效果：整个场景"融化"
```

### Shader 方案
```
两张图片分解为像素
↓
每个像素独立分析和混合
↓
视觉效果：光线在房间里流动
```

---

## ⚙️ 性能优化建议

1. **按需渲染**: 只在过渡时渲染，静态时暂停
```javascript
animate() {
  if (!this.isTransitioning) {
    // 静态状态，降低帧率
    setTimeout(() => this.animate(), 100);
    return;
  }
  requestAnimationFrame(() => this.animate());
  this.renderer.render(this.scene, this.camera);
}
```

2. **降低分辨率**: 移动设备上使用较低的 pixelRatio
```javascript
this.renderer.setPixelRatio(
  Math.min(window.devicePixelRatio, 2)
);
```

3. **纹理压缩**: 使用压缩过的图片（WebP/AVIF）

---

## 🐛 常见问题

### Q1: Shader 背景显示黑屏？
**A**: 检查图片路径是否正确，打开浏览器控制台查看加载状态

### Q2: 过渡太突兀？
**A**: 增加过渡时间或调整缓动函数
```javascript
shaderBg.transitionToLight(2500); // 改为2.5秒
```

### Q3: 性能问题？
**A**: 
- 降低图片分辨率（推荐 1920x1080）
- 限制 pixelRatio
- 过渡完成后暂停渲染循环

### Q4: 颜色不对？
**A**: 调整 Shader 中的混合阈值
```glsl
if (lumDiff < 0.3) {  // 改为 0.2 或 0.4
```

---

## 🚀 高级定制

### 添加自定义混合模式

在 fragmentShader 中添加：

```glsl
// 柔光混合
vec3 softLight(vec3 base, vec3 blend) {
  return mix(
    sqrt(base) * (2.0 * blend - 1.0) + 2.0 * base * (1.0 - blend),
    2.0 * base * blend + base * base * (1.0 - 2.0 * blend),
    step(0.5, blend)
  );
}

// 在 smartBlend 中使用
vec3 blended = softLight(dark.rgb, light.rgb);
```

### 添加过渡动画效果

```javascript
// 波浪过渡
fragmentShader: `
  uniform float time;
  
  void main() {
    // 添加波浪效果
    float wave = sin(vUv.x * 10.0 + time) * 0.1;
    float t = transition + wave;
    t = clamp(t, 0.0, 1.0);
    
    vec4 finalColor = smartBlend(darkColor, lightColor, t);
    gl_FragColor = finalColor;
  }
`

// 在 animate() 中更新
this.material.uniforms.time.value = Date.now() * 0.001;
```

---

## 📚 扩展阅读

- [Three.js 官方文档](https://threejs.org/docs/)
- [GLSL 着色器教程](https://thebookofshaders.com/)
- [WebGL 基础](https://webglfundamentals.org/)
- [色彩空间转换](https://en.wikipedia.org/wiki/HSL_and_HSV)

---

## ✅ 完成检查清单

- [ ] 已添加 Three.js CDN 引用
- [ ] 已创建 background-shader.js 文件
- [ ] 已修改 style.css 移除原背景
- [ ] 已修改 script.js 集成主题切换
- [ ] 已测试暗色→亮色过渡
- [ ] 已测试亮色→暗色过渡
- [ ] 已测试页面刷新后主题保持
- [ ] 已测试移动端兼容性

完成以上步骤后，你就拥有了一个顶级的背景过渡效果！🎉