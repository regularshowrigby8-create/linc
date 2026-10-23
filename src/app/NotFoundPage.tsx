import { Link } from 'react-router-dom';
import { Card } from '@/components/Card';
import { useStore } from '@/state/store';
import { WORKSPACE_HOME_ROUTE, selectActiveWorkspace } from '@/state/selectors';

export const NotFoundPage = () => {
  const { state } = useStore();
  const workspace = selectActiveWorkspace(state);

  return (
    <div className="lh-page">
      <Card as="section" className="lh-stack">
        <h1 className="lh-h1">That page does not exist</h1>
        <p className="lh-muted">The link may be out of date, or the page may have moved.</p>
        <div className="lh-row">
          <Link className="lh-btn lh-btn--primary lh-btn--md" to={WORKSPACE_HOME_ROUTE[workspace]}>
            Back to my workspace
          </Link>
          <Link className="lh-btn lh-btn--secondary lh-btn--md" to="/">
            Go to the home page
          </Link>
        </div>
      </Card>
    </div>
  );
};
