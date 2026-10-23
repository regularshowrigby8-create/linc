import { Link, useNavigate, useParams } from 'react-router-dom';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { EmptyState } from '@/components/States';
import { useActions, useStore } from '@/state/store';
import { formatCurrency } from '@/utils/format';
import { formatDate } from '@/utils/dates';
import { titleCase } from '@/utils/format';

const COMPONENT_ORDER = ['product', 'shipping', 'customs', 'tax', 'local_delivery'] as const;

const COMPONENT_LABEL: Record<(typeof COMPONENT_ORDER)[number], string> = {
  product: 'Product',
  shipping: 'Shipping',
  customs: 'Customs and duty',
  tax: 'Tax',
  local_delivery: 'Local delivery',
};

export const SupplyQuotePage = () => {
  const { id = '' } = useParams();
  const { state } = useStore();
  const actions = useActions();
  const navigate = useNavigate();

  const quote = state.app.quotes.find((item) => item.id === id);

  if (!quote) {
    return (
      <div className="lh-page">
        <EmptyState
          title="That quote is not available"
          description="The quote may have expired or the link may be wrong."
          actions={[{ label: 'Back to supply', onClick: () => navigate('/app/supply') }]}
        />
      </div>
    );
  }

  const total = quote.components.reduce((sum, component) => sum + component.amount, 0);
  const sorted = [...quote.components].sort(
    (a, b) => COMPONENT_ORDER.indexOf(a.kind) - COMPONENT_ORDER.indexOf(b.kind),
  );

  return (
    <div className="lh-page lh-detail">
      <Card as="article" className="lh-detail__main">
        <div className="lh-stack">
          <div className="lh-spread">
            <h1 className="lh-h1">Quote from {quote.supplierName}</h1>
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

          <p className="lh-muted">
            Quoted {formatDate(quote.timestamp)} · expires {formatDate(quote.expiresAt)} ·{' '}
            {titleCase(quote.state)}
          </p>

          <section className="lh-stack-sm">
            <h2 className="lh-h3">Route comparison</h2>
            <ul className="lh-stack-sm">
              {sorted.map((component) => (
                <li key={component.id} className="lh-routecard">
                  <div className="lh-spread">
                    <strong>{COMPONENT_LABEL[component.kind]}</strong>
                    <span className="lh-quote__amount">{formatCurrency(component.amount)}</span>
                  </div>
                  <p className="lh-caption">{component.label}</p>
                  <Badge
                    tone={component.certainty === 'confirmed' ? 'success' : 'warning'}
                    title={
                      component.certainty === 'confirmed'
                        ? 'The supplier confirmed this component.'
                        : 'This component is an estimate until the responsible party confirms it.'
                    }
                  >
                    {component.certainty === 'confirmed' ? 'Confirmed' : 'Estimated'}
                  </Badge>
                  {component.alternativeFor ? (
                    <p className="lh-caption">
                      This component replaces an earlier route component.
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>

          <div className="lh-quote__total">
            <span className="lh-label">Estimated route total</span>
            <span className="lh-quote__total-value">{formatCurrency(total)}</span>
          </div>

          {quote.responsibilityChanges.length > 0 ? (
            <section className="lh-stack-sm">
              <h2 className="lh-h3">Replaced responsibility</h2>
              <ul className="lh-stack-sm">
                {quote.responsibilityChanges.map((change) => (
                  <li key={`${change.componentId}-${change.to}`} className="lh-caption">
                    <strong>{change.from}</strong> was replaced by <strong>{change.to}</strong>.{' '}
                    {change.reason}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section className="lh-stack-sm">
            <h2 className="lh-h3">What happens next</h2>
            <p className="lh-muted">
              Selecting a quote records your choice in the prototype. Delivery cost is estimated
              until a route is confirmed, and no payment is taken.
            </p>
          </section>

          <div className="lh-row">
            <Button
              onClick={() => void actions.selectQuote(quote.id)}
              loading={actions.isPending(`select-quote:${quote.id}`)}
              disabled={quote.state === 'selected'}
            >
              {quote.state === 'selected' ? 'Quote selected' : 'Select this quote'}
            </Button>
            <Button
              variant="secondary"
              onClick={() => void actions.requestAlternative(quote.id)}
              loading={actions.isPending(`alternative:${quote.id}`)}
            >
              Request alternative
            </Button>
            <Button variant="ghost" disabled title="Payments are not available in this prototype">
              Payments are not available in this prototype
            </Button>
          </div>
        </div>
      </Card>

      <aside className="lh-detail__aside">
        <Card as="section" className="lh-stack-sm">
          <h2 className="lh-h3">Responsibility</h2>
          <p className="lh-caption">
            A confirmed route identifies who is responsible for the product, shipping, customs,
            duties, local delivery, damage, loss, returns and refunds.
          </p>
          <Link className="lh-linkbutton lh-linkbutton--sm" to="/app/supply">
            Back to supply options
          </Link>
        </Card>
      </aside>
    </div>
  );
};
