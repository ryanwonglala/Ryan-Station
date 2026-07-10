// ========================================================================
// ================ 🎨 CSS 双图昼夜溶解背景系统（three.js 已退役）==============
// ========================================================================
// 说明：原实现用 three.js WebGL Shader 做昼夜背景交叉溶解，改为纯 DOM：
// 两张 <img> 叠放，靠 CSS opacity transition 完成过渡。
// 对外 API（window.shaderBackground）与旧实现保持一致，script.js 无需改动。

// 图片路径集中在此，T107 转 webp 后只需改这两行。
const BG_IMAGE_PATH_DARK = 'assets/Dark-BG.webp';
const BG_IMAGE_PATH_LIGHT = 'assets/Light-BG.webp';

const BG_TRANSITION_MS_DEFAULT = 1500;

class ShaderBackground {
  constructor(darkImagePath, lightImagePath) {
    this.darkImagePath = darkImagePath;
    this.lightImagePath = lightImagePath;
    this.lightImg = null; // 亮图首次需要时才创建
    this._progress = 0; // 0 = 暗色, 1 = 亮色

    this.init();
  }

  init() {
    const homeSection = document.getElementById('home');
    if (!homeSection) {
      console.error('❌ 未找到 #home 元素');
      return;
    }

    // 创建容器（沿用原内联定位样式）
    this.container = document.createElement('div');
    this.container.id = 'shader-background';
    this.container.style.cssText = `
      position: absolute;
      inset: 0;
      z-index: -1;
      overflow: hidden;
    `;

    // 确保 home section 有相对定位
    homeSection.style.position = 'relative';

    // 将背景容器插入到 home section 最前面
    homeSection.insertBefore(this.container, homeSection.firstChild);

    // 暗图永远加载
    this.darkImg = document.createElement('img');
    this.darkImg.src = this.darkImagePath;
    this.darkImg.alt = '';
    this.darkImg.decoding = 'async';
    this.darkImg.style.cssText = `
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    `;
    this.container.appendChild(this.darkImg);

    // 初始已是 light-mode：立即需要亮图，且不应有过渡（避免闪暗）
    if (document.body.classList.contains('light-mode')) {
      const img = this.ensureLightImage();
      this._progress = 1;
      img.style.transitionDuration = '0ms';
      img.style.opacity = '1';
      // 下一帧恢复默认过渡时长，后续手动切换才会有动画
      requestAnimationFrame(() => {
        if (this.lightImg) {
          this.lightImg.style.transitionDuration = '';
        }
      });
    }
  }

  get reducedMotionMs() {
    const prefersReduced =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return prefersReduced;
  }

  // 亮图首次需要时才创建
  ensureLightImage() {
    if (this.lightImg) return this.lightImg;

    const img = document.createElement('img');
    img.src = this.lightImagePath;
    img.alt = '';
    img.decoding = 'async';
    img.style.cssText = `
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0;
      transition: opacity ${BG_TRANSITION_MS_DEFAULT}ms ease-in-out;
    `;
    this.container.appendChild(img);
    this.lightImg = img;
    return img;
  }

  // 立即置 opacity = v，无过渡
  set transitionProgress(v) {
    this._progress = v;
    const img = this.ensureLightImage();
    const restoreDuration = img.style.transitionDuration;
    img.style.transitionDuration = '0ms';
    img.style.opacity = String(v);
    // 强制回流，确保下一次真正过渡时能从此状态开始动画
    void img.offsetHeight;
    img.style.transitionDuration = restoreDuration || '';
  }

  get transitionProgress() {
    return this._progress;
  }

  // 切换到亮色主题：确保亮图已加载 → opacity 1
  transitionToLight(duration = BG_TRANSITION_MS_DEFAULT) {
    this._progress = 1;
    const img = this.ensureLightImage();
    const ms = this.reducedMotionMs ? 0 : duration;
    img.style.transitionDuration = `${ms}ms`;
    // 强制回流，保证新创建的图片先应用 opacity:0 再过渡到 1
    void img.offsetHeight;
    img.style.opacity = '1';
  }

  // 切换到暗色主题：opacity 0
  transitionToDark(duration = BG_TRANSITION_MS_DEFAULT) {
    this._progress = 0;
    if (!this.lightImg) {
      // 亮图从未创建过，本就是暗色，无需任何动作
      return;
    }
    const ms = this.reducedMotionMs ? 0 : duration;
    this.lightImg.style.transitionDuration = `${ms}ms`;
    this.lightImg.style.opacity = '0';
  }
}

// ========================================================================
// ======================== 🔌 集成到现有系统 ============================
// ========================================================================

window.addEventListener('DOMContentLoaded', () => {
  const shaderBg = new ShaderBackground(
    BG_IMAGE_PATH_DARK,
    BG_IMAGE_PATH_LIGHT
  );

  // 将 shaderBg 绑定到全局，方便主题切换调用（API 与旧版 three.js 实现一致）
  window.shaderBackground = shaderBg;

  console.log('🎨 背景系统已初始化（CSS 双图昼夜溶解）');
});
