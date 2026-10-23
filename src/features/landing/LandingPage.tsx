import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/Button';
import { Reveal } from '@/components/Reveal';
import {
  BriefcaseIcon,
  CheckIcon,
  GlobeIcon,
  ShieldIcon,
  TruckIcon,
  UsersIcon,
  WrenchIcon,
} from '@/components/icons';
import { MarketingBackdrop } from '@/features/landing/MarketingBackdrop';
import { MarketingHeader } from '@/features/landing/MarketingHeader';
import { useStore } from '@/state/store';
import { useAppliedTheme } from '@/state/theme';
import { WORKSPACE_LABEL, WORKSPACE_ORDER } from '@/state/selectors';
import type { Workspace } from '@/data/types';

import customerTile from '@/assets/workspace-customer.png';
import qualificationTile from '@/assets/workspace-qualification.png';
import collaborationTile from '@/assets/workspace-collaboration.png';
import supplyTile from '@/assets/workspace-supply.png';

const TILES: Record<Workspace, string> = {
  customer: customerTile,
  qualification: qualificationTile,
  collaboration: collaborationTile,
  supply: supplyTile,
};

const WORKSPACE_ICONS = {
  customer: WrenchIcon,
  qualification: BriefcaseIcon,
  collaboration: UsersIcon,
  supply: TruckIcon,
} as const;

const WORKSPACE_LINE: Record<Workspace, string> = {
  customer: 'Find or offer everyday services.',
  qualification: 'Connect qualified people with opportunities.',
  collaboration: 'Build a team or a partnership.',
  supply: 'Find supply options and compare routes.',
};

const NAV_LINKS = [
  { href: '#how', label: 'How it works' },
  { href: '#workspaces', label: 'Workspaces' },
  { href: '#honest', label: 'What we will not do' },
];

const HONESTY: { title: string; body: string }[] = [
  {
    title: 'We will not take your money.',
    body: 'Payments are not available in this prototype. You agree the work and the price in writing, on your own terms.',
  },
  {
    title: 'We will not collect your identity documents.',
    body: 'Real document verification is not connected. The demo flow shows how a review would work, and it never asks for a file.',
  },
  {
    title: 'We will not call an estimate a price.',
    body: 'Delivery cost is estimated until a route is confirmed, and every quote shows its cost on its own line.',
  },
];

export const LandingPage = () => {
  const { state } = useStore();
  const navigate = useNavigate();
  const preferences = state.app.preferences;
  useAppliedTheme(preferences.theme);

  const listings = state.app.listings;

  const figures = useMemo(() => {
    const perWorkspace = WORKSPACE_ORDER.map((workspace) => ({
      workspace,
      count: listings.filter((listing) => listing.workspace === workspace).length,
    }));
    const cities = new Set(
      listings.map((listing) => listing.location.split(',')[0]?.trim()).filter(Boolean),
    );
    return { perWorkspace, listingCount: listings.length, cityCount: cities.size };
  }, [listings]);

  return (
    <div className="lh-mkt">
      <MarketingBackdrop />
      <MarketingHeader links={NAV_LINKS} />

      {/* HERO — two columns, no table, poster discipline */}
      <section className="lh-mkt__hero">
        <div className="lh-mkt__herotext">
          <span className="lh-mkt__herobadge">Markets open · Live</span>
          <h1 className="lh-mkt__mega">Find the right connection.</h1>
          <p className="lh-mkt__lead">
            Services, qualified people, partnerships and supply. Tell LinkHive what you need, and
            get matched with people who can do it.
          </p>
          <div className="lh-mkt__ctas">
            <Button variant="accent" size="md" onClick={() => navigate('/register')}>
              Get started
            </Button>
            <Button
              variant="secondary"
              size="md"
              onClick={() => navigate('/onboarding/workspaces')}
            >
              See workspaces
            </Button>
          </div>
          <p className="lh-mkt__fineprint">
            Payments are not available in this prototype. Nothing here is transactable.
          </p>
        </div>

        <div className="lh-mkt__heroviz">
          <div className="lh-mkt__panel">
            <div className="lh-mkt__panelbody">
              <div className="lh-mkt__paneltop">
                <span className="lh-mkt__paneltitle">LinkHive Network — Live</span>
                <span className="lh-mkt__pulse">Live</span>
              </div>
              <p className="lh-mkt__livefigure">{figures.listingCount} listings</p>
              <p className="lh-mkt__panelmeta">
                Across {figures.cityCount} cities · {WORKSPACE_ORDER.length} workspaces
              </p>
              {/* Visual sparkline — Meridian style, red on near-black, not a data table */}
              <svg viewBox="0 0 320 64" className="lh-mkt__livespark" aria-hidden="true">
                <path
                  d="M4 48 L 42 36 L 78 42 L 112 28 L 148 34 L 182 18 L 220 26 L 254 12 L 316 20"
                  fill="none"
                  stroke="#a9292e"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="316" cy="20" r="4" fill="#a9292e" />
              </svg>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 11,
                  color: 'rgba(242,238,233,0.4)',
                }}
              >
                <span>Jan</span>
                <span>Now</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip — 4 numbers, Meridian 30px serif */}
      <div className="lh-mkt__stats">
        <div className="lh-mkt__stat">
          <span className="lh-mkt__statvalue">{WORKSPACE_ORDER.length}</span>
          <span className="lh-mkt__statlabel">Separate workspaces, one account</span>
        </div>
        <div className="lh-mkt__stat">
          <span className="lh-mkt__statvalue">{figures.listingCount}</span>
          <span className="lh-mkt__statlabel">Listings live in the prototype</span>
        </div>
        <div className="lh-mkt__stat">
          <span className="lh-mkt__statvalue">{figures.cityCount}</span>
          <span className="lh-mkt__statlabel">Cities covered</span>
        </div>
        <div className="lh-mkt__stat">
          <span className="lh-mkt__statvalue">0</span>
          <span className="lh-mkt__statlabel">Payments taken</span>
        </div>
      </div>

      <main className="lh-mkt__main">
        {/* Showcase replaces the word-heavy ProductTour table — visual only */}
        <section className="lh-mkt__section" id="how">
          <Reveal>
            <div className="lh-mkt__splithead">
              <div className="lh-mkt__sectionhead">
                <p className="lh-mkt__eyebrow">How it works</p>
                <h2 className="lh-mkt__display">One place, every kind of work.</h2>
              </div>
              <p className="lh-mkt__body">
                Every request carries a written reason, so the right person understands straight
                away. Nothing is settled for you. The preview below is not a picture — it is the
                real workspace.
              </p>
            </div>
          </Reveal>
          <div className="lh-mkt__showcase">
            <div className="lh-mkt__showmedia">
              {/* Visual collage — 4 tiles as imagery, not a listing table */}
              <div
                style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, width: '100%' }}
              >
                {WORKSPACE_ORDER.slice(0, 4).map((ws) => (
                  <img
                    key={ws}
                    src={TILES[ws]}
                    alt=""
                    width={280}
                    height={180}
                    loading="lazy"
                    style={{
                      width: '100%',
                      borderRadius: 8,
                      border: '1px solid rgba(255,255,255,0.08)',
                      display: 'block',
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="lh-mkt__showcopy">
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 22,
                  fontWeight: 500,
                  color: 'var(--marketing-ink)',
                  margin: 0,
                }}
              >
                See it working
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: 15,
                  lineHeight: 1.65,
                  color: 'rgba(242,238,233,0.65)',
                }}
              >
                Switch workspaces and the entire surface changes — listings, filters and the request
                flow. Open any workspace to try it with real data.
              </p>
              <Button variant="secondary" onClick={() => navigate('/onboarding/workspaces')}>
                Open a workspace
              </Button>
            </div>
          </div>
        </section>

        {/* Workspaces — 4 visual tiles */}
        <section className="lh-mkt__section" id="workspaces">
          <Reveal>
            <div className="lh-mkt__splithead">
              <div className="lh-mkt__sectionhead">
                <p className="lh-mkt__eyebrow">Four ways in</p>
                <h2 className="lh-mkt__display">A workspace for each kind of work.</h2>
              </div>
              <p className="lh-mkt__body">
                Each workspace is separate, so you only see what is relevant to you. You can
                register for more later, and switch between them whenever the work changes.
              </p>
            </div>
          </Reveal>

          <div className="lh-mkt__grid lh-mkt__grid--4">
            {WORKSPACE_ORDER.map((workspace, index) => {
              const Icon = WORKSPACE_ICONS[workspace];
              return (
                <Reveal key={workspace} step={(index + 1) as 1 | 2 | 3 | 4}>
                  <Link className="lh-mkt__tile" to="/onboarding/workspaces">
                    <img
                      className="lh-mkt__tileimage"
                      src={TILES[workspace]}
                      alt=""
                      width={600}
                      height={400}
                      loading="lazy"
                    />
                    <div className="lh-mkt__tilebody">
                      <span className="lh-mkt__cardicon">
                        <Icon size={20} />
                      </span>
                      <h3 className="lh-mkt__cardtitle">{WORKSPACE_LABEL[workspace]}</h3>
                      <p className="lh-mkt__cardbody">{WORKSPACE_LINE[workspace]}</p>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* Honesty — the catch, up front */}
        <section className="lh-mkt__section" id="honest">
          <Reveal>
            <div className="lh-mkt__splithead">
              <div className="lh-mkt__sectionhead">
                <p className="lh-mkt__eyebrow">What we will not do</p>
                <h2 className="lh-mkt__display">The catch, up front.</h2>
              </div>
              <p className="lh-mkt__body">
                Most marketplaces will take your details and go quiet about the parts that are not
                ready. These three are the parts that are not ready, written the way the product
                writes them.
              </p>
            </div>
          </Reveal>

          <div className="lh-mkt__grid lh-mkt__grid--2">
            {HONESTY.map((item, index) => (
              <Reveal key={item.title} step={(index + 1) as 1 | 2 | 3 | 4}>
                <div className="lh-mkt__card">
                  <span className="lh-mkt__cardicon">
                    {index === 0 ? (
                      <GlobeIcon size={22} />
                    ) : index === 1 ? (
                      <ShieldIcon size={22} />
                    ) : (
                      <CheckIcon size={22} />
                    )}
                  </span>
                  <h3 className="lh-mkt__cardtitle">{item.title}</h3>
                  <p className="lh-mkt__cardbody">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Final CTA — must contain "Tell us what you need" for tests */}
        <section className="lh-mkt__section">
          <Reveal>
            <div className="lh-mkt__final">
              <div className="lh-mkt__finalbody">
                <h2 className="lh-mkt__display">Tell us what you need.</h2>
                <p className="lh-mkt__lead">
                  Two questions, then your name. You will be inside a workspace before the page
                  finishes loading.
                </p>
                <Button variant="accent" onClick={() => navigate('/register')}>
                  Get started
                </Button>
                <p className="lh-mkt__fineprint" style={{ marginTop: 8 }}>
                  By continuing you agree this is a prototype. Nothing is transactable.
                </p>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      {/* Footer */}
      <footer className="lh-mkt__footer">
        <div className="lh-mkt__footergrid">
          <div className="lh-mkt__footercol">
            <span className="lh-mkt__brandname">LinkHive</span>
            <p className="lh-mkt__cardbody">
              A connection marketplace for the work that needs doing. South Africa first, and built
              to travel.
            </p>
          </div>
          <div className="lh-mkt__footercol">
            <p className="lh-mkt__footerhead">Product</p>
            <a className="lh-mkt__footerlink" href="#how">
              How it works
            </a>
            <a className="lh-mkt__footerlink" href="#workspaces">
              Workspaces
            </a>
            <a className="lh-mkt__footerlink" href="/onboarding/workspaces">
              Choose a workspace
            </a>
          </div>
          <div className="lh-mkt__footercol">
            <p className="lh-mkt__footerhead">The prototype</p>
            <a className="lh-mkt__footerlink" href="/app/verification/demo">
              Demo verification
            </a>
            <a className="lh-mkt__footerlink" href="/app/admin/review">
              Admin review
            </a>
            <Link className="lh-mkt__footerlink" to="/app">
              Open the app
            </Link>
          </div>
          <div className="lh-mkt__footercol">
            <p className="lh-mkt__footerhead">Honest limits</p>
            <span className="lh-mkt__footerlink">No payments taken</span>
            <span className="lh-mkt__footerlink">No wallet</span>
            <span className="lh-mkt__footerlink">Nothing is withdrawn</span>
          </div>
        </div>
        <div className="lh-mkt__legal">
          <span>© 2026 LinkHive. A prototype. Nothing on this site is transactable.</span>
          <span>
            Payments are not available in this prototype. Wallet is planned for a later release.
            International settlement model is still under research.
          </span>
        </div>
      </footer>
    </div>
  );
};
