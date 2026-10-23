import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  message: string | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  override state: ErrorBoundaryState = { hasError: false, message: null };

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return {
      hasError: true,
      message: error instanceof Error ? error.message : 'An unexpected error occurred.',
    };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    // Prototype logging only. No identifiers or payloads are sent anywhere.
    console.error('LinkHive error:', error.message, info.componentStack);
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, message: null });
  };

  override render(): ReactNode {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="lh-page lh-errorpage">
        <h1 className="lh-h1">Something went wrong</h1>
        <p className="lh-muted">
          This screen could not be shown. Your saved details are still here. Try again, or go back
          to your workspace.
        </p>
        <div className="lh-row">
          <button
            type="button"
            className="lh-btn lh-btn--primary lh-btn--md"
            onClick={this.handleRetry}
          >
            Try again
          </button>
          <a className="lh-btn lh-btn--secondary lh-btn--md" href="/app">
            Back to my workspace
          </a>
        </div>
      </div>
    );
  }
}
