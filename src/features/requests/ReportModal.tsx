import { useState } from 'react';
import type { ReportReason, ReportTargetType } from '@/data/types';
import { Button } from '@/components/Button';
import { Modal } from '@/components/Overlay';
import { Checkbox, Select, Textarea } from '@/components/Form';
import { useActions } from '@/state/store';
import { validateReportDetails } from '@/utils/validation';

interface ReportModalProps {
  open: boolean;
  targetType: ReportTargetType;
  targetId: string;
  targetLabel: string;
  onClose: () => void;
}

const REASON_OPTIONS: { value: ReportReason; label: string }[] = [
  { value: 'fraud', label: 'Fraud' },
  { value: 'theft', label: 'Theft' },
  { value: 'identity_fraud', label: 'Identity fraud' },
  { value: 'false_documents', label: 'False documents' },
  { value: 'illegal_activity', label: 'Illegal activity' },
  { value: 'harassment', label: 'Harassment' },
  { value: 'unsafe_service', label: 'Unsafe service' },
  { value: 'payment_issue', label: 'Payment issue' },
  { value: 'other', label: 'Other' },
];

/** Closes only after a successful report or an explicit cancel. */
export const ReportModal = ({
  open,
  targetType,
  targetId,
  targetLabel,
  onClose,
}: ReportModalProps) => {
  const actions = useActions();
  const [reason, setReason] = useState<ReportReason>('other');
  const [details, setDetails] = useState('');
  const [acknowledged, setAcknowledged] = useState(false);
  const [errors, setErrors] = useState<{ details?: string; acknowledged?: string }>({});
  const [failure, setFailure] = useState<string | null>(null);

  const busy = actions.isPending(`report:${targetId}`);

  const handleSubmit = async () => {
    const nextErrors: { details?: string; acknowledged?: string } = {};
    const detailsValidation = validateReportDetails(details);
    if (!detailsValidation.ok) nextErrors.details = detailsValidation.error;
    if (!acknowledged) {
      nextErrors.acknowledged = 'Confirm this statement before submitting.';
    }
    setErrors(nextErrors);
    setFailure(null);
    if (Object.keys(nextErrors).length > 0) return;

    const result = await actions.reportTarget({ targetType, targetId, reason, details });
    if (result.ok) {
      setDetails('');
      setAcknowledged(false);
      onClose();
    } else {
      setFailure(result.error);
    }
  };

  return (
    <Modal
      open={open}
      title="Report for review"
      description={`A moderator will review this report about ${targetLabel}.`}
      onClose={onClose}
      footer={
        <div className="lh-row lh-spread">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={busy} disabled={busy}>
            Report for review
          </Button>
        </div>
      }
    >
      <div className="lh-stack">
        <Select
          label="Reason"
          required
          value={reason}
          onChange={(event) => setReason(event.target.value as ReportReason)}
          options={REASON_OPTIONS}
        />

        <Textarea
          label="What happened?"
          required
          rows={5}
          maxLength={1000}
          value={details}
          error={errors.details}
          hint="Between 20 and 1000 characters. A written reason helps moderators act fairly."
          onChange={(event) => setDetails(event.target.value)}
        />

        <Checkbox
          label="I understand this report is reviewed and false/spam reports may be restricted."
          checked={acknowledged}
          error={errors.acknowledged}
          onChange={(event) => setAcknowledged(event.target.checked)}
        />

        {failure ? (
          <p className="lh-field__error" role="alert">
            {failure}
          </p>
        ) : null}
      </div>
    </Modal>
  );
};
