import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/svelte';
import { flushSync } from 'svelte';
import { ICONS } from '@yusufceng1z/ding';
import { Toaster, toast } from '../src/lib/index.ts';

beforeEach(() => void vi.useFakeTimers());

// The store is a module singleton: remove every toast (they leave on timers) and restore defaults between tests.
afterEach(() => {
  cleanup();
  toast.dismiss();
  vi.advanceTimersByTime(1000);
  vi.useRealTimers();
  toast.configure({
    position: 'top-center',
    theme: 'system',
    dir: undefined,
    labels: { region: 'Notifications', dismiss: 'Dismiss notification' },
  });
  document.querySelector('style[data-toast]')?.remove();
});

const viewport = (c: HTMLElement) => c.querySelector<HTMLElement>('.tst-viewport')!;

describe('Svelte Toaster', () => {
  it('renders the viewport as a labelled region with its live regions', () => {
    const { container } = render(Toaster);
    const vp = viewport(container);
    expect(vp.getAttribute('role')).toBe('region');
    expect(vp.getAttribute('aria-label')).toBe('Notifications');
    expect(vp.querySelector('[role="status"]')).not.toBeNull();
    expect(vp.querySelector('[role="alert"]')).not.toBeNull();
  });

  it('forwards position and theme to the store and the markup', () => {
    const { container } = render(Toaster, { position: 'bottom-right', theme: 'dark' });
    expect(toast.getState().position).toBe('bottom-right');
    expect(viewport(container).dataset.position).toBe('bottom-right');
    expect(viewport(container).dataset.theme).toBe('dark');
  });

  it.each(['top-start', 'top-end', 'bottom-start', 'bottom-end'] as const)('accepts the logical position %s', (position) => {
    const { container } = render(Toaster, { position });
    expect(toast.getState().position).toBe(position);
    expect(viewport(container).dataset.position).toBe(position);
  });

  // Svelte re-assigns `el.dir` on every update (a Chromium workaround), which leaves an empty dir="" that still inherits
  const dirOf = (c: HTMLElement) => viewport(c).getAttribute('dir') ?? '';

  it('leaves dir unset by default so the page direction applies', () => {
    const { container } = render(Toaster);
    expect(dirOf(container)).toBe('');
  });

  it('sets dir on the viewport and drops it when the prop is removed', async () => {
    const { container, rerender } = render(Toaster, { dir: 'rtl' });
    expect(viewport(container).getAttribute('dir')).toBe('rtl');
    await rerender({ dir: undefined });
    expect(dirOf(container)).toBe('');
  });

  it('uses the labels prop for the region and the close button', () => {
    const { container } = render(Toaster, { labels: { region: 'Alertes', dismiss: 'Fermer' } });
    toast.error('Boom', { duration: 0 });
    flushSync();
    expect(viewport(container).getAttribute('aria-label')).toBe('Alertes');
    expect(container.querySelector('.tst-close')?.getAttribute('aria-label')).toBe('Fermer');
  });

  it('announces toasts through the live regions', () => {
    const { container } = render(Toaster);
    toast.success('Saved');
    flushSync();
    expect(viewport(container).querySelector('[role="status"]')?.textContent).toContain('Saved');
    toast.error('Payment failed');
    flushSync();
    expect(viewport(container).querySelector('[role="alert"]')?.textContent).toContain('Payment failed');
  });

  it('dismisses a sticky toast from its close button', async () => {
    const { container } = render(Toaster);
    const id = toast.error('Boom', { duration: 0 });
    flushSync();
    const close = container.querySelector<HTMLButtonElement>('.tst-close');
    expect(close).not.toBeNull();
    await fireEvent.click(close!);
    expect(toast.getState().toasts.find((t) => t.id === id)?.phase).toBe('closing');
  });

  it('sizes its icons itself, so they stay small when the stylesheet is blocked', () => {
    const { container } = render(Toaster);
    toast.error('Boom', { duration: 0 });
    flushSync();
    const size = (sel: string) => [container.querySelector(sel)?.getAttribute('width'), container.querySelector(sel)?.getAttribute('height')];
    expect(size('.tst-svg')).toEqual(['22', '22']);
    expect(size('.tst-close svg')).toEqual(['12', '12']);
    toast.info('Photo', { image: 'data:image/gif;base64,R0lGODlhAQABAAAAACw=' });
    flushSync();
    expect(size('.tst-media')).toEqual(['28', '28']);
  });

  it('puts the nonce on the injected stylesheet', () => {
    render(Toaster, { nonce: 'abc123' });
    const style = document.querySelector<HTMLStyleElement>('style[data-toast]');
    expect(style).not.toBeNull();
    expect(style!.nonce).toBe('abc123');
  });

  it('mounts with a toast without throwing (animations are not asserted)', () => {
    expect(() => {
      render(Toaster);
      toast.loading('Uploading', { progress: 0.4 });
      flushSync();
    }).not.toThrow();
  });

  it('does not repaint an already-shown toast when configure({ icons }) changes afterwards', () => {
    const before = [...ICONS.success];
    const { container } = render(Toaster);
    toast.success('Saved');
    flushSync();
    const original = container.querySelector('.tst-svg path')?.getAttribute('d');
    toast.configure({ icons: { success: ['M0 0h1', 'M0 0h2'] } });
    flushSync();
    expect(container.querySelector('.tst-svg path')?.getAttribute('d')).toBe(original);
    toast.configure({ icons: { success: before } });
  });
});
