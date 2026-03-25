import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Header from './components/Header';
import Footer from './components/Footer';
import './styles/globals.css';

const App: React.FC = () => {
  return (
    <Router>
      <div style={{ backgroundColor: '#E6E6FA', minHeight: '100vh' }}>
        <Header />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/dashboard" component={Dashboard} />
        </Switch>
        <Footer />
      </div>
    </Router>
  );
};

export default App;