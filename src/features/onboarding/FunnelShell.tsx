import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { HiveMark } from '@/components/Logo';
import { MarketingBackdrop } from '@/features/landing/MarketingBackdrop';

interface FunnelShellProps {
  /** Which step of the flow this is, counted from one. */
  step: number;
  /** The names of the steps, so the indicator can label them. */
  steps: string[];
  children: ReactNode;
}

/**
 * The frame around every onboarding screen.
 *
 * It is quieter than the landing page on purpose. The person reading it has
 * already decided to start, so the page has one job: answer the question
 * on it and move on.
 */
export const FunnelShell = ({ step, steps, children }: FunnelShellProps) => (
  <div className="lh-funnel">
    <MarketingBackdrop />
    <header className="lh-funnel__header">
      <Link className="lh-mkt__brand" to="/" aria-label="LinkHive home">
        <HiveMark />
        <span className="lh-mkt__brandname">LinkHive</span>
      </Link>
      <div className="lh-funnel__progress" role="group" aria-label="Progress">
        {steps.map((label, index) => {
          const position = index + 1;
          const state = position < step ? 'done' : position === step ? 'current' : 'todo';
          return (
            <span
              key={label}
              className={`lh-funnel__step lh-funnel__step--${state}`}
              aria-current={position === step ? 'step' : undefined}
            >
              <span className="lh-funnel__stepdot" />
              <span className="lh-funnel__stepname">{label}</span>
            </span>
          );
        })}
      </div>
    </header>
    <main className="lh-funnel__main">{children}</main>
  </div>
);
