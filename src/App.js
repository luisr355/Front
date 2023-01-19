import React from 'react';
import logo from './logo.svg';
import './App.css';
import ShapeFlow from './components/Shapes';
import AddButton from './components/AddButton';
import SaveRestore from './components/SaveAndReset';
import Flow from './components/TextUpdater';

class ErrorBoundary extends React.Component{
  constructor(props){
    super(props);
    this.state ={
      error: null,
      errorInfo:null,
    };
  }

  componentDidCatch(error,errorInfo){
    this.setState({
      error,
      errorInfo
    })
  }

  render(){
    if(this.state.errorInfo){
      return <>Some thing wrong</>
    }
    return this.props.children;
  }
}

function App() {
  return (    
    <ErrorBoundary>         
     <SaveRestore />
    </ErrorBoundary>
  );
}

export default App;
