import './site.css';
import { toast, chime } from '@yusufceng1z/ding';
import { MASCOT } from './mascot';

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
// progress numbers in toast text use Persian digits
const fa = (n: number) => n.toLocaleString('fa-IR');

const avatar = (letters: string, bg: string) =>
  `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 56"><rect width="56" height="56" fill="${bg}"/><text x="28" y="35" font-family="system-ui,sans-serif" font-size="22" font-weight="600" text-anchor="middle" fill="#fff">${letters}</text></svg>`)}`;

const demos = new Map<string, () => void>([
  ['Save', () => void toast.success('تغییرات ذخیره شد')],
  ['Error', () => void toast.error('پرداخت ناموفق بود', { description: 'کارت شما رد شد. کارت دیگری را امتحان کنید.' })],
  ['Warning', () => void toast.warning('فضای ذخیره‌سازی رو به پایان است', { description: 'فضا آزاد کنید یا طرح خود را ارتقا دهید.' })],
  ['Info', () => void toast.info('نسخهٔ جدید در دسترس است')],
  ['Promise', () => void toast.promise(wait(2000), { loading: 'در حال آپلود عکس…', success: 'عکس آپلود شد', error: 'آپلود ناموفق بود. دوباره تلاش کنید.' })],
  ['Description', () => void toast.success('استقرار آماده است', { description: 'برنامهٔ my-app روی my-app.vercel.app آنلاین شد' })],
  ['Message', () => void toast.info('سارا چن', {
    image: avatar('س‌چ', '#6d5dfc'),
    meta: 'الان',
    description: 'قبل از استندآپ می‌شود PR را بررسی کنی؟',
    action: { label: 'پاسخ', onClick: () => ({ type: 'success', title: 'پاسخ ارسال شد', description: '', image: null }) },
    secondary: { label: 'بعداً', onClick: () => undefined },
  })],
  ['Meeting', () => void toast.info('جلسهٔ طراحی تا ۵ دقیقهٔ دیگر', {
    image: avatar('ج‌ط', '#0f9d6b'),
    description: 'اتاق ۴ · ۶ شرکت‌کننده',
    action: { label: 'پیوستن', onClick: () => ({ type: 'success', title: 'در حال پیوستن…', description: '', image: null }) },
    secondary: { label: 'به تعویق', onClick: () => ({ type: 'info', title: '۱۰ دقیقه به تعویق افتاد', description: '', image: null, action: null, secondary: null, duration: 3000 }) },
  })],
  ['Copy', () => void toast.success('لینک کپی شد', { meta: '⌘V', duration: 2500 })],
  ['Music', () => {
    const tracks: [string, string][] = [['Midnight City', 'M83 · Hurry Up, We’re Dreaming'], ['Intro', 'The xx · xx'], ['Kids', 'MGMT · Oracular Spectacular']];
    let i = 0, n = 0;
    const stop = () => (clearInterval(tick), { type: 'info' as const, title: 'پخش متوقف شد', description: '', meta: null, image: null, progress: null, action: null, secondary: null, duration: 2500 });
    // a patch that keeps both buttons: act() removes buttons unless the patch names them
    const next = () => {
      i = (i + 1) % tracks.length;
      n = 0;
      return { title: tracks[i]![0], description: tracks[i]![1], progress: 0, action: { label: 'بعدی', onClick: next }, secondary: { label: 'توقف', onClick: stop } };
    };
    const id = toast.info(tracks[0]![0], { image: avatar('♪', '#1d1d22'), description: tracks[0]![1], meta: 'در حال پخش', progress: 0, duration: 0, action: { label: 'بعدی', onClick: next }, secondary: { label: 'توقف', onClick: stop } });
    const tick = setInterval(() => {
      n += 0.02;
      if (n < 1) return toast.update(id, { progress: n });
      const { title, description } = next();
      toast.update(id, { title, description, progress: 0 });
    }, 300);
  }],
  ['Update', () => void toast.info('به‌روزرسانی در دسترس است', {
    description: 'نسخهٔ 2.4 آمادهٔ نصب است.',
    action: { label: 'راه‌اندازی مجدد', onClick: () => { const id = 'upd'; setTimeout(() => toast.update(id, { type: 'success', title: 'نسخهٔ شما به‌روز است', description: 'نسخهٔ 2.4' }), 2200); return { type: 'loading', title: 'در حال راه‌اندازی مجدد…', description: 'چند ثانیه طول می‌کشد', action: null, secondary: null }; } },
    secondary: { label: 'بعداً', onClick: () => undefined },
    id: 'upd',
  })],
  ['Offline', () => void toast.error('اتصال شما قطع است', {
    description: 'با اتصال دوباره، تغییرات همگام‌سازی می‌شود.',
    id: 'off',
    action: { label: 'تلاش دوباره', onClick: () => { setTimeout(() => toast.update('off', { type: 'success', title: 'دوباره آنلاین شدید', description: 'همهٔ تغییرات همگام‌سازی شد' }), 2000); return { type: 'loading', title: 'در حال اتصال دوباره…', description: '' , action: null }; } },
  })],
  ['Invite', () => void toast.info('الکس شما را به Atlas دعوت کرد', {
    image: avatar('ال', '#e5484d'),
    description: 'فضای کاری طراحی محصول · ۱۲ عضو',
    action: { label: 'پذیرفتن', onClick: () => ({ type: 'success', title: 'به Atlas پیوستید', description: 'حالا می‌توانید ۱۲ عضو را ببینید', image: null }) },
    secondary: { label: 'رد کردن', onClick: () => undefined },
  })],
  ['Download', () => {
    const id = toast.info('design-system.zip', { image: avatar('ZIP', '#3b3b44'), description: 'در حال دانلود · ۰٪', progress: 0, secondary: { label: 'لغو', onClick: () => { clearInterval(tick); return { type: 'error', title: 'دانلود لغو شد', description: '', image: null, progress: null, secondary: null, duration: 3000 }; } } });
    let n = 0;
    const tick = setInterval(() => {
      n = Math.min(100, n + 2 + Math.floor(Math.random() * 7));
      if (n < 100) return toast.update(id, { description: `در حال دانلود · ${fa(n)}٪`, progress: n / 100 });
      clearInterval(tick);
      toast.update(id, { type: 'success', title: 'دانلود کامل شد', description: '۸۴ مگابایت · در پوشهٔ دانلودها ذخیره شد', image: null, progress: null, secondary: null });
    }, 120);
  }],
  ['Order', () => {
    const id = toast.loading('سفارش تأیید شد', { description: 'غذای شما در حال آماده‌سازی است' });
    const steps: [string, string, string?][] = [['در حال آماده‌سازی', 'آشپزخانه سفارش شما را دریافت کرد'], ['در راه است', 'پیک تا ۸ دقیقهٔ دیگر می‌رسد'], ['تحویل داده شد', 'نوش جان', 'success']];
    steps.forEach(([title, description, type], i) => setTimeout(() => toast.update(id, { title, description, ...(type && { type: type as 'success' }) }), (i + 1) * 2200));
  }],
  ['Undo', () => void toast.success('پیام حذف شد', { action: { label: 'بازگردانی', onClick: () => ({ type: 'success', title: 'پیام بازگردانی شد' }) }, duration: 8000 })],
  ['Confirm', () => void toast.warning('تغییرات ذخیره‌نشده دور انداخته شود؟', { action: { label: 'دور انداختن', onClick: () => ({ type: 'error', title: 'تغییرات دور انداخته شد' }) } })],
  ['Sync', () => {
    const id = toast.loading('در حال همگام‌سازی ۳ فایل…');
    setTimeout(() => toast.update(id, { type: 'success', title: 'همهٔ فایل‌ها همگام شد', description: 'آخرین همگام‌سازی: همین الان' }), 2000);
  }],
  ['Upload', () => {
    const id = toast.loading('در حال آپلود ۰٪', { progress: 0 });
    let n = 0;
    const tick = setInterval(() => {
      n = Math.min(100, n + 1 + Math.floor(Math.random() * 6));
      if (n < 100) return toast.update(id, { title: `در حال آپلود ${fa(n)}٪`, progress: n / 100 });
      clearInterval(tick);
      toast.update(id, { type: 'success', title: 'آپلود کامل شد', description: 'photo-2026.raw · ۲۴٫۱ مگابایت', progress: null });
    }, 110);
  }],
  ['Sequence', () => [() => toast.loading('در حال آپلود عکس…'), () => toast.success('عکس آپلود شد'), () => toast.error('همگام‌سازی ناموفق بود', { description: 'اتصال خود را بررسی کنید' }), () => toast.info('تلاش دوباره تا ۳ ثانیه دیگر')].forEach((f, i) => setTimeout(f, i * 1300))],
]);

const GROUPS: [string, string, string[]][] = [
  ['Status', 'بازخورد سریع', ['Save', 'Error', 'Warning', 'Info', 'Description']],
  ['Progress', 'یک توست که درجا به‌روز می‌شود', ['Promise', 'Sync', 'Upload', 'Download', 'Order', 'Sequence']],
  ['Content', 'آواتار، دکمه و جزئیات', ['Message', 'Meeting', 'Invite', 'Music', 'Copy']],
  ['Actions', 'بازگردانی، تأیید و تلاش دوباره', ['Undo', 'Confirm', 'Update', 'Offline']],
  ['Sound', 'صدای هر نوع را بشنوید. صدای دستگاه را روشن کنید.', ['Success', 'Error', 'Warning', 'Info']],
];
// the English names above are lookup keys; this is what the buttons and headings show ("Promise" stays as the API name)
const LABEL: Record<string, string> = {
  Status: 'وضعیت', Progress: 'پیشرفت', Content: 'محتوا', Actions: 'اقدام‌ها', Sound: 'صدا',
  Save: 'ذخیره', Error: 'خطا', Warning: 'هشدار', Info: 'اطلاع', Success: 'موفق', Description: 'توضیح',
  Sync: 'همگام‌سازی', Upload: 'آپلود', Download: 'دانلود', Order: 'سفارش', Sequence: 'توالی',
  Message: 'پیام', Meeting: 'جلسه', Invite: 'دعوت', Music: 'موسیقی', Copy: 'کپی',
  Undo: 'بازگردانی', Confirm: 'تأیید', Update: 'به‌روزرسانی', Offline: 'آفلاین',
};
const SOUND_TYPES = { Success: 'success', Error: 'error', Warning: 'warning', Info: 'info' } as const;
const POSITIONS = ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'] as const;
const NAMES: Record<(typeof POSITIONS)[number], string> = {
  'top-left': 'بالا چپ', 'top-center': 'بالا', 'top-right': 'بالا راست',
  'bottom-left': 'پایین چپ', 'bottom-center': 'پایین', 'bottom-right': 'پایین راست',
};
const INSTALL = { React: 'npm i @yusufceng1z/ding-react', Svelte: 'npm i @yusufceng1z/ding-svelte', Vue: 'npm i @yusufceng1z/ding-vue', Vanilla: 'npm i @yusufceng1z/ding', shadcn: 'npx shadcn@latest add @ding/ding' } as const;
const GITHUB = 'https://github.com/YusufCeng1z/ding';
const GH_ICON = '<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>';

const h = <K extends keyof HTMLElementTagNameMap>(tag: K, props: Partial<HTMLElementTagNameMap[K]> = {}, ...kids: (Node | string)[]) => {
  const n = Object.assign(document.createElement(tag), props);
  n.append(...kids);
  return n;
};
const pressed = (b: HTMLElement, on: boolean) => b.setAttribute('aria-pressed', String(on));

/** Segmented control with one indicator that slides between options instead of each option snapping. */
export function makeSeg(label: string, names: string[], initial: string, onPick: (name: string) => void) {
  const ind = h('span', { className: 'ind' });
  const btns = names.map((n) => h('button', { type: 'button', textContent: n }));
  const el = h('div', { className: 'seg', role: 'group', ariaLabel: label }, ind, ...btns);
  const place = () => {
    const on = btns.find((b) => b.getAttribute('aria-pressed') === 'true');
    if (on && on.offsetWidth) el.style.cssText = `--x:${on.offsetLeft}px;--w:${on.offsetWidth}px`;
  };
  btns.forEach((b) => {
    pressed(b, b.textContent === initial);
    b.onclick = () => {
      btns.forEach((x) => pressed(x, x === b));
      place();
      onPick(b.textContent!);
    };
  });
  // first placement happens without a slide; later ones animate
  requestAnimationFrame(() => {
    place();
    requestAnimationFrame(() => el.classList.add('ready'));
  });
  addEventListener('resize', place);
  document.fonts?.addEventListener('loadingdone', place); // Vazirmatn swaps in after first paint and changes the button widths
  return el;
}
const link = (href: string, text: string, cls = '') => h('a', { href: href.startsWith('/') ? import.meta.env.BASE_URL + href.slice(1) : href, className: cls, textContent: text, ...(href.startsWith('http') && { target: '_blank', rel: 'noopener noreferrer' }) });


export function mountSite(root: HTMLElement, _adapter?: string) {
  (window as unknown as { toast: typeof toast }).toast = toast; // for console experiments
  toast.configure({ theme: 'dark', sound: true, labels: { region: 'اعلان‌ها', dismiss: 'بستن اعلان' } });

  // top bar
  const gh = link(GITHUB, '', 'gh');
  gh.innerHTML = `${GH_ICON}<span>ستاره در GitHub</span>`;
  const bar = h('div', { className: 'bar' }, h('nav', { className: 'nav', ariaLabel: 'ناوبری سایت' }, link('/docs.html', 'مستندات', 'navlink'), link('/changelog/', 'تازه‌ها', 'navlink'), gh));

  // install: pick a framework, copy the command
  let fw: keyof typeof INSTALL = 'React';
  // all three commands share one cell, so the pill never changes width and the swap is a cross-fade
  const codes = (Object.keys(INSTALL) as (keyof typeof INSTALL)[]).map((k) => h('code', { textContent: INSTALL[k], className: k === fw ? 'on' : '' }));
  const code = h('span', { className: 'codes' }, ...codes);
  const copy = h('button', { type: 'button', className: 'copy', textContent: 'کپی' });
  copy.onclick = async () => {
    try {
      try {
        await navigator.clipboard.writeText(INSTALL[fw]);
      } catch {
        // clipboard API can be blocked (iframes, insecure origins): fall back to a selection copy
        const t = Object.assign(document.createElement('textarea'), { value: INSTALL[fw] });
        document.body.append(t);
        t.select();
        const ok = document.execCommand('copy');
        t.remove();
        if (!ok) throw new Error('copy failed');
      }
      void toast.success('در کلیپ‌بورد کپی شد', { id: 'copy', meta: INSTALL[fw], duration: 2500 });
      copy.textContent = 'کپی شد';
      setTimeout(() => (copy.textContent = 'کپی'), 1600);
    } catch {
      void toast.error('کپی نشد', { id: 'copy', description: 'دستور را انتخاب کنید و دستی کپی کنید.' });
    }
  };
  const fwSeg = makeSeg('فریم‌ورک', Object.keys(INSTALL), fw, (k) => {
    fw = k as keyof typeof INSTALL;
    (Object.keys(INSTALL) as (keyof typeof INSTALL)[]).forEach((n, i) => {
      codes[i]!.classList.toggle('on', n === fw);
      codes[i]!.ariaHidden = String(n !== fw);
    });
  });
  const tryIt = h('button', { type: 'button', className: 'primary', textContent: 'امتحان کنید' });
  tryIt.onclick = demos.get('Order')!;
  const mascot = h('button', { type: 'button', className: 'mascot', ariaLabel: 'دینگ را به صدا درآورید' });
  mascot.innerHTML = MASCOT;
  // the eyes follow the pointer (skipped under reduced motion)
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const reach = 15; // how far an eye may travel, in the drawing's own units
    let raf = 0;
    const look = (x?: number, y?: number) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = mascot.getBoundingClientRect();
        let ex = 0, ey = 0;
        if (x !== undefined && y !== undefined) {
          const dx = x - (r.left + r.width / 2), dy = y - (r.top + r.height * 0.6);
          const d = Math.hypot(dx, dy) || 1;
          const k = Math.min(1, d / 220); // the closer the pointer, the smaller the move
          ex = (dx / d) * reach * k;
          ey = (dy / d) * reach * k;
        }
        mascot.style.setProperty('--ex', `${ex.toFixed(1)}px`);
        mascot.style.setProperty('--ey', `${ey.toFixed(1)}px`);
      });
    };
    document.addEventListener('pointermove', (e) => look(e.clientX, e.clientY), { passive: true });
    document.documentElement.addEventListener('pointerleave', () => look());
  }
  mascot.onclick = () => {
    mascot.classList.remove('ring');
    void mascot.offsetWidth;
    mascot.classList.add('ring');
    void toast.success('دینگ!', { id: 'ding', duration: 1800 });
  };
  const hero = h('div', { className: 'hero' },
    mascot,
    h('h1', { textContent: 'توست‌هایی با فیزیک فنری واقعی.' }),
    h('p', { className: 'tag', textContent: 'یک توست که درجا تغییر شکل می‌دهد. بدون وابستگی. برای React، Svelte، Vue یا DOM ساده.' }),
    h('div', { className: 'actions' }, tryIt),
    h('div', { className: 'install' }, fwSeg, h('div', { className: 'cmd' }, code, copy)),
    link('/llms.txt', 'llms.txt', 'quiet'),
  );

  // settings: the only controls that change the toast itself
  const dots = POSITIONS.map((p) => {
    const b = h('button', { type: 'button', className: 'dot' });
    b.setAttribute('aria-label', NAMES[p]);
    pressed(b, p === 'top-center');
    b.onclick = () => {
      toast.configure({ position: p });
      dots.forEach((x) => pressed(x, x === b));
      void toast.info(NAMES[p], { id: 'pos', duration: 2500 });
    };
    return b;
  });
  const themeSeg = makeSeg('پوستهٔ توست', ['روشن', 'تیره'], 'تیره', (t) => {
    toast.configure({ theme: t === 'تیره' ? 'dark' : 'light' });
    void toast.info(`توست ${t}`, { id: 'theme', duration: 2500 });
  });
  const soundSeg = makeSeg('صدا', ['خاموش', 'روشن'], 'روشن', (v) => {
    toast.configure({ sound: v === 'روشن' });
    // the click that turns sound on also unlocks audio, so this toast can be heard
    void toast.info(v === 'روشن' ? 'صدا روشن شد' : 'صدا خاموش شد', { id: 'sound', duration: 2500 });
  });
  const dismiss = h('button', { type: 'button', className: 'quiet', textContent: 'بستن همه' });
  dismiss.onclick = () => toast.dismiss();
  const field = (label: string, ...kids: Node[]) => h('div', { className: 'field' }, h('span', { className: 'lbl', textContent: label }), ...kids);
  const settings = h('section', { className: 'settings' },
    field('جایگاه', h('div', { className: 'picker', role: 'group', ariaLabel: 'جایگاه توست' }, ...dots)),
    field('صدا', soundSeg),
    field('پوسته', themeSeg),
    dismiss,
  );

  const groups = GROUPS.map(([name, , items]) =>
    h('section', { className: 'group' }, h('h2', { textContent: LABEL[name] }), h('div', { className: 'row' }, ...items.map((n) => {
      const b = h('button', { type: 'button', textContent: LABEL[n] ?? n });
      const fire = name === 'Sound' ? () => chime(SOUND_TYPES[n as keyof typeof SOUND_TYPES]) : demos.get(n)!;
      b.onclick = () => {
        fire();
        b.classList.remove('fired');
        void b.offsetWidth;
        b.classList.add('fired'); // brief ink flash: a click is acknowledged even before the toast moves
      };
      return b;
    }))),
  );
  const foot = h('footer', {}, 'ساختهٔ ', link('https://yusufcengiz.dev', 'yusufcengiz.dev'));
  root.replaceChildren(h('div', { className: 'page' }, h('a', { className: 'skip', href: '#main', textContent: 'پرش به نمونه‌ها' }), bar, h('main', { id: 'main' }, hero, settings, ...groups), foot));
}
