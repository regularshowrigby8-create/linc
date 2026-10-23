import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/Button';
import { HiveMark } from '@/components/Logo';
import { ThemeSwitch } from '@/components/ThemeSwitch';
import { useActions, useStore } from '@/state/store';

interface MarketingHeaderProps {
  /** Links into the page, as anchors on the landing page. */
  links?: { href: string; label: string }[];
}

/**
 * The navigation on the marketing pages.
 *
 * There is exactly one call to action here. Everything else is a link into
 * the page, a setting, or the wordmark. A page that asks for one decision
 * should not also ask for three.
 */
export const MarketingHeader = ({ links = [] }: MarketingHeaderProps) => {
  const { state } = useStore();
  const actions = useActions();
  const navigate = useNavigate();
  const preference = state.app.preferences.theme;

  return (
    <header className="lh-mkt__nav">
      <Link className="lh-mkt__brand" to="/" aria-label="LinkHive home">
        <HiveMark />
        <span className="lh-mkt__brandname">LinkHive</span>
      </Link>

      {links.length > 0 ? (
        <nav className="lh-mkt__navlinks" aria-label="Sections of this page">
          {links.map((link) => (
            <a key={link.href} className="lh-mkt__navlink" href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
      ) : null}

      <div className="lh-mkt__navend">
        <ThemeSwitch
          value={preference}
          onChange={(value) => void actions.setTheme(value)}
          label="Colour mode"
          idPrefix="marketing-theme"
          compact
        />
        <Button variant="accent" onClick={() => navigate('/register')}>
          Get started
        </Button>
      </div>
    </header>
  );
};
