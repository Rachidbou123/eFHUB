import React, { ReactNode } from 'react';

export class ErrorBoundary extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    // @ts-ignore
    this.state = { hasError: false, errorMsg: '' };
  }

  public static getDerivedStateFromError(error: Error) {
    return { hasError: true, errorMsg: error.message };
  }

  public render() {
    // @ts-ignore
    if (this.state.hasError) {
      return (
        <div className="p-8 m-4 bg-red-900/20 border border-red-500 rounded-lg text-white">
          {/* @ts-ignore */}
          <h2 className="text-xl font-bold mb-2">Error in {this.props.componentName}</h2>
          {/* @ts-ignore */}
          <pre className="text-sm font-mono opacity-80 whitespace-pre-wrap">{this.state.errorMsg}</pre>
        </div>
      );
    }

    // @ts-ignore
    return this.props.children;
  }
}
