import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useStore } from '@/state/store';
import { IconButton } from '@/components/Button';

const TOAST_TONE_LABEL: Record<string, string> = {
  success: 'Success',
  error: 'Error',
  info: 'Information',
};

export const ToastHost = () => {
  const { state, dispatch } = useStore();

  useEffect(() => {
    if (state.toasts.length === 0) return;
    const timers = state.toasts.map((toast) =>
      window.setTimeout(() => dispatch({ type: 'dismiss_toast', id: toast.id }), 4000),
    );
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [state.toasts, dispatch]);

  if (state.toasts.length === 0) return null;

  return createPortal(
    <div className="lh-toast-host" role="status" aria-live="polite">
      {state.toasts.map((toast) => (
        <div key={toast.id} className={`lh-toast lh-toast--${toast.tone}`}>
          <span className="lh-toast__label">{TOAST_TONE_LABEL[toast.tone]}</span>
          <p className="lh-toast__message">{toast.message}</p>
          <IconButton
            label="Dismiss notification"
            onClick={() => dispatch({ type: 'dismiss_toast', id: toast.id })}
          >
            <span aria-hidden="true">×</span>
          </IconButton>
        </div>
      ))}
    </div>,
    document.body,
  );
};
