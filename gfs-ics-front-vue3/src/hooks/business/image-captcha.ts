import { ref } from 'vue';
import { fetchGetCaptcha } from '@/service/api';

export function useImageCaptcha() {
  const captchaImg = ref('');
  const captchaId = ref('');
  const loading = ref(false);

  async function getCaptcha() {
    loading.value = true;
    try {
      const key = Date.now().toString();
      captchaId.value = key;
      const { data, error } = await fetchGetCaptcha(key);
      if (!error && data) {
        captchaImg.value = URL.createObjectURL(data);
      }
    } catch (err) {
      console.error('Failed to get captcha:', err);
    } finally {
      loading.value = false;
    }
  }

  return {
    captchaImg,
    captchaId,
    loading,
    getCaptcha
  };
}
