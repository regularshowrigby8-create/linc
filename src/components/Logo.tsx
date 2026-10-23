interface LogoProps {
  /** Wordmark is replaceable — the brand mark is a placeholder. */
  showWordmark?: boolean;
  size?: 'sm' | 'md';
}

/** Six-dot cluster used as a replaceable brand placeholder. */
export const HiveMark = ({ size = 'md' }: { size?: 'sm' | 'md' }) => (
  <span className={`lh-mark lh-mark--${size}`} aria-hidden="true">
    <span className="lh-mark__dot lh-mark__dot--1" />
    <span className="lh-mark__dot lh-mark__dot--2" />
    <span className="lh-mark__dot lh-mark__dot--3" />
    <span className="lh-mark__dot lh-mark__dot--4" />
    <span className="lh-mark__dot lh-mark__dot--5" />
    <span className="lh-mark__dot lh-mark__dot--6" />
  </span>
);

export const Logo = ({ showWordmark = true, size = 'md' }: LogoProps) => (
  <span className={`lh-logo lh-logo--${size}`}>
    <HiveMark size={size} />
    {showWordmark ? <span className="lh-logo__word">LinkHive</span> : null}
  </span>
);
