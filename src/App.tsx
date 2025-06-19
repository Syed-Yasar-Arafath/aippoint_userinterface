import React from 'react';
import logo from './logo.svg';
import './App.css';
import Dashboard from './pages/Dashboard';
import CollectionAvailable from './pages/CollectionAvailable';
import CollectionDefault from './pages/CollectionDefault';
import CollectionSchedule from './pages/CollectionSchedule';

function App() {
  return (
    <div className="App">\
     <Dashboard/>
     <CollectionAvailable/>
     <CollectionDefault/>
     <CollectionSchedule/>
    </div>
  );
}

export default App;
