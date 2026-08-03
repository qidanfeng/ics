<template>
  <svg v-if="svgContent" :class="className" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" v-html="svgContent"></svg>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  icon: {
    type: String,
    required: true
  },
  className: {
    type: String,
    default: ''
  }
});

const svgContent = ref('');

// 图标路径映射
const icons = import.meta.glob('@/assets/svg-icon/*.svg', { as: 'raw' });

const loadIcon = async () => {
  try {
    const iconPath = `/src/assets/svg-icon/${props.icon}.svg`;
    if (icons[iconPath]) {
      const svg = await icons[iconPath]();
      // 提取 SVG 内容,移除外层标签
      const parser = new DOMParser();
      const doc = parser.parseFromString(svg, 'image/svg+xml');
      const symbol = doc.querySelector('symbol');
      if (symbol) {
        svgContent.value = symbol.innerHTML;
      } else {
        svgContent.value = doc.querySelector('svg')?.innerHTML || '';
      }
    }
  } catch (e) {
    console.error(`Failed to load icon: ${props.icon}`, e);
  }
};

// 监听 icon 变化
watch(() => props.icon, loadIcon, { immediate: true });
</script>

<style scoped>
svg {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
