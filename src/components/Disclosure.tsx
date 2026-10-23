import { useId, useState, type ReactNode } from 'react';
import { ChevronDownIcon } from '@/components/icons';

interface DisclosureProps {
  /** Short label on the control, for example "Listing details". */
  summary: string;
  children: ReactNode;
  defaultOpen?: boolean;
  /** Rendered before the label, usually an icon. */
  icon?: ReactNode;
  /** Extra hint shown on the control, kept out of the accessible name. */
  hint?: string;
  className?: string;
}

/**
 * Progressive disclosure. Anything a person cannot act on and does not need
 * at a glance belongs behind one of these rather than on the surface.
 *
 * The panel is marked inert while collapsed so that its links and buttons are
 * not reachable by keyboard, and it animates open with a grid row transition
 * rather than a fixed height.
 */
export const Disclosure = ({
  summary,
  children,
  defaultOpen = false,
  icon,
  hint,
  className,
}: DisclosureProps) => {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();

  return (
    <div
      className={['lh-disclosure', open && 'lh-disclosure--open', className]
        .filter(Boolean)
        .join(' ')}
    >
      <button
        type="button"
        className="lh-disclosure__trigger"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        {icon ? <span className="lh-disclosure__icon">{icon}</span> : null}
        <span className="lh-disclosure__label">{summary}</span>
        {hint ? <span className="lh-disclosure__hint">{hint}</span> : null}
        <ChevronDownIcon className="lh-disclosure__chevron" />
      </button>
      <div id={panelId} className="lh-disclosure__panel" inert={!open}>
        <div className="lh-disclosure__content">{children}</div>
      </div>
    </div>
  );
};
