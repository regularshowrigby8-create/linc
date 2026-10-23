import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/Button';
import { TextInput } from '@/components/Form';
import { CheckIcon } from '@/components/icons';
import { FunnelShell } from '@/features/onboarding/FunnelShell';
import type { AccountType, Workspace } from '@/data/types';
import { useActions, useStore } from '@/state/store';
import {
  WORKSPACE_LABEL,
  WORKSPACE_PURPOSE,
  selectListingsForWorkspace,
  workspaceForOnboarding,
} from '@/state/selectors';
import {
  validateBusinessName,
  validateEmail,
  validateName,
  validatePassword,
} from '@/utils/validation';

const READ_BLOCKS = [
  {
    heading: 'What this account is',
    body: 'A LinkHive account is one identity that can hold several workspaces, but only one at a time. You are inside a single workspace, and the rail on the left is how you move between the ones you have registered for. Nothing you do in one workspace leaks into another.',
  },
  {
    heading: 'What you can do in it',
    body: 'Search what is listed, save what you like, and send a request. A request is not a message and it is not an order. It carries a written reason, and the person receiving it can see exactly what you want, where, by when and roughly what budget you have in mind before they answer.',
  },
  {
    heading: 'What you get that you do not get elsewhere',
    body: 'Every listing shows the price or says the price is still to be quoted, and the area it covers. Every quote shows its cost on its own line, so you can see what you are paying for. Every estimate is labelled as an estimate. Your own profile carries badges that unlock from what you actually did, so they cannot be claimed.',
  },
  {
    heading: 'What it does not do',
    body: 'No money changes hands here, because payments are not available in this prototype. No identity documents are collected, because real document verification is not connected. There is no wallet, and no money moves between countries, because the international settlement model is still under research. Agree the work and the price in writing, on your own terms.',
  },
];

/**
 * The third screen.
 *
 * A long read that explains what the account is, what it does and what it
 * deliberately does not do, and then asks for a name. The read is set at a
 * measure that can be read comfortably, with a generous leading, because a
 * page of legal weight that nobody finishes is worse than no page at all.
 *
 * After the account is created, the page becomes the demo: it shows the
 * account that was just made, and the real listings waiting inside it.
 */
export const AccountReadPage = () => {
  const actions = useActions();
  const { state } = useStore();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [created, setCreated] = useState(false);

  const onboarding = state.app.onboarding;
  const intent = onboarding.intent;
  const accountType: AccountType = onboarding.accountType ?? 'personal';
  const workspace: Workspace | null =
    onboarding.workspace ?? (intent ? workspaceForOnboarding(intent, accountType) : null);

  const listings = useMemo(
    () => (workspace ? selectListingsForWorkspace(state, workspace) : []),
    [state, workspace],
  );

  const busy = actions.isPending('register');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};

    const nameResult = validateName(name);
    if (!nameResult.ok) nextErrors.name = nameResult.error ?? 'Enter your name.';
    const emailResult = validateEmail(email);
    if (!emailResult.ok) nextErrors.email = emailResult.error ?? 'Enter a valid email address.';
    const passwordResult = validatePassword(password);
    if (!passwordResult.ok) {
      nextErrors.password = passwordResult.error ?? 'Use at least 8 characters.';
    }
    if (accountType === 'business') {
      const businessResult = validateBusinessName(businessName);
      if (!businessResult.ok) {
        nextErrors.businessName = businessResult.error ?? 'Enter the business name.';
      }
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const result = await actions.registerAccount({
      name,
      email,
      password,
      accountType,
      businessName: accountType === 'business' ? businessName : undefined,
    });
    if (!result.ok) {
      setErrors({ form: result.error });
      return;
    }

    if (workspace) {
      await actions.selectWorkspaces([workspace]);
    }
    setCreated(true);
  };

  if (created) {
    return (
      <FunnelShell step={3} steps={['You', 'Your account', 'Your name']}>
        <div className="lh-funnel__intro">
          <p className="lh-mkt__eyebrow">Your account is ready</p>
          <h1 className="lh-mkt__display">This is what you just made.</h1>
        </div>

        <div className="lh-mkt__panel lh-mkt__panel--glow">
          <div className="lh-mkt__panelbody">
            <div className="lh-mkt__paneltop">
              <h2 className="lh-mkt__paneltitle">{name}</h2>
              <span className="lh-mkt__pulse">Live</span>
            </div>
            <p className="lh-mkt__cardbody">
              {accountType === 'business' ? businessName : 'Personal account'} ·{' '}
              {workspace ? WORKSPACE_LABEL[workspace] : 'No workspace yet'}
            </p>
            <p className="lh-mkt__body">
              {workspace
                ? `You are inside ${WORKSPACE_LABEL[workspace]}. ${WORKSPACE_PURPOSE[workspace]} Everything below is real data from the prototype, not a picture.`
                : 'No workspace is registered yet. You can add one from the rail.'}
            </p>
            <ul className="lh-read__list">
              {listings.slice(0, 4).map((listing) => (
                <li key={listing.id}>
                  <CheckIcon size={18} />
                  <span>
                    <strong>{listing.title}</strong> — {listing.location}
                  </span>
                </li>
              ))}
            </ul>
            <Button variant="accent" onClick={() => navigate('/app')}>
              Open my workspace
            </Button>
          </div>
        </div>
      </FunnelShell>
    );
  }

  return (
    <FunnelShell step={3} steps={['You', 'Your account', 'Your name']}>
      <div className="lh-funnel__intro">
        <p className="lh-mkt__eyebrow">Last question</p>
        <h1 className="lh-mkt__display">Here is what you are getting.</h1>
        <p className="lh-mkt__body">
          {workspace
            ? `Your account opens in ${WORKSPACE_LABEL[workspace]}. Before you give it a name, here is exactly what it does and does not do.`
            : 'Before you give it a name, here is exactly what it does and does not do.'}
        </p>
      </div>

      <article className="lh-read">
        {READ_BLOCKS.map((block) => (
          <section className="lh-read__block" key={block.heading}>
            <h2>{block.heading}</h2>
            <p>{block.body}</p>
          </section>
        ))}
      </article>

      <form className="lh-funnel__form" onSubmit={handleSubmit} noValidate>
        <h2 className="lh-read__block">
          <span className="lh-mkt__paneltitle">Your name</span>
        </h2>

        {accountType === 'business' ? (
          <TextInput
            label="Business name"
            name="businessName"
            required
            value={businessName}
            onChange={(event) => setBusinessName(event.target.value)}
            placeholder="The name you trade under"
            error={errors.businessName}
          />
        ) : null}

        <TextInput
          label="Your name"
          name="name"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="What should people call you"
          error={errors.name}
        />

        <TextInput
          label="Email address"
          name="email"
          required
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.co.za"
          error={errors.email}
        />

        <TextInput
          label="Password"
          name="password"
          required
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={errors.password}
        />

        {errors.form ? (
          <p className="lh-field__error" role="alert">
            {errors.form}
          </p>
        ) : null}

        <div className="lh-funnel__actions">
          <Button variant="ghost" onClick={() => navigate('/onboarding/account-type')}>
            Back
          </Button>
          <Button type="submit" variant="accent" loading={busy} disabled={busy}>
            Create my account
          </Button>
        </div>

        <p className="lh-mkt__fineprint">
          Creating an account in this prototype stores your details in this browser only. Nothing is
          sent anywhere.
        </p>
      </form>
    </FunnelShell>
  );
};
