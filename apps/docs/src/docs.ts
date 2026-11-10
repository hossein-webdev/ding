import { mountToaster, toast } from '@yusufceng1z/ding';
import { makeSeg } from './site';
import './site.css';
import './docs.css';

// real toasts for the Run buttons
const labels = { region: 'اعلان‌ها', dismiss: 'بستن اعلان' };
mountToaster({ theme: 'dark', labels });
// pending steps of the last example are cancelled when another one starts, so they never fight over the toast
const timers: ReturnType<typeof setTimeout>[] = [];
const later = (f: () => void, ms: number) => void timers.push(setTimeout(f, ms));
const RUN: Record<string, () => void> = {
  show: () => [() => toast.success('ذخیره شد'), () => toast.error('پرداخت ناموفق بود', { description: 'کارت رد شد' }), () => toast.warning('فضای ذخیره‌سازی تقریباً پر است'), () => toast.info('نسخهٔ جدید در دسترس است')].forEach((f, i) => later(f, i * 1500)),
  promise: () => void toast.promise(new Promise((r) => setTimeout(r, 1800)), { loading: 'در حال ذخیره…', success: 'ذخیره شد', error: 'ذخیره نشد' }),
  progress: () => {
    const id = toast.loading('در حال بارگذاری عکس…', { progress: 0 });
    later(() => toast.update(id, { progress: 0.6 }), 800);
    later(() => toast.update(id, { type: 'success', title: 'عکس بارگذاری شد', progress: null }), 1800);
  },
  undo: () => void toast.success('پیام حذف شد', { action: { label: 'بازگردانی', onClick: () => ({ type: 'info', title: 'بازگردانی شد' }) } }),
  sound: () => {
    toast.configure({ sound: true, volume: 0.5, labels });
    void toast.success('صدا روشن شد');
  },
};

// framework switcher: one choice drives every code sample, and is remembered
const FW = ['React', 'Svelte', 'Vue', 'Vanilla'];
let saved = 'react';
try {
  saved = localStorage.getItem('ding-fw') ?? saved;
} catch {
  // storage can be blocked
}
document.body.dataset.fw = saved;
document.getElementById('fw')!.append(
  makeSeg('فریم‌ورک', FW, FW.find((n) => n.toLowerCase() === saved) ?? 'React', (n) => {
    document.body.dataset.fw = n.toLowerCase();
    try {
      localStorage.setItem('ding-fw', n.toLowerCase());
    } catch {
      // storage can be blocked
    }
  }),
);

// Run and Copy on every code block, plus a link on every heading
document.querySelectorAll('pre').forEach((pre) => {
  const bar = Object.assign(document.createElement('div'), { className: 'pbar' });
  const run = pre.dataset.run;
  if (run && RUN[run]) {
    const r = Object.assign(document.createElement('button'), { type: 'button', className: 'prun', textContent: 'اجرا' });
    r.onclick = () => {
      timers.splice(0).forEach(clearTimeout);
      RUN[run]!();
    };
    bar.append(r);
  }
  const b = Object.assign(document.createElement('button'), { type: 'button', className: 'pcopy', textContent: 'کپی' });
  b.onclick = async () => {
    const code = pre.querySelector('code')!;
    try {
      await navigator.clipboard.writeText(code.innerText);
      b.textContent = 'کپی شد';
    } catch {
      b.textContent = 'کلیدهای Ctrl+C را بزنید';
      getSelection()?.selectAllChildren(code);
    }
    setTimeout(() => (b.textContent = 'کپی'), 1600);
  };
  bar.append(b);
  pre.append(bar);
});
document.querySelectorAll<HTMLElement>('main section[id] > h2').forEach((h2) => {
  const a = Object.assign(document.createElement('a'), { className: 'anchor', href: `#${h2.parentElement!.id}`, textContent: '#' });
  a.setAttribute('aria-label', `پیوند به ${h2.textContent}`);
  h2.append(a);
});

// highlight the section being read
const links = [...document.querySelectorAll<HTMLAnchorElement>('.side a')];
const mark = (id: string) => links.forEach((a) => (a.hash === `#${id}` ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current')));
const secs = [...document.querySelectorAll<HTMLElement>('main section[id]')];
// the current section is the last one whose top has passed the reading line
const update = () => {
  const cur = secs.filter((s) => s.getBoundingClientRect().top <= 180).at(-1) ?? secs[0]!;
  mark(cur.id);
};
let queued = false;
addEventListener('scroll', () => {
  if (queued) return;
  queued = true;
  requestAnimationFrame(() => ((queued = false), update()));
}, { passive: true });
update();
