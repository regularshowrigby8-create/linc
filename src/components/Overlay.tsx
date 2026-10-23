import { useEffect, useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { IconButton } from '@/components/Button';

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

const useDialogBehaviour = (
  open: boolean,
  onClose: () => void,
  panelRef: React.RefObject<HTMLElement | null>,
) => {
  // Keep the close handler in a ref so the effect only re-runs when the dialog
  // opens or closes. Re-running it on every render would steal focus from a
  // field the person is typing in.
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (event.key !== 'Tab') return;
      const panel = panelRef.current;
      if (!panel) return;
      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (element) => element.offsetParent !== null || element === document.activeElement,
      );
      if (focusable.length === 0) {
        event.preventDefault();
        panel.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown, true);
    const timer = window.setTimeout(() => {
      const panel = panelRef.current;
      if (!panel) return;
      const focusable = panel.querySelector<HTMLElement>(FOCUSABLE);
      (focusable ?? panel).focus();
    }, 0);

    return () => {
      document.removeEventListener('keydown', onKeyDown, true);
      window.clearTimeout(timer);
      previouslyFocused?.focus?.();
    };
  }, [open, panelRef]);
};

interface DialogProps {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  variant: 'modal' | 'drawer';
}

const Dialog = ({ open, title, description, onClose, children, footer, variant }: DialogProps) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  useDialogBehaviour(open, onClose, panelRef);

  if (!open) return null;

  return createPortal(
    <div className="lh-overlay" data-variant={variant}>
      <div className="lh-overlay__scrim" onClick={onClose} aria-hidden="true" />
      <div
        className="lh-overlay__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        ref={panelRef}
        tabIndex={-1}
        data-testid={`${variant}-panel`}
      >
        <header className="lh-overlay__header">
          <div className="lh-stack-sm">
            <h2 className="lh-h3" id={titleId}>
              {title}
            </h2>
            {description ? (
              <p className="lh-caption" id={descriptionId}>
                {description}
              </p>
            ) : null}
          </div>
          <IconButton label="Close" onClick={onClose}>
            <span aria-hidden="true">×</span>
          </IconButton>
        </header>
        <div className="lh-overlay__body">{children}</div>
        {footer ? <footer className="lh-overlay__footer">{footer}</footer> : null}
      </div>
    </div>,
    document.body,
  );
};

interface ModalProps {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}

export const Modal = ({ open, title, description, onClose, children, footer }: ModalProps) => (
  <Dialog
    open={open}
    title={title}
    description={description}
    onClose={onClose}
    footer={footer}
    variant="modal"
  >
    {children}
  </Dialog>
);

interface DrawerProps {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}

export const Drawer = ({ open, title, description, onClose, children, footer }: DrawerProps) => (
  <Dialog
    open={open}
    title={title}
    description={description}
    onClose={onClose}
    footer={footer}
    variant="drawer"
  >
    {children}
  </Dialog>
);
