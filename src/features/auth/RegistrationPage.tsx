import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/Button';
import { Logo } from '@/components/Logo';
import { Select, TextInput } from '@/components/Form';
import { useActions } from '@/state/store';
import {
  validateAccountType,
  validateBusinessName,
  validateEmail,
  validateName,
  validatePassword,
} from '@/utils/validation';

type AccountType = 'personal' | 'business';

export const RegistrationPage = () => {
  const actions = useActions();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [accountType, setAccountType] = useState<AccountType>('personal');
  const [businessName, setBusinessName] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState<string | null>(null);

  const busy = actions.isPending('register');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};

    const nameResult = validateName(name);
    if (!nameResult.ok) nextErrors.name = nameResult.error ?? 'Enter your name.';
    const emailResult = validateEmail(email);
    if (!emailResult.ok) nextErrors.email = emailResult.error ?? 'Enter a valid email address.';
    const passwordResult = validatePassword(password);
    if (!passwordResult.ok)
      nextErrors.password = passwordResult.error ?? 'Use at least 8 characters.';
    const accountTypeResult = validateAccountType(accountType);
    if (!accountTypeResult.ok)
      nextErrors.accountType = accountTypeResult.error ?? 'Choose an account type.';
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

    if (result.ok) {
      navigate('/onboarding/workspaces');
    }
  };

  return (
    <div className="lh-auth">
      <header className="lh-auth__header">
        <Link to="/" aria-label="LinkHive home">
          <Logo />
        </Link>
      </header>

      <main className="lh-auth__main">
        <form className="lh-auth__card" onSubmit={handleSubmit} noValidate>
          <h1 className="lh-h1">Create your account</h1>
          <p className="lh-muted">
            Start with one account. You can register for more workspaces later.
          </p>

          <TextInput
            label="Name"
            required
            autoComplete="name"
            value={name}
            error={errors.name}
            onChange={(event) => setName(event.target.value)}
          />

          <TextInput
            label="Email"
            required
            type="email"
            autoComplete="email"
            value={email}
            error={errors.email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <div className="lh-auth__password">
            <TextInput
              label="Password"
              required
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={password}
              error={errors.password}
              hint="At least 8 characters."
              onChange={(event) => setPassword(event.target.value)}
            />
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowPassword((value) => !value)}
            >
              {showPassword ? 'Hide password' : 'Show password'}
            </Button>
          </div>

          <Select
            label="Account type"
            required
            value={accountType}
            error={errors.accountType}
            options={[
              { value: 'personal', label: 'Personal' },
              { value: 'business', label: 'Business' },
            ]}
            onChange={(event) => setAccountType(event.target.value as AccountType)}
          />

          {accountType === 'business' ? (
            <TextInput
              label="Business name"
              required
              value={businessName}
              error={errors.businessName}
              onChange={(event) => setBusinessName(event.target.value)}
            />
          ) : null}

          {notice ? (
            <p className="lh-notice lh-notice--info" role="status">
              {notice}
            </p>
          ) : null}

          <Button type="submit" fullWidth loading={busy} disabled={busy}>
            Create account
          </Button>

          <div className="lh-row lh-spread">
            <button
              type="button"
              className="lh-linkbutton lh-linkbutton--sm"
              onClick={() => setNotice('Password reset is not connected in this prototype.')}
            >
              Forgot password
            </button>
            <button
              type="button"
              className="lh-linkbutton lh-linkbutton--sm"
              onClick={() =>
                setNotice('Sign in is a mock path in this prototype. Create an account instead.')
              }
            >
              Sign in
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};
