export interface StepperStep {
  id: string;
  label: string;
  state: 'complete' | 'current' | 'upcoming';
}

interface ProgressStepperProps {
  steps: StepperStep[];
  ariaLabel: string;
}

export const ProgressStepper = ({ steps, ariaLabel }: ProgressStepperProps) => (
  <ol className="lh-stepper" aria-label={ariaLabel}>
    {steps.map((step, index) => (
      <li
        key={step.id}
        className={`lh-stepper__step lh-stepper__step--${step.state}`}
        aria-current={step.state === 'current' ? 'step' : undefined}
      >
        <span className="lh-stepper__marker" aria-hidden="true">
          {step.state === 'complete' ? '✓' : index + 1}
        </span>
        <span className="lh-stepper__label">{step.label}</span>
      </li>
    ))}
  </ol>
);
