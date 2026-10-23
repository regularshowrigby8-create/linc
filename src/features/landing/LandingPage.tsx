import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/Button';
import { Logo } from '@/components/Logo';
import { WORKSPACE_LABEL, WORKSPACE_PURPOSE } from '@/state/selectors';

const WORKSPACE_CARDS = [
  {
    id: 'customer',
    title: 'Customer Service',
    body: 'Find someone who provides an everyday service, or offer your own.',
  },
  {
    id: 'qualification',
    title: 'Qualification / Jobs',
    body: 'Show what you are qualified to do, and find qualified people.',
  },
  {
    id: 'collaboration',
    title: 'Collaboration',
    body: 'Form joint work, group projects and capacity arrangements.',
  },
  {
    id: 'supply',
    title: 'Supply',
    body: 'Compare suppliers, routes and who is responsible for each part.',
  },
] as const;

export const LandingPage = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState('English');
  const [notice, setNotice] = useState<string | null>(null);

  return (
    <div className="lh-landing">
      <header className="lh-landing__header">
        <Link to="/" aria-label="LinkHive home">
          <Logo />
        </Link>
        <nav className="lh-landing__nav" aria-label="Account">
          <label className="lh-landing__language">
            <span className="lh-sr-only">Language</span>
            <select
              className="lh-input lh-select"
              value={language}
              onChange={(event) => {
                setLanguage(event.target.value);
                if (event.target.value !== 'English') {
                  setNotice('Only English is available in this prototype.');
                } else {
                  setNotice(null);
                }
              }}
            >
              <option value="English">English</option>
              <option value="Afrikaans">Afrikaans</option>
              <option value="isiZulu">isiZulu</option>
            </select>
          </label>
          <Button variant="secondary" onClick={() => navigate('/register')}>
            Sign in
          </Button>
          <Button onClick={() => navigate('/register')}>Create account</Button>
        </nav>
      </header>

      {notice ? (
        <p className="lh-notice lh-notice--info lh-landing__notice" role="status">
          {notice}
        </p>
      ) : null}

      <main className="lh-landing__main">
        <section className="lh-landing__hero">
          <span className="lh-label">South Africa first · Global reach planned</span>
          <h1 className="lh-h1">Find the right connection.</h1>
          <p className="lh-landing__lead">
            LinkHive connects people and businesses that need something with people and businesses
            that can provide it — across services, qualified people, collaboration and supply.
          </p>
          <div className="lh-row">
            <Button onClick={() => navigate('/register')}>Create a free account</Button>
            <Button variant="secondary" onClick={() => navigate('/onboarding/workspaces')}>
              See the workspaces
            </Button>
          </div>
          <p className="lh-caption">
            Prototype only. Payments, wallets and international settlement are not available yet.
          </p>
        </section>

        <section className="lh-landing__workspaces" aria-label="LinkHive workspaces">
          {WORKSPACE_CARDS.map((card) => (
            <article key={card.id} className="lh-landing__card">
              <h2 className="lh-h3">{card.title}</h2>
              <p className="lh-muted">{card.body}</p>
              <p className="lh-caption">{WORKSPACE_PURPOSE[card.id]}</p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate('/register')}
                aria-label={`Register to use ${WORKSPACE_LABEL[card.id]}`}
              >
                Use {card.title}
              </Button>
            </article>
          ))}
        </section>

        <section className="lh-landing__principles">
          <h2 className="lh-h2">What this prototype does and does not do</h2>
          <div className="lh-grid-cards">
            <article className="lh-landing__card">
              <h3 className="lh-h3">It does</h3>
              <ul className="lh-stack-sm lh-muted">
                <li>Connect requests with a written reason.</li>
                <li>Show exactly what was verified, and what is still pending.</li>
                <li>Compare suppliers and say who is responsible for each route.</li>
              </ul>
            </article>
            <article className="lh-landing__card">
              <h3 className="lh-h3">It does not</h3>
              <ul className="lh-stack-sm lh-muted">
                <li>Take payments or hold a wallet balance.</li>
                <li>Convert currencies or promise an exchange rate.</li>
                <li>Collect real identity documents.</li>
              </ul>
            </article>
          </div>
        </section>
      </main>

      <footer className="lh-landing__footer">
        <div className="lh-landing__footer-links">
          <button type="button" className="lh-linkbutton" onClick={() => navigate('/register')}>
            Create an account
          </button>
          <button
            type="button"
            className="lh-linkbutton"
            onClick={() => setNotice('Community rules are not available in this prototype.')}
          >
            Community rules
          </button>
          <button
            type="button"
            className="lh-linkbutton"
            onClick={() => setNotice('Terms are not available in this prototype.')}
          >
            Terms
          </button>
          <button
            type="button"
            className="lh-linkbutton"
            onClick={() => setNotice('Privacy information is not available in this prototype.')}
          >
            Privacy
          </button>
        </div>
        <p className="lh-caption">
          LinkHive prototype. Built from docs/linkhive-build-spec. No real payments, documents or
          live legal claims.
        </p>
      </footer>
    </div>
  );
};
