import React from 'react';
import { AlertCircle } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-neutral-900 border border-red-500/30 rounded-2xl p-6">
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
              <div>
                <h2 className="text-lg font-bold text-white mb-2">Что-то пошло не так</h2>
                <p className="text-sm text-neutral-400 mb-4">
                  Произошла ошибка при загрузке приложения.
                </p>
              </div>
            </div>

            {this.state.error && (
              <div className="bg-neutral-800/50 rounded-xl p-4 mb-4">
                <h3 className="text-sm font-semibold text-white mb-2">Детали ошибки:</h3>
                <pre className="text-xs text-neutral-400 overflow-auto max-h-40">
                  {this.state.error.message}
                </pre>
              </div>
            )}

            <button
              onClick={() => window.location.reload()}
              className="w-full py-2 rounded-xl bg-lime-400 text-neutral-900 font-semibold hover:bg-lime-300 transition-colors"
            >
              Перезагрузить страницу
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
