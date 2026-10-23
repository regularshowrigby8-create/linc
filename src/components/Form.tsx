import {
  useId,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react';

interface FieldShellProps {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: (ids: { inputId: string; describedBy: string | undefined }) => ReactNode;
}

const FieldShell = ({ label, required, hint, error, children }: FieldShellProps) => {
  const inputId = useId();
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ');

  return (
    <div className="lh-field">
      <label className="lh-field__label" htmlFor={inputId}>
        {label}
        {required ? (
          <span className="lh-field__required" aria-hidden="true">
            {' '}
            *
          </span>
        ) : (
          <span className="lh-field__optional"> (optional)</span>
        )}
      </label>
      {hint ? (
        <p className="lh-field__hint" id={hintId}>
          {hint}
        </p>
      ) : null}
      {children({ inputId, describedBy: describedBy || undefined })}
      {error ? (
        <p className="lh-field__error" id={errorId} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
};

interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
}

export const TextInput = ({ label, hint, error, required, ...rest }: TextInputProps) => (
  <FieldShell label={label} required={required} hint={hint} error={error}>
    {({ inputId, describedBy }) => (
      <input
        id={inputId}
        className="lh-input"
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        required={required}
        {...rest}
      />
    )}
  </FieldShell>
);

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id'> {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  options: { value: string; label: string }[];
}

export const Select = ({ label, hint, error, required, options, ...rest }: SelectProps) => (
  <FieldShell label={label} required={required} hint={hint} error={error}>
    {({ inputId, describedBy }) => (
      <select
        id={inputId}
        className="lh-input lh-select"
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        required={required}
        {...rest}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    )}
  </FieldShell>
);

interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
}

export const Textarea = ({ label, hint, error, required, ...rest }: TextareaProps) => (
  <FieldShell label={label} required={required} hint={hint} error={error}>
    {({ inputId, describedBy }) => (
      <textarea
        id={inputId}
        className="lh-input lh-textarea"
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        required={required}
        {...rest}
      />
    )}
  </FieldShell>
);

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'type'> {
  label: string;
  error?: string;
  hint?: string;
}

export const Checkbox = ({ label, error, hint, ...rest }: CheckboxProps) => {
  const inputId = useId();
  const errorId = `${inputId}-error`;
  return (
    <div className="lh-checkbox">
      <input
        id={inputId}
        type="checkbox"
        className="lh-checkbox__input"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        {...rest}
      />
      <label className="lh-checkbox__label" htmlFor={inputId}>
        {label}
      </label>
      {error ? (
        <p className="lh-field__error" id={errorId} role="alert">
          {error}
        </p>
      ) : null}
      {hint && !error ? <p className="lh-field__hint">{hint}</p> : null}
    </div>
  );
};
