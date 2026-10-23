import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/Button';
import { Logo } from '@/components/Logo';
import { WORKSPACE_LABEL, WORKSPACE_PURPOSE } from '@/state/selectors';
import heroImage from '@/assets/hero.png';
import customerImage from '@/assets/workspace-customer.png';
import qualificationImage from '@/assets/workspace-qualification.png';
import collaborationImage from '@/assets/workspace-collaboration.png';
import supplyImage from '@/assets/workspace-supply.png';

const WORKSPACE_CARDS = [
  {
    id: 'customer',
    title: 'Customer Service',
    body: 'Find someone who provides an everyday service, or offer your own.',
    image: customerImage,
  },
  {
    id: 'qualification',
    title: 'Qualification / Jobs',
    body: 'Show what you are qualified to do, and find qualified people.',
    image: qualificationImage,
  },
  {
    id: 'collaboration',
    title: 'Collaboration',
    body: 'Form joint work, group projects and capacity arrangements.',
    image: collaborationImage,
  },
  {
    id: 'supply',
    title: 'Supply',
    body: 'Compare suppliers, routes and who is responsible for each part.',
    image: supplyImage,
  },
] as const;

const STEPS = [
  {
    title: 'Tell us what you need',
    body: 'Describe what you are looking for. Every request carries a written reason, so the right person understands straight away.',
  },
  {
    title: 'Get matched',
    body: 'Browse services, qualified people, partners and suppliers in one place, with the detail you need to compare them fairly.',
  },
  {
    title: 'Know where you stand',
    body: 'See what is verified, what is still pending and who is responsible for each part of the job before you commit.',
  },
] as const;

export const LandingPage = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState('English');
  const [notice, setNotice] = useState<string | null>(null);

  return (
    <div className="lh-landing">
      <header className="lh-landing__header">
        <Link to="/" aria-label="LinkHive home" className="lh-landing__brand">
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
                  setNotice('English is the only language available right now.');
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
          <div className="lh-landing__herotext">
            <span className="lh-eyebrow">South Africa first</span>
            <h1 className="lh-display">Find the right connection.</h1>
            <p className="lh-landing__lead">
              Services, qualified people, partnerships and supply — all in one place. Tell LinkHive
              what you need, and get matched with people who can do it.
            </p>
            <div className="lh-row lh-landing__ctas">
              <Button onClick={() => navigate('/register')}>Create a free account</Button>
              <Button variant="secondary" onClick={() => navigate('/onboarding/workspaces')}>
                Explore the workspaces
              </Button>
            </div>
            <p className="lh-caption">Payments are not available in this prototype.</p>
          </div>
          <div className="lh-landing__herotile">
            <img src={heroImage} alt="" className="lh-landing__heroimage" />
          </div>
        </section>

        <section className="lh-landing__steps" id="how-it-works" aria-label="How LinkHive works">
          {STEPS.map((step, index) => (
            <article key={step.title} className="lh-step">
              <span className="lh-step__number">{index + 1}</span>
              <h2 className="lh-h3">{step.title}</h2>
              <p className="lh-muted">{step.body}</p>
            </article>
          ))}
        </section>

        <section className="lh-landing__workspaces" aria-label="LinkHive workspaces">
          <div className="lh-landing__sectionhead">
            <h2 className="lh-h2">Four ways to use LinkHive</h2>
            <p className="lh-muted">
              Each workspace is separate, so you only see what is relevant to you.
            </p>
          </div>
          <div className="lh-landing__workspacegrid">
            {WORKSPACE_CARDS.map((card) => (
              <article key={card.id} className="lh-workspacetile">
                <img src={card.image} alt="" className="lh-workspacetile__image" />
                <div className="lh-workspacetile__body">
                  <h3 className="lh-h3">{card.title}</h3>
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
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="lh-landing__footer">
        <div className="lh-landing__footerlinks">
          <Logo />
          <nav className="lh-landing__footer-links" aria-label="Footer">
            <button type="button" className="lh-linkbutton" onClick={() => navigate('/register')}>
              Create an account
            </button>
            <button
              type="button"
              className="lh-linkbutton"
              onClick={() => setNotice('Community rules are not available yet.')}
            >
              Community rules
            </button>
            <button
              type="button"
              className="lh-linkbutton"
              onClick={() => setNotice('Terms are not available yet.')}
            >
              Terms
            </button>
            <button
              type="button"
              className="lh-linkbutton"
              onClick={() => setNotice('Privacy information is not available yet.')}
            >
              Privacy
            </button>
          </nav>
        </div>
        <p className="lh-caption">
          LinkHive does not hold money, convert currency or collect identity documents.
        </p>
      </footer>
    </div>
  );
};
