import type { ThemePreference } from '@/data/types';
import { MonitorIcon, MoonIcon, SunIcon } from '@/components/icons';

interface ThemeSwitchProps {
  value: ThemePreference;
  onChange: (value: ThemePreference) => void;
  /** Names the group for assistive technology. */
  label?: string;
  idPrefix?: string;
  /** Shows the icon only. The word stays, for assistive technology. */
  compact?: boolean;
}

const OPTIONS: { value: ThemePreference; label: string; Icon: typeof SunIcon }[] = [
  { value: 'light', label: 'Light', Icon: SunIcon },
  { value: 'dark', label: 'Dark', Icon: MoonIcon },
  { value: 'system', label: 'System', Icon: MonitorIcon },
];

/** Light, dark, or follow the device setting. */
export const ThemeSwitch = ({
  value,
  onChange,
  label = 'Appearance',
  idPrefix = 'theme',
  compact = false,
}: ThemeSwitchProps) => (
  <div
    className={`lh-themeswitch${compact ? ' lh-themeswitch--compact' : ''}`}
    role="group"
    aria-label={label}
  >
    {OPTIONS.map(({ value: option, label: optionLabel, Icon }) => {
      const active = option === value;
      return (
        <button
          key={option}
          type="button"
          id={`${idPrefix}-${option}`}
          className={`lh-themeswitch__option${active ? ' lh-themeswitch__option--active' : ''}`}
          aria-pressed={active}
          onClick={() => onChange(option)}
        >
          <Icon size={16} />
          {compact ? <span className="lh-sr-only">{optionLabel}</span> : <span>{optionLabel}</span>}
        </button>
      );
    })}
  </div>
);
