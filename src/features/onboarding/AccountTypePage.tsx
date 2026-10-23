import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/Button';
import { CheckIcon } from '@/components/icons';
import { FunnelShell } from '@/features/onboarding/FunnelShell';
import type { AccountType } from '@/data/types';
import { useActions, useStore } from '@/state/store';
import { WORKSPACE_LABEL, workspaceForOnboarding } from '@/state/selectors';

interface Choice {
  type: AccountType;
  title: string;
  /** One sentence. This is the line that has to work on its own. */
  summary: string;
  /** The longer explanation, which is the point of the screen. */
  detail: string;
  gets: string[];
  /** The workspace this choice opens. */
  workspaceNote: string;
}

const BUSINESS: Choice = {
  type: 'business',
  title: 'A business account.',
  summary: 'You trade, you employ, or you have stock to move.',
  detail:
    'A business account is for a company, a partnership or a sole trader trading under a registered name. It can hold a business registration record, it can list more than one person against it, and it can carry a business name in front of every listing you publish. Business listings are reviewed before they appear, so a request that reaches a business is a request to a business.',
  gets: [
    'A business name on every listing you publish.',
    'More than one person can be added to the account.',
    'A business registration record, checked as a demo record in the prototype.',
    'A separate quote trail, with every cost on its own line.',
  ],
  workspaceNote: 'A business account that is looking to hire starts in Collaboration.',
};

const INDIVIDUAL: Choice = {
  type: 'personal',
  title: 'An individual account.',
  summary: 'You are a person, offering what you do or finding who can do it.',
  detail:
    'An individual account is for one person. It carries your name, your area and what you are prepared to take on. You can publish a listing for anything you offer, and you can also search the workspaces and send requests. Individual listings are not reviewed against a business record, because there is no business record to review, so the listing says who you are instead.',
  gets: [
    'Your name and your area on everything you publish.',
    'A profile you can arrange: your accent, your mark and your line.',
    'Badges earned from what you actually do, not claimed.',
    'The same request trail, so a conversation is never a dead end.',
  ],
  workspaceNote: 'An individual account that is looking to hire starts in Customer Service.',
};

const CHOICES = [BUSINESS, INDIVIDUAL];

/**
 * The animated visual for a choice.
 *
 * A business draws a network that comes alive, because a business is a set
 * of people and routes. An individual draws a mark that fills in, because an
 * individual is one person building a profile. Both are real SVG, both are
 * only transforms and strokes, and both settle to a still frame when the
 * reader has asked for reduced motion.
 */
const ChoiceVisual = ({ type }: { type: AccountType }) => (
  <svg
    className="lh-funnel__spark"
    viewBox="0 0 320 150"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    focusable="false"
  >
    {type === 'business' ? (
      <>
        <path className="lh-funnel__sparkline" d="M28 112 L92 62 L160 92 L226 38 L292 66" />
        {[
          [28, 112],
          [92, 62],
          [160, 92],
          [226, 38],
          [292, 66],
        ].map(([x, y], index) => (
          <g key={`${x}-${y}`}>
            <circle
              className="lh-funnel__sparkring"
              cx={x}
              cy={y}
              r="11"
              style={{ '--i': index } as React.CSSProperties}
            />
            <circle
              className="lh-funnel__sparknode"
              cx={x}
              cy={y}
              r="4.5"
              style={{ '--i': index } as React.CSSProperties}
            />
          </g>
        ))}
      </>
    ) : (
      <>
        <circle
          className="lh-funnel__sparkring"
          cx="62"
          cy="75"
          r="30"
          style={{ '--i': 0 } as React.CSSProperties}
        />
        <circle
          className="lh-funnel__sparknode"
          cx="62"
          cy="75"
          r="12"
          style={{ '--i': 0 } as React.CSSProperties}
        />
        {[0, 1, 2, 3, 4].map((index) => (
          <g key={index}>
            <circle
              className="lh-funnel__sparkring"
              cx={132 + index * 38}
              cy={index % 2 === 0 ? 58 : 92}
              r="13"
              style={{ '--i': index + 1 } as React.CSSProperties}
            />
            <circle
              className="lh-funnel__sparknode"
              cx={132 + index * 38}
              cy={index % 2 === 0 ? 58 : 92}
              r="6"
              style={{ '--i': index + 1 } as React.CSSProperties}
            />
          </g>
        ))}
        <path
          className="lh-funnel__sparkline"
          d="M84 75 L120 70 M146 62 L184 56 M208 60 L246 58 M270 60 L306 58"
        />
      </>
    )}
  </svg>
);

/**
 * The second question.
 *
 * Business or individual. It changes what the account can hold, so it is
 * worth more than a line on a form. Each side carries its own animated
 * visual, its own explanation and its own list of what the account gets.
 */
export const AccountTypePage = () => {
  const actions = useActions();
  const { state } = useStore();
  const navigate = useNavigate();
  const [chosen, setChosen] = useState<AccountType | null>(null);

  const intent = state.app.onboarding.intent;

  const pick = (type: AccountType) => {
    setChosen(type);
    // The account type decides which workspace the account opens into, so
    // it is worked out here rather than being asked a third time.
    actions.setOnboarding({
      accountType: type,
      workspace: intent ? workspaceForOnboarding(intent, type) : null,
    });
  };

  const confirm = () => {
    if (!chosen) return;
    navigate('/onboarding/account');
  };

  return (
    <FunnelShell step={2} steps={['You', 'Your account', 'Your name']}>
      <div className="lh-funnel__intro">
        <p className="lh-mkt__eyebrow">Second question</p>
        <h1 className="lh-mkt__display">Which kind of account are you?</h1>
        <p className="lh-mkt__body">
          This decides what the account can hold and what a listing can say. You can change it
          later, but it is quicker to answer now.
        </p>
      </div>

      <div className="lh-funnel__choices">
        {CHOICES.map((choice) => {
          const isChosen = chosen === choice.type;
          return (
            <section
              key={choice.type}
              className={`lh-funnel__choice${isChosen ? ' lh-funnel__choice--chosen' : ''}`}
              aria-labelledby={`account-${choice.type}`}
            >
              <div className="lh-funnel__choicevisual">
                <ChoiceVisual type={choice.type} />
              </div>
              <div className="lh-funnel__sidehead">
                <h2 className="lh-funnel__choicetitle" id={`account-${choice.type}`}>
                  {choice.title}
                </h2>
                <p className="lh-funnel__choicebody">
                  <strong>{choice.summary}</strong> {choice.detail}
                </p>
              </div>
              <ul className="lh-mkt__checks">
                {choice.gets.map((item) => (
                  <li className="lh-mkt__check" key={item}>
                    <span className="lh-mkt__checkmark" aria-hidden="true">
                      <CheckIcon size={15} />
                    </span>
                    <span className="lh-mkt__checkbody">
                      <span className="lh-mkt__checktext">{item}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className="lh-funnel__sidepick"
                onClick={() => pick(choice.type)}
                aria-pressed={isChosen}
              >
                <span className="lh-funnel__picklabel">
                  I am a {choice.type === 'business' ? 'business' : 'person'}
                </span>
                <span className="lh-funnel__choosemark" aria-hidden="true">
                  <CheckIcon size={15} />
                </span>
              </button>
            </section>
          );
        })}
      </div>

      {chosen && intent ? (
        <p className="lh-funnel__note">
          A {chosen === 'business' ? 'business' : 'personal'} account that is{' '}
          {intent === 'buy' ? 'looking to hire' : 'offering work'} opens in{' '}
          <strong>{WORKSPACE_LABEL[workspaceForOnboarding(intent, chosen)]}</strong>. You can change
          it on the next screen.
        </p>
      ) : null}

      <div className="lh-funnel__actions">
        <Button variant="ghost" onClick={() => navigate('/register')}>
          Back
        </Button>
        <Button variant="accent" onClick={confirm} disabled={!chosen}>
          Continue
        </Button>
      </div>
    </FunnelShell>
  );
};
