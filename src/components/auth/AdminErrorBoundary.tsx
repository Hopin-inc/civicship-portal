"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { logger } from "@/lib/logging";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class AdminErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error("Admin page error caught by boundary", {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      component: "AdminErrorBoundary",
      errorCategory: "admin_page_error"
    });
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  private handleGoHome = () => {
    window.location.href = "/admin";
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background">
          <div className="w-full max-w-mobile-l px-4 space-y-6 text-center">
            <div className="space-y-2">
              <h2 className="text-heading-md text-foreground">
                管理者ページでエラーが発生しました
              </h2>
              <p className="text-body-md text-muted-foreground">
                予期しないエラーが発生しました。しばらく時間をおいてから再度お試しください。
              </p>
              {this.state.error && (
                <details className="text-left text-body-sm text-muted-foreground bg-muted p-4 rounded-md">
                  <summary className="cursor-pointer">エラー詳細</summary>
                  <pre className="mt-2 whitespace-pre-wrap">
                    {this.state.error.message}
                  </pre>
                </details>
              )}
            </div>
            
            <div className="space-x-4">
              <button
                onClick={this.handleRetry}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                再試行
              </button>
              <button
                onClick={this.handleGoHome}
                className="px-6 py-3 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
              >
                管理者ダッシュボードに戻る
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AdminErrorBoundary;
