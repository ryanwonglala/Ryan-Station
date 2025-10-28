// ========================================================================
// =================== 🎨 WebGL Shader 背景过渡系统 ======================
// ========================================================================

class ShaderBackground {
  constructor(darkImagePath, lightImagePath) {
    this.darkImagePath = darkImagePath;
    this.lightImagePath = lightImagePath;
    this.transitionProgress = 0; // 0 = 暗色, 1 = 亮色
    this.isTransitioning = false;
    this.currentAnimationId = null; // 用于取消动画
    this.targetValue = 0; // 记录目标值

    this.init();
  }

  init() {
    // 获取 home section 作为容器的父元素
    const homeSection = document.getElementById('home');
    if (!homeSection) {
      console.error('❌ 未找到 #home 元素');
      return;
    }

    // 创建容器
    this.container = document.createElement('div');
    this.container.id = 'shader-background';
    this.container.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      overflow: hidden;
    `;

    // 确保 home section 有相对定位
    homeSection.style.position = 'relative';

    // 将 shader 背景插入到 home section 中
    homeSection.insertBefore(this.container, homeSection.firstChild);

    // 初始化 Three.js 场景
    this.setupThreeJS();
    
    // 加载纹理
    this.loadTextures();
    
    // 启动渲染循环
    this.animate();
    
    // 监听窗口大小变化
    window.addEventListener('resize', () => this.onWindowResize());
  }

  setupThreeJS() {
    // 场景
    this.scene = new THREE.Scene();

    // 相机（正交相机，用于2D背景）
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.OrthographicCamera(
      -aspect, aspect, 1, -1, 0.1, 10
    );
    this.camera.position.z = 1;

    // 渲染器
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: false 
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);
  }

  loadTextures() {
    const loader = new THREE.TextureLoader();

    // 加载暗色背景
    loader.load(this.darkImagePath, (texture) => {
      this.darkTexture = texture;
      this.checkTexturesLoaded();
    });

    // 加载亮色背景
    loader.load(this.lightImagePath, (texture) => {
      this.lightTexture = texture;
      this.checkTexturesLoaded();
    });
  }

  checkTexturesLoaded() {
    if (this.darkTexture && this.lightTexture) {
      this.createShaderMaterial();
    }
  }

  createShaderMaterial() {
    // 自定义 Shader Material
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        darkTexture: { value: this.darkTexture },
        lightTexture: { value: this.lightTexture },
        transition: { value: this.transitionProgress },
        resolution: { 
          value: new THREE.Vector2(window.innerWidth, window.innerHeight) 
        }
      },
      vertexShader: this.getVertexShader(),
      fragmentShader: this.getFragmentShader()
    });

    // 创建平面几何体（填满整个屏幕）
    const aspect = window.innerWidth / window.innerHeight;
    this.geometry = new THREE.PlaneGeometry(2 * aspect, 2);
    
    // 创建网格
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);

    console.log('✅ Shader 背景加载成功');
  }

  // 顶点着色器（简单传递坐标）
  getVertexShader() {
    return `
      varying vec2 vUv;
      
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;
  }

  // 片段着色器（核心混合逻辑）
  getFragmentShader() {
    return `
      uniform sampler2D darkTexture;
      uniform sampler2D lightTexture;
      uniform float transition;
      uniform vec2 resolution;
      
      varying vec2 vUv;
      
      // RGB 转 HSL
      vec3 rgb2hsl(vec3 color) {
        float maxVal = max(max(color.r, color.g), color.b);
        float minVal = min(min(color.r, color.g), color.b);
        float delta = maxVal - minVal;
        
        float h = 0.0;
        float s = 0.0;
        float l = (maxVal + minVal) / 2.0;
        
        if (delta > 0.0) {
          s = l < 0.5 ? delta / (maxVal + minVal) : delta / (2.0 - maxVal - minVal);
          
          if (maxVal == color.r) {
            h = (color.g - color.b) / delta + (color.g < color.b ? 6.0 : 0.0);
          } else if (maxVal == color.g) {
            h = (color.b - color.r) / delta + 2.0;
          } else {
            h = (color.r - color.g) / delta + 4.0;
          }
          h /= 6.0;
        }
        
        return vec3(h, s, l);
      }
      
      // HSL 转 RGB
      float hue2rgb(float p, float q, float t) {
        if (t < 0.0) t += 1.0;
        if (t > 1.0) t -= 1.0;
        if (t < 1.0/6.0) return p + (q - p) * 6.0 * t;
        if (t < 1.0/2.0) return q;
        if (t < 2.0/3.0) return p + (q - p) * (2.0/3.0 - t) * 6.0;
        return p;
      }
      
      vec3 hsl2rgb(vec3 hsl) {
        float h = hsl.x;
        float s = hsl.y;
        float l = hsl.z;
        
        if (s == 0.0) {
          return vec3(l);
        }
        
        float q = l < 0.5 ? l * (1.0 + s) : l + s - l * s;
        float p = 2.0 * l - q;
        
        float r = hue2rgb(p, q, h + 1.0/3.0);
        float g = hue2rgb(p, q, h);
        float b = hue2rgb(p, q, h - 1.0/3.0);
        
        return vec3(r, g, b);
      }
      
      // 智能混合函数
      vec4 smartBlend(vec4 dark, vec4 light, float t) {
        // 转换到 HSL 色彩空间
        vec3 darkHSL = rgb2hsl(dark.rgb);
        vec3 lightHSL = rgb2hsl(light.rgb);
        
        // 策略1：保持结构，只改变亮度和色相
        // 计算亮度差异
        float lumDiff = abs(darkHSL.z - lightHSL.z);
        
        // 如果两个像素亮度相近（说明是结构性元素），平滑过渡
        if (lumDiff < 0.3) {
          vec3 blendedHSL = mix(darkHSL, lightHSL, t);
          return vec4(hsl2rgb(blendedHSL), 1.0);
        }
        
        // 策略2：对于亮度差异大的区域（窗外、光照），使用加权混合
        float weight = smoothstep(0.0, 1.0, t);
        vec3 blended = mix(dark.rgb, light.rgb, weight);
        
        return vec4(blended, 1.0);
      }
      
      void main() {
        // 采样两张纹理
        vec4 darkColor = texture2D(darkTexture, vUv);
        vec4 lightColor = texture2D(lightTexture, vUv);
        
        // 应用智能混合
        vec4 finalColor = smartBlend(darkColor, lightColor, transition);
        
        gl_FragColor = finalColor;
      }
    `;
  }

  // 渲染循环
  animate() {
    requestAnimationFrame(() => this.animate());
    
    // 如果正在过渡，更新 uniform
    if (this.isTransitioning && this.material) {
      this.material.uniforms.transition.value = this.transitionProgress;
    }
    
    // 渲染场景
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  // 窗口大小变化处理
  onWindowResize() {
    const aspect = window.innerWidth / window.innerHeight;
    
    // 更新相机
    this.camera.left = -aspect;
    this.camera.right = aspect;
    this.camera.updateProjectionMatrix();
    
    // 更新渲染器
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    
    // 更新分辨率 uniform
    if (this.material) {
      this.material.uniforms.resolution.value.set(
        window.innerWidth, 
        window.innerHeight
      );
    }
    
    // 更新几何体
    if (this.geometry && this.mesh) {
      this.scene.remove(this.mesh);
      this.geometry.dispose();
      this.geometry = new THREE.PlaneGeometry(2 * aspect, 2);
      this.mesh = new THREE.Mesh(this.geometry, this.material);
      this.scene.add(this.mesh);
    }
  }

  // 切换到亮色主题
  transitionToLight(duration = 1500) {
    this.transitionTo(1, duration);
  }

  // 切换到暗色主题
  transitionToDark(duration = 1500) {
    this.transitionTo(0, duration);
  }

  // 通用过渡函数
  transitionTo(targetValue, duration) {
    // 如果正在过渡且目标值不同,取消当前过渡
    if (this.isTransitioning && this.currentAnimationId) {
      cancelAnimationFrame(this.currentAnimationId);
      this.isTransitioning = false;
    }

    // 如果已经是目标状态,直接返回
    if (Math.abs(this.transitionProgress - targetValue) < 0.01) {
      return;
    }

    this.isTransitioning = true;
    this.targetValue = targetValue; // 记录目标值,用于检测冲突
    const startValue = this.transitionProgress;
    const startTime = Date.now();

    const animate = () => {
      // 检查是否被新的过渡取消
      if (!this.isTransitioning || this.targetValue !== targetValue) {
        return;
      }

      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // 使用缓动函数（ease-in-out）
      const eased = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      this.transitionProgress = startValue + (targetValue - startValue) * eased;

      if (progress < 1) {
        this.currentAnimationId = requestAnimationFrame(animate);
      } else {
        this.transitionProgress = targetValue;
        this.isTransitioning = false;
        this.currentAnimationId = null;
        console.log(`✅ 过渡完成: ${targetValue === 1 ? '亮色' : '暗色'}模式`);
      }
    };

    this.currentAnimationId = requestAnimationFrame(animate);
  }

  // 销毁资源
  dispose() {
    if (this.geometry) this.geometry.dispose();
    if (this.material) this.material.dispose();
    if (this.darkTexture) this.darkTexture.dispose();
    if (this.lightTexture) this.lightTexture.dispose();
    if (this.renderer) this.renderer.dispose();
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
  }
}

// ========================================================================
// ======================== 🔌 集成到现有系统 ============================
// ========================================================================

// 等待DOM加载完成
window.addEventListener('DOMContentLoaded', () => {
  // 初始化 Shader 背景
  const shaderBg = new ShaderBackground(
    'assets/Dark-BG.png',
    'assets/Light-BG.png'
  );

  // 将 shaderBg 绑定到全局，方便主题切换调用
  window.shaderBackground = shaderBg;

  // 检测初始主题状态
  if (document.body.classList.contains('light-mode')) {
    shaderBg.transitionProgress = 1;
  }

  console.log('🎨 Shader 背景系统已初始化');
});