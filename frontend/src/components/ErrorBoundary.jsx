import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div className="section container"><div className="card"><h2>Something went wrong</h2><p>Please refresh the page and try again.</p></div></div>;
    }
    return this.props.children;
  }
}