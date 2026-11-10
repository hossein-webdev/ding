import { createRoot } from 'react-dom/client';
import { Toaster } from '@yusufceng1z/ding-react';
import { mountSite } from './site';

mountSite(document.getElementById('site')!, 'react');
createRoot(document.getElementById('app')!).render(<Toaster labels={{ region: 'اعلان‌ها', dismiss: 'بستن اعلان' }} />);
