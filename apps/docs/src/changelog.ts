import { mountToaster, toast } from '@yusufceng1z/ding';

// Live demos for the What's new page. They run the shipped library as it is.
mountToaster({ position: 'top-center', theme: 'system', labels: { region: 'اعلان‌ها', dismiss: 'بستن اعلان' } });

const $ = <T extends HTMLElement>(sel: string) => document.querySelector<T>(sel)!;
const later = (fn: () => void, ms = 60) => setTimeout(fn, ms);
// progress numbers in toast text use Persian digits
const fa = (n: number) => n.toLocaleString('fa-IR');

// Progress toasts: the same updates as the Download and Upload demos on the home page.
let tick: ReturnType<typeof setInterval> | undefined;
const run = (start: () => void) => {
  clearInterval(tick);
  toast.dismiss();
  later(start, 400);
};
$('#runDownload').addEventListener('click', () =>
  run(() => {
    const id = toast.info('design-system.zip', { description: 'در حال دانلود · ۰٪', progress: 0 });
    let n = 0;
    tick = setInterval(() => {
      n = Math.min(100, n + 2 + Math.floor(Math.random() * 7));
      if (n < 100) return toast.update(id, { description: `در حال دانلود · ${fa(n)}٪`, progress: n / 100 });
      clearInterval(tick);
      toast.update(id, { type: 'success', title: 'دانلود کامل شد', description: '۸۴ مگابایت · در پوشهٔ دانلودها ذخیره شد', progress: null });
    }, 120);
  }),
);
$('#runUpload').addEventListener('click', () =>
  run(() => {
    const id = toast.loading('در حال آپلود ۰٪', { progress: 0 });
    let n = 0;
    tick = setInterval(() => {
      n = Math.min(100, n + 1 + Math.floor(Math.random() * 6));
      if (n < 100) return toast.update(id, { title: `در حال آپلود ${fa(n)}٪`, progress: n / 100 });
      clearInterval(tick);
      toast.update(id, { type: 'success', title: 'آپلود کامل شد', description: 'photo-2026.raw · ۲۴٫۱ مگابایت', progress: null });
    }, 110);
  }),
);

// Button order: an error has a close button, then it becomes a toast with an action.
const showOrder = () => {
  const names = [...document.querySelectorAll<HTMLButtonElement>('.tst-body button')].map((b) => (b.classList.contains('tst-close') ? 'بستن' : b.textContent));
  $('#orderOut').textContent = `دکمه‌ها: ${names.length ? names.join('، ') : '-'}`;
};
$('#openErr').addEventListener('click', () => {
  clearInterval(tick);
  toast.dismiss();
  later(() => {
    toast.error('پرداخت ناموفق بود', { description: 'کارت شما رد شد' });
    later(showOrder, 700);
  }, 400);
});
$('#openUndo').addEventListener('click', () => {
  toast.success('پیام حذف شد', { action: { label: 'بازگردانی', onClick: () => ({ type: 'info', title: 'بازگردانی شد' }) } });
  later(showOrder, 700);
});
