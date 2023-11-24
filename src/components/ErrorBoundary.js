import React from 'react'

let ErrorSlice

if (process.env.NODE_ENV === 'production') {
  ErrorSlice = () => null
}

if (process.env.NODE_ENV !== 'production') {
  ErrorSlice = ({ message, details }) => {
    return (
      <div>
        <h2>Error rendering slice</h2>
        {details
          ? (
            <details>
              <summary><code>{message}</code></summary>
              <pre>{details}</pre>
            </details>
            )
          : <code>{message}</code>}
      </div>
    )
  }
}

class ErrorBoundary extends React.Component {
  constructor () {
    super()
    this.state = { errorMessage: null, errorDetail: null }
  }

  static getDerivedStateFromError (error) {
    return { errorMessage: error.message }
  }

  componentDidCatch (error, errorInfo) {
    console.error('Error rendering slice', error, errorInfo)
    this.setState({
      errorMessage: error.message,
      errorDetail: errorInfo.componentStack
    })
  }

  render () {
    const { children } = this.props
    const { errorMessage, errorDetail } = this.state

    if (!errorMessage) {
      return children
    }

    return <ErrorSlice message={errorMessage} details={errorDetail} />
  }
}

export default ErrorBoundary
