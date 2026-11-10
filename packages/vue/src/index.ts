import { defineComponent, onBeforeUnmount, onMounted, watch, type PropType } from 'vue';
import { toast, mountToaster, type Dir, type Position, type Theme, type ToastLabels } from '@yusufceng1z/ding';

export { toast };
export type { Dir, Position, Theme, ToastLabels };

/**
 * Mount once, near the root of your app. It renders nothing in place: the toasts live in a
 * viewport appended to `document.body`, and mounting happens in `onMounted`, so it is a no-op on the server.
 */
export const Toaster = defineComponent({
  name: 'Toaster',
  props: {
    position: String as PropType<Position>,
    theme: String as PropType<Theme>,
    /** Sets `dir` on the viewport. Leave unset to inherit the page's direction. */
    dir: String as PropType<Dir>,
    labels: Object as PropType<Partial<ToastLabels>>,
    /** CSP nonce for the injected stylesheet. */
    nonce: String,
  },
  setup(props) {
    let unmount: (() => void) | undefined;
    onMounted(() => {
      unmount = mountToaster({ position: props.position, theme: props.theme, dir: props.dir, labels: props.labels, nonce: props.nonce });
    });
    // Watched by value, not by object, so an inline `:labels="{ ... }"` does not reconfigure on every render.
    watch(
      () => [props.position, props.theme, props.dir, props.labels?.region, props.labels?.dismiss] as const,
      ([position, theme, dir, region, dismiss]) => toast.configure({ position, theme, dir, labels: { region, dismiss } }),
    );
    onBeforeUnmount(() => unmount?.());
    return () => null;
  },
});
