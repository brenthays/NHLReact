import React, { Component } from 'react';
import ScoreCard from './ScoreCard';

// Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'
library.add(faCircleNotch)

class ScoreBoard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      error: null,
      isLoaded: false,
      games: [],
      scheduleDate: null
    }
  }

  componentDidMount() {
    // Load today's games from NHL schedule endpoint
    fetch("http://statsapi.web.nhl.com/api/v1/schedule")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            games: result.dates && result.dates[0] ? result.dates[0].games : [],
            scheduleDate: result.dates && result.dates[0] ? new Date(result.dates[0].date + "T12:00:00") : null
          })
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error,
            scheduleDate: null
          })
        }
      )
  }

  render() {
    const { error, isLoaded, games, scheduleDate } = this.state

    if (error) {
      return <div>Error: {error.message}</div>
    } else if (!isLoaded) {
      return (
        <div className="text-center">
          <FontAwesomeIcon icon="circle-notch" className="fa-spin app-spinner"/>
        </div>
      )
    } else if (games && games.length){
      return (
        <div>
          <div className="jumbotron text-center">
            <h1>NHL Scoreboard</h1>
            <h2 className="text-muted">
              {new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'long',
                day: '2-digit'
              }).format(scheduleDate)}
            </h2>
          </div>
          <div className="row">
            {games.map(game => (
              <div className="col-xs-12 col-md-6" key={game.gamePk}>
                <ScoreCard game={game}/>
              </div>
            ))}
          </div>
        </div>
      );
    } else {
      return (
        <div className="text-center">
          <em>No games on the schedule for today!</em>
        </div>
      )
    }
  }
}

export default ScoreBoard;
