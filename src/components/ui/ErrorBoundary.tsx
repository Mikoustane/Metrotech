import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
    
    // Logger l'erreur pour le debug
    const errorLog = {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString()
    };
    
    try {
      const existingLogs = JSON.parse(localStorage.getItem('metrotech_error_logs') || '[]');
      existingLogs.unshift(errorLog);
      localStorage.setItem('metrotech_error_logs', JSON.stringify(existingLogs.slice(0, 50)));
    } catch (e) {
      console.error('Failed to log error:', e);
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-gray-800 rounded-xl p-6 border border-gray-700 text-center">
            <div className="mb-6">
              <AlertCircle className="mx-auto text-red-400 mb-4" size={48} />
              <h1 className="text-xl font-bold text-white mb-2">
                Oups ! Une erreur est survenue
              </h1>
              <p className="text-gray-400 text-sm">
                L'application a rencontré un problème inattendu. Nous nous excusons pour la gêne occasionnée.
              </p>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-red-900/20 border border-red-500/20 rounded-lg text-left">
                <h3 className="text-red-400 font-medium mb-2">Détails de l'erreur :</h3>
                <pre className="text-xs text-red-300 overflow-auto max-h-32">
                  {this.state.error.message}
                </pre>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={this.handleReload}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <RefreshCw size={18} />
                Recharger la page
              </button>
              
              <button
                onClick={this.handleReset}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Réessayer
              </button>
              
              <Link
                to="/"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
              >
                <Home size={18} />
                Retour à l'accueil
              </Link>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-700">
              <p className="text-xs text-gray-500">
                Si le problème persiste, contactez le support technique.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;