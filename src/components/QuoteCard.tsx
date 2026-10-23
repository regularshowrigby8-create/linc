import type { SupplyQuote } from '@/data/types';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { formatCurrency } from '@/utils/format';
import { formatDate } from '@/utils/dates';
import { titleCase } from '@/utils/format';

interface QuoteCardProps {
  quote: SupplyQuote;
  selected: boolean;
  busy?: boolean;
  onSelect: () => void;
  onRequestAlternative: () => void;
}

/**
 * Renders one quote. Every cost component is shown separately with an
 * estimated or confirmed label, and the confidence level is stated in words.
 */
export const QuoteCard = ({
  quote,
  selected,
  busy,
  onSelect,
  onRequestAlternative,
}: QuoteCardProps) => {
  const total = quote.components.reduce((sum, component) => sum + component.amount, 0);

  return (
    <Card as="article" className="lh-quote">
      <div className="lh-spread">
        <div className="lh-stack-sm">
          <h3 className="lh-h3">{quote.supplierName}</h3>
          <p className="lh-caption">
            Quoted {formatDate(quote.timestamp)} · expires {formatDate(quote.expiresAt)}
          </p>
        </div>
        <Badge
          tone={
            quote.confidence === 'high'
              ? 'success'
              : quote.confidence === 'low'
                ? 'warning'
                : 'information'
          }
        >
          {titleCase(quote.confidence)} confidence
        </Badge>
      </div>

      <ul className="lh-quote__components">
        {quote.components.map((component) => (
          <li key={component.id} className="lh-quote__component">
            <div className="lh-stack-sm">
              <span className="lh-quote__component-label">{component.label}</span>
              <Badge
                tone={component.certainty === 'confirmed' ? 'success' : 'warning'}
                title={
                  component.certainty === 'confirmed'
                    ? 'The supplier confirmed this component.'
                    : 'This component is an estimate until a route is confirmed.'
                }
              >
                {component.certainty === 'confirmed' ? 'Confirmed' : 'Estimated'}
              </Badge>
            </div>
            <span className="lh-quote__amount">{formatCurrency(component.amount)}</span>
          </li>
        ))}
      </ul>

      <div className="lh-quote__total">
        <span className="lh-label">Estimated route total</span>
        <span className="lh-quote__total-value">{formatCurrency(total)}</span>
      </div>

      {quote.responsibilityChanges.length > 0 ? (
        <div className="lh-quote__responsibility">
          <h4 className="lh-label">Responsibility changes</h4>
          <ul className="lh-stack-sm">
            {quote.responsibilityChanges.map((change) => (
              <li key={`${change.componentId}-${change.to}`} className="lh-caption">
                <strong>{change.to}</strong> now covers {change.componentId.replace('cmp-', '')}.{' '}
                {change.reason}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="lh-quote__actions">
        <Button size="sm" variant="secondary" onClick={onRequestAlternative} loading={busy}>
          Request alternative
        </Button>
        <Button size="sm" onClick={onSelect} loading={busy} disabled={selected}>
          {selected ? 'Quote selected' : 'Select this quote'}
        </Button>
      </div>
    </Card>
  );
};
