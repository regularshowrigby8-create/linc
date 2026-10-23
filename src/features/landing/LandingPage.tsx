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
import { ProductTour } from '@/features/landing/ProductTour';
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

/**
 * The three promises the prototype refuses to break.
 *
 * These are the exact words the product uses when it has to admit that
 * something is not built yet. Putting them on the front page, in the
 * places a buyer would look for the catch, is the whole point of the
 * section. A marketplace that takes money it cannot settle is worth less
 * than one that says so plainly.
 */
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

  /* Every number on this page is counted from the data that is actually
     here. Nothing is invented, and nothing is projected. */
  const figures = useMemo(() => {
    const perWorkspace = WORKSPACE_ORDER.map((workspace) => ({
      workspace,
      count: listings.filter((listing) => listing.workspace === workspace).length,
    }));
    const cities = new Set(
      listings.map((listing) => listing.location.split(',')[0]?.trim()).filter(Boolean),
    );
    return {
      perWorkspace,
      listingCount: listings.length,
      cityCount: cities.size,
    };
  }, [listings]);

  const largest = Math.max(...figures.perWorkspace.map((item) => item.count), 1);

  return (
    <div className="lh-mkt">
      <MarketingBackdrop />
      <MarketingHeader links={NAV_LINKS} />

      <main className="lh-mkt__main">
        {/* ---- Hero ------------------------------------------------- */}
        <section className="lh-mkt__hero">
          <div className="lh-mkt__herotext">
            <p className="lh-mkt__eyebrow">South Africa first</p>
            <h1 className="lh-mkt__mega">Find the right connection.</h1>
            <p className="lh-mkt__lead">
              Services, qualified people, partnerships and supply. Tell LinkHive what you need, and
              get matched with people who can do it.
            </p>
            <div className="lh-mkt__ctas">
              <Button variant="accent" size="md" onClick={() => navigate('/register')}>
                Get started
              </Button>
            </div>
            <p className="lh-mkt__fineprint">
              Payments are not available in this prototype. Nothing here is transactable.
            </p>
          </div>

          <div className="lh-mkt__heroviz">
            <div className="lh-mkt__panel lh-mkt__panel--glow">
              <div className="lh-mkt__panelbody">
                <div className="lh-mkt__paneltop">
                  <h2 className="lh-mkt__paneltitle">Listings in the prototype</h2>
                  <span className="lh-mkt__pulse">Live</span>
                </div>
                <p className="lh-mkt__livefigure">{figures.listingCount}</p>
                <div className="lh-mkt__live">
                  {figures.perWorkspace.map((item, index) => (
                    <div className="lh-mkt__liverow" key={item.workspace}>
                      <span className="lh-mkt__livekey">{WORKSPACE_LABEL[item.workspace]}</span>
                      <span className="lh-mkt__livebar">
                        <span
                          style={
                            {
                              '--w': `${Math.round((item.count / largest) * 100)}%`,
                              '--i': index,
                            } as React.CSSProperties
                          }
                        />
                      </span>
                      <span className="lh-mkt__livevalue">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---- Ticker ------------------------------------------------ */}
        <div className="lh-mkt__ticker">
          <span className="lh-mkt__tickeritem">South Africa first</span>
          <span className="lh-mkt__tickeritem">Four separate workspaces</span>
          <span className="lh-mkt__tickeritem">Every request carries a written reason</span>
          <span className="lh-mkt__tickeritem">Nothing is settled for you</span>
        </div>

        {/* ---- Figures ----------------------------------------------- */}
        <section className="lh-mkt__section lh-mkt__section--tight">
          <Reveal>
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
          </Reveal>
        </section>

        {/* ---- How it works ------------------------------------------ */}
        <section className="lh-mkt__section" id="how">
          <Reveal>
            <div className="lh-mkt__splithead">
              <div className="lh-mkt__sectionhead">
                <p className="lh-mkt__eyebrow">How it works</p>
                <h2 className="lh-mkt__display">One place, every kind of work.</h2>
              </div>
              <p className="lh-mkt__body">
                The preview below is not a picture of the product. It runs on the same data the app
                runs on, so the listings, the prices and the verification labels are the real ones.
                Switch workspaces and the whole thing changes.
              </p>
            </div>
          </Reveal>

          <Reveal step={2}>
            <div className="lh-mkt__tourframe">
              <ProductTour />
            </div>
          </Reveal>
        </section>

        {/* ---- Workspaces -------------------------------------------- */}
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

        {/* ---- Honesty ------------------------------------------------ */}
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
                      <GlobeIcon size={20} />
                    ) : index === 1 ? (
                      <ShieldIcon size={20} />
                    ) : (
                      <CheckIcon size={20} />
                    )}
                  </span>
                  <h3 className="lh-mkt__cardtitle">{item.title}</h3>
                  <p className="lh-mkt__cardbody">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ---- Final call -------------------------------------------- */}
        <section className="lh-mkt__section">
          <Reveal>
            <div className="lh-mkt__final">
              <div className="lh-mkt__finalglow" />
              <div className="lh-mkt__finalbody">
                <h2 className="lh-mkt__display">Tell us what you need.</h2>
                <p className="lh-mkt__lead">
                  Two questions, then your name. You will be inside a workspace before the page
                  finishes loading.
                </p>
                <Button variant="accent" onClick={() => navigate('/register')}>
                  Get started
                </Button>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      {/* ---- Footer --------------------------------------------------- */}
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
