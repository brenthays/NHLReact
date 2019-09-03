import React, { Component } from 'react';
import '../styles/App.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import ScoreBoard from './ScoreBoard';
import GameStats from './GameStats';
import Calendar from './Calendar';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <Link className="navbar-brand" to="/">NHL React</Link>
          </nav>
          <div className="container main-container">
            <Route exact path="/" component={Calendar} />
            <Route exact path="/scoreboard" component={ScoreBoard} />
            <Route path="/game/:id" component={GameStats} />
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
