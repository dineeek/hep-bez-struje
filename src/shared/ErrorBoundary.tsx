import { Component, ReactNode } from 'react';
import { localize } from '../utils';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '16px', textAlign: 'center' }} role="alert">
          <p>{localize('messageUnexpectedError')}</p>
        </div>
      );
    }
    return this.props.children;
  }
}
