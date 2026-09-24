import { Component, type ErrorInfo, type ReactNode } from 'react'

import { ErrorMessage } from '../components/feedback/error-message'

interface State { hasError: boolean }

export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) console.error('Application error', error, info)
  }

  render() {
    return this.state.hasError ? <ErrorMessage /> : this.props.children
  }
}
