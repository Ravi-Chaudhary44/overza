import React from 'react';
import { FaExclamationTriangle, FaRedo } from 'react-icons/fa';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
   
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
  
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-white dark:from-gray-900 dark:to-gray-800 p-4">
          <div className="max-w-md w-full">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full mb-4">
                <FaExclamationTriangle className="text-3xl text-red-600 dark:text-red-400" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Something went wrong
              </h2>
              
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                We apologize for the inconvenience. The application encountered an unexpected error.
              </p>
              
              {process.env.NODE_ENV === 'development' && (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6 text-left">
                  <p className="text-sm font-mono text-gray-800 dark:text-gray-300 mb-2">
                    {this.state.error?.toString()}
                  </p>
                  <details className="text-sm text-gray-600 dark:text-gray-400">
                    <summary className="cursor-pointer mb-2">Stack Trace</summary>
                    <pre className="whitespace-pre-wrap mt-2 text-xs">
                      {this.state.errorInfo?.componentStack}
                    </pre>
                  </details>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={this.handleReset}
                  className="inline-flex items-center justify-center bg-cricket-green hover:bg-cricket-darkGreen text-white px-6 py-3 rounded-lg font-semibold"
                >
                  <FaRedo className="mr-2" /> Reload Application
                </button>
                
                <button
                  onClick={() => window.location.href = '/'}
                  className="inline-flex items-center justify-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-300 px-6 py-3 rounded-lg font-semibold"
                >
                  Go to Homepage
                </button>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  If the problem persists, please contact support.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;