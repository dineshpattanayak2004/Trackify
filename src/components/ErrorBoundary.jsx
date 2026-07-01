import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props){
    super(props);
    this.state = { error: null, info: null };
  }

  static getDerivedStateFromError(error){
    return { error };
  }

  componentDidCatch(error, info){
    this.setState({ error, info });
    // keep a console log for developer
    console.error('ErrorBoundary caught:', error, info);
  }

  render(){
    if(this.state.error){
      return (
        <div style={{padding:32}}>
          <h2 style={{color:'#991b1b'}}>Something went wrong rendering this page.</h2>
          <p style={{color:'#374151'}}>{this.state.error?.toString()}</p>
          <details style={{whiteSpace:'pre-wrap',marginTop:12}}>
            {this.state.info?.componentStack}
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}
