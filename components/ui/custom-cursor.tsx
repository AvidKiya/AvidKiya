'use client';

import { useEffect, useRef } from 'react';
import { useCms } from '@/lib/cms/cms-context';

const vertShader = `
precision mediump float;
varying vec2 vUv;
attribute vec2 a_position;
void main() {
  vUv = .5 * (a_position + 1.);
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const fragShader = `
precision mediump float;
varying vec2 vUv;
uniform float u_time;
uniform float u_ratio;
uniform float u_size;
uniform vec2 u_pointer;
uniform float u_smile;
uniform vec2 u_target_pointer;
uniform vec3 u_main_color;
uniform vec3 u_border_color;
uniform float u_flat_color;
uniform sampler2D u_texture;
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m*m;
  m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
vec2 rotate(vec2 v, float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return vec2(v.x * c - v.y * s, v.x * s + v.y * c);
}
float eyes(vec2 uv) {
  uv.y -= .5;
  uv.y *= .8;
  uv.x = abs(uv.x);
  uv.y += u_smile * .3 * pow(uv.x, 1.3);
  uv.x -= (.6 + .2 * u_smile);
  float d = clamp(length(uv), 0., 1.);
  return 1. - pow(d, .08);
}
float mouth(vec2 uv) {
  uv.y += 1.5;
  uv.x *= (.5 + .5 * abs(1. - u_smile));
  uv.y *= (3. - 2. * abs(1. - u_smile));
  uv.y -= u_smile * 4. * pow(uv.x, 2.);
  float d = clamp(length(uv), 0., 1.);
  return 1. - pow(d, .07);
}
float faceShape(vec2 uv, float rotation) {
  uv = rotate(uv, rotation);
  uv /= (.27 * u_size);
  float e = 10. * eyes(uv);
  float m = 20. * mouth(uv);
  float col = 0.;
  col = mix(col, 1., e);
  col = mix(col, 1., m);
  return col;
}
void main() {
  vec2 point = u_pointer;
  point.x *= u_ratio;
  vec2 uv = vUv;
  uv.x *= u_ratio;
  uv -= point;
  float tex = texture2D(u_texture, vec2(vUv.x, 1. - vUv.y)).r;
  float shape = tex;
  float noise = snoise(uv * vec2(.7 / u_size, .6 / u_size) + vec2(0., .0015 * u_time));
  noise += 1.2;
  noise *= 2.1;
  noise += smoothstep(-.8, -.2, uv.y / u_size);
  float f = faceShape(uv, 5. * (u_target_pointer.x - u_pointer.x));
  shape -= f;
  shape *= noise;
  vec3 border = (1. - u_border_color);
  border.g += .2 * sin(.005 * u_time);
  border *= .5;
  vec3 color = u_main_color;
  color -= (1. - u_flat_color) * border * smoothstep(.0, .01, shape);
  shape = u_flat_color * smoothstep(.8, 1., shape) + (1. - u_flat_color) * shape;
  color *= shape;
  gl_FragColor = vec4(color, shape);
}
`;

const hexToRgb01 = (hex: string, fallback: [number, number, number]): [number, number, number] => {
  const clean = String(hex || '').replace('#','').trim();
  if (!/^([0-9a-f]{3}|[0-9a-f]{6})$/i.test(clean)) return fallback;
  const full = clean.length === 3 ? clean.split('').map(x=>x+x).join('') : clean;
  return [0,2,4].map(i => parseInt(full.slice(i, i+2), 16) / 255) as [number, number, number];
};

export function CustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { cms } = useCms();
  const cursor = cms.cursor || {
    enabled: true, size: 0.03, tailDots: 18, spring: 1.25, friction: 0.34,
    mainColor: '#f7f3ea', borderColor: '#004741', flatColor: false,
  };

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    if (!fine || !cursor.enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false }) || canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;
    if (!gl) return;

    document.documentElement.classList.add('ghost-cursor-enabled');

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const params = {
      size: Math.max(0.015, Math.min(0.12, Number(cursor.size) || 0.03)),
      tail: {
        dotsNumber: Math.max(8, Math.min(35, Math.round(Number(cursor.tailDots) || 18))),
        spring: Math.max(0.3, Math.min(2.5, Number(cursor.spring) || 1.25)),
        friction: Math.max(0.08, Math.min(0.8, Number(cursor.friction) || 0.34)),
        gravity: 0,
      },
      smile: 1,
      mainColor: hexToRgb01(cursor.mainColor, [0.97, 0.95, 0.92]),
      borderColor: hexToRgb01(cursor.borderColor, [0.0, 0.28, 0.25]),
      isFlatColor: !!cursor.flatColor,
    };
    const mouse = {
      x: .5 * window.innerWidth,
      y: .5 * window.innerHeight,
      tX: .5 * window.innerWidth,
      tY: .5 * window.innerHeight,
      moving: false,
    };
    const textureEl = document.createElement('canvas');
    const textureCtx = textureEl.getContext('2d')!;
    const dotSize = (i: number) => params.size * window.innerHeight * (1 - .2 * Math.pow(3 * i / params.tail.dotsNumber - 1, 2));
    const trail = Array.from({ length: params.tail.dotsNumber }, (_, i) => ({
      x: mouse.x, y: mouse.y, vx: 0, vy: 0,
      opacity: .04 + .28 * Math.pow(1 - i / params.tail.dotsNumber, 4),
      bordered: .62 * Math.pow(1 - i / params.tail.dotsNumber, 1),
      r: dotSize(i),
    }));

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) || 'shader error');
      return shader;
    };
    const program = gl.createProgram()!;
    gl.attachShader(program, compile(gl.VERTEX_SHADER, vertShader));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragShader));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) || 'program error');
    gl.useProgram(program);

    const uniforms: Record<string, WebGLUniformLocation | null> = {};
    const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < count; i++) {
      const name = gl.getActiveUniform(program, i)?.name;
      if (name) uniforms[name] = gl.getUniformLocation(program, name);
    }

    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.uniform1i(uniforms.u_texture, 0);
    gl.uniform1f(uniforms.u_size, params.size);
    gl.uniform3f(uniforms.u_main_color, params.mainColor[0], params.mainColor[1], params.mainColor[2]);
    gl.uniform3f(uniforms.u_border_color, params.borderColor[0], params.borderColor[1], params.borderColor[2]);
    gl.uniform1f(uniforms.u_flat_color, params.isFlatColor ? 1 : 0);

    let timer = window.setTimeout(() => { mouse.moving = false; }, 300);
    const updateMouse = (x: number, y: number) => {
      mouse.moving = true;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => { mouse.moving = false; }, 300);
      mouse.tX = x;
      const size = params.size * window.innerHeight;
      const adjustedY = y - .55 * size;
      mouse.tY = adjustedY > size ? adjustedY : size;
    };

    const updateTexture = () => {
      textureCtx.fillStyle = 'black';
      textureCtx.fillRect(0, 0, textureEl.width, textureEl.height);
      trail.forEach((p, i) => {
        if (i === 0) { p.x = mouse.x; p.y = mouse.y; }
        else {
          p.vx += (trail[i - 1].x - p.x) * params.tail.spring;
          p.vx *= params.tail.friction;
          p.vy += (trail[i - 1].y - p.y) * params.tail.spring;
          p.vy *= params.tail.friction;
          p.vy += params.tail.gravity;
          p.x += p.vx;
          p.y += p.vy;
        }
        const grad = textureCtx.createRadialGradient(p.x, p.y, p.r * p.bordered, p.x, p.y, p.r);
        grad.addColorStop(0, `rgba(255,255,255,${p.opacity})`);
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        textureCtx.fillStyle = grad;
        textureCtx.beginPath();
        textureCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        textureCtx.fill();
      });
    };

    const resize = () => {
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      textureEl.width = window.innerWidth;
      textureEl.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform1f(uniforms.u_ratio, canvas.width / canvas.height);
      trail.forEach((p, i) => { p.r = dotSize(i); });
    };

    let raf = 0;
    const render = () => {
      const t = performance.now();
      gl.uniform1f(uniforms.u_time, t);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      if (mouse.moving) {
        params.smile = Math.max(params.smile - .05, -.1);
        params.tail.gravity = Math.max(params.tail.gravity - 10 * params.size, 0);
      } else {
        params.smile = Math.min(params.smile + .01, 1);
        params.tail.gravity = params.tail.gravity > 25 * params.size
          ? (25 + 5 * (1 + Math.sin(.002 * t))) * params.size
          : params.tail.gravity + params.size;
      }
      mouse.x += (mouse.tX - mouse.x) * .1;
      mouse.y += (mouse.tY - mouse.y) * .1;
      gl.uniform1f(uniforms.u_smile, params.smile);
      gl.uniform2f(uniforms.u_pointer, mouse.x / window.innerWidth, 1 - mouse.y / window.innerHeight);
      gl.uniform2f(uniforms.u_target_pointer, mouse.tX / window.innerWidth, 1 - mouse.tY / window.innerHeight);
      updateTexture();
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureEl);
      raf = requestAnimationFrame(render);
    };

    const onMove = (e: PointerEvent) => updateMouse(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => e.touches[0] && updateMouse(e.touches[0].clientX, e.touches[0].clientY);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('click', onMove as any);
    window.addEventListener('touchmove', onTouch, { passive: true });
    window.addEventListener('resize', resize);
    resize();
    render();

    return () => {
      document.documentElement.classList.remove('ghost-cursor-enabled');
      window.clearTimeout(timer);
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('click', onMove as any);
      window.removeEventListener('touchmove', onTouch);
      window.removeEventListener('resize', resize);
    };
  }, [cursor.enabled, cursor.size, cursor.tailDots, cursor.spring, cursor.friction, cursor.mainColor, cursor.borderColor, cursor.flatColor]);

  return <canvas ref={canvasRef} id="ghost-cursor" aria-hidden="true" />;
}
