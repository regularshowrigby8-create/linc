import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/Button';
import { CheckIcon, GlobeIcon, StarIcon } from '@/components/icons';
import { FunnelShell } from '@/features/onboarding/FunnelShell';
import type { Intent } from '@/data/types';
import { useActions } from '@/state/store';

interface Side {
  intent: Intent;
  title: string;
  subtitle: string;
  /** The services on this side of the spectrum. */
  cards: { label: string; detail: string }[];
  cta: string;
}

const SIDES: Side[] = [
  {
    intent: 'buy',
    title: 'I need something done.',
    subtitle:
      'You are looking for a person or a business who can do a piece of work for you, and you want the price and the area written down before you talk to anyone.',
    cards: [
      { label: 'Everyday services', detail: 'Cleaning, repairs, transport, catering.' },
      { label: 'A qualified professional', detail: 'Someone with a qualification you can check.' },
      { label: 'A partner', detail: 'Another business to build something with.' },
      { label: 'Suppliers and delivery', detail: 'Goods, routes and who carries what.' },
    ],
    cta: 'I am looking to hire',
  },
  {
    intent: 'sell',
    title: 'I have something to offer.',
    subtitle:
      'You can do the work, you hold the qualification, or you have the goods. You want the people who need exactly that to find you.',
    cards: [
      { label: 'My services', detail: 'A skill you offer to people near you.' },
      { label: 'My qualification', detail: 'A certificate, licence or trade you hold.' },
      { label: 'My capacity', detail: 'Time, equipment or people you can commit.' },
      { label: 'My stock', detail: 'Goods you supply, with a route you know.' },
    ],
    cta: 'I am offering my work',
  },
];

/**
 * The first question.
 *
 * Two halves of the same spectrum, each with its own argument and its own
 * list of services. Choosing one brings it forward and lets the other
 * recede, so the choice reads as a decision rather than a tab.
 */
export const IntentPage = () => {
  const actions = useActions();
  const navigate = useNavigate();
  const [chosen, setChosen] = useState<Intent | null>(null);

  const pick = (intent: Intent) => {
    setChosen(intent);
    actions.setOnboarding({ intent });
  };

  const continueOn = () => {
    if (!chosen) return;
    navigate('/onboarding/account-type');
  };

  return (
    <FunnelShell step={1} steps={['You', 'Your account', 'Your name']}>
      <div className="lh-funnel__intro">
        <p className="lh-mkt__eyebrow">First question</p>
        <h1 className="lh-mkt__display">What brings you here?</h1>
        <p className="lh-mkt__body">
          LinkHive works both ways round. Pick the side of the spectrum you are on and the rest of
          the flow follows from it.
        </p>
      </div>

      <div className="lh-funnel__sides">
        {SIDES.map((side) => {
          const isChosen = chosen === side.intent;
          const isFaded = chosen !== null && !isChosen;
          return (
            <section
              key={side.intent}
              className={`lh-funnel__side${isChosen ? ' lh-funnel__side--chosen' : ''}${
                isFaded ? ' lh-funnel__side--faded' : ''
              }`}
              aria-labelledby={`intent-${side.intent}`}
            >
              <div className="lh-funnel__sidehead">
                <h2 className="lh-funnel__sidetitle" id={`intent-${side.intent}`}>
                  {side.title}
                </h2>
                <p className="lh-funnel__sidesub">{side.subtitle}</p>
              </div>

              <div className="lh-funnel__cards">
                {side.cards.map((card) => (
                  <div className="lh-funnel__card" key={card.label}>
                    <span className="lh-funnel__cardicon">
                      {side.intent === 'buy' ? <StarIcon size={15} /> : <GlobeIcon size={15} />}
                    </span>
                    <span>
                      <strong>{card.label}</strong>
                      <br />
                      <span className="lh-mkt__fineprint">{card.detail}</span>
                    </span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="lh-funnel__sidepick"
                onClick={() => pick(side.intent)}
                aria-pressed={isChosen}
              >
                <span className="lh-funnel__picklabel">{side.cta}</span>
                <span className="lh-funnel__choosemark" aria-hidden="true">
                  <CheckIcon size={15} />
                </span>
              </button>
            </section>
          );
        })}
      </div>

      <div className="lh-funnel__actions">
        <Button variant="accent" onClick={continueOn} disabled={!chosen}>
          Continue
        </Button>
      </div>
    </FunnelShell>
  );
};
