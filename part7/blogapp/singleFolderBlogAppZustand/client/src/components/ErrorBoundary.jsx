import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught an error', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h2>Something went wrong :( </h2>
          <p>{this.state.error.message}</p>
          <p>Please make a bug report to mluukkai on Discord</p>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
