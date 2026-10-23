import type { AccentName } from '@/data/types';
import { ACCENT_CHOICES } from '@/state/selectors';

interface AccentPickerProps {
  value: AccentName;
  onChange: (accent: AccentName) => void;
  idPrefix?: string;
  label?: string;
}

/** Lets a member choose the accent that colours their own surfaces. */
export const AccentPicker = ({
  value,
  onChange,
  idPrefix = 'accent',
  label = 'Your accent colour',
}: AccentPickerProps) => (
  <div className="lh-accentpicker" role="group" aria-label={label}>
    {ACCENT_CHOICES.map((choice) => {
      const active = choice.name === value;
      return (
        <button
          key={choice.name}
          type="button"
          id={`${idPrefix}-${choice.name}`}
          data-accent={choice.name}
          className={`lh-accentpicker__swatch${active ? ' lh-accentpicker__swatch--active' : ''}`}
          aria-pressed={active}
          aria-label={choice.label}
          title={choice.label}
          onClick={() => onChange(choice.name)}
        >
          <span className="lh-sr-only">{choice.label}</span>
        </button>
      );
    })}
  </div>
);
