import { mountToaster, toast } from '@yusufceng1z/ding';

// Live demo for the keyword pages: buttons fire the real toast.
mountToaster({ position: 'top-center', theme: 'system', labels: { region: 'اعلان‌ها', dismiss: 'بستن اعلان' } });

const RUN: Record<string, () => void> = {
  success: () => void toast.success('ذخیره شد'),
  error: () => void toast.error('پرداخت ناموفق بود', { description: 'کارت رد شد' }),
  promise: () =>
    void toast.promise(new Promise((r) => setTimeout(r, 1600)), { loading: 'در حال ذخیره…', success: 'ذخیره شد', error: 'ناموفق بود' }),
  undo: () =>
    void toast.success('پیام حذف شد', {
      action: { label: 'بازگردانی', onClick: () => ({ type: 'info', title: 'بازگردانی شد' }) },
    }),
  progress: () => {
    const id = toast.loading('در حال بارگذاری عکس…', { progress: 0 });
    [0.3, 0.6, 0.9].forEach((p, i) => setTimeout(() => toast.update(id, { progress: p }), 500 * (i + 1)));
    setTimeout(() => toast.update(id, { type: 'success', title: 'عکس بارگذاری شد', progress: null }), 2200);
  },
};

document.querySelectorAll<HTMLButtonElement>('[data-demo]').forEach((b) => {
  b.addEventListener('click', () => RUN[b.dataset.demo ?? '']?.());
});
