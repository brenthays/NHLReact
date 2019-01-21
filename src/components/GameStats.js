import React, { Component } from 'react';
import '../styles/GameStats.css';
import SkaterTable from './SkaterTable';
import GoalieTable from './GoalieTable';
import LineScore from './LineScore';

// Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'
library.add(faCircleNotch)

class GameStats extends Component {
  constructor(props) {
    super(props)
    this.state = {
      error: null,
      isLoaded: false,
      boxScore: null,
      gameTime: null
    }
  }

  componentDidMount() {
    // Load the box score
    fetch("https://statsapi.web.nhl.com/api/v1/game/"+this.props.match.params.id+"/boxscore")
      .then(res => res.json())
      .then(
        (boxResult) => {

          // live feed contains the game time
          fetch("https://statsapi.web.nhl.com/api/v1/game/"+this.props.match.params.id+"/feed/live")
            .then(res2 => res2.json())
            .then(
              (feedResult) => {
                this.setState({
                  isLoaded: true,
                  boxScore: boxResult,
                  gameTime: feedResult ? new Date(feedResult.gameData.datetime.dateTime) : null
                })
              },
              (error) => {
                this.setState({
                  isLoaded: true,
                  error
                })
              }
            )
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          })
        }
      )
  }

  render() {
    const { error, isLoaded, boxScore, gameTime } = this.state

    if (error) {
      return <div>Error: {error.message}</div>
    } else if (!isLoaded) {
      return (
        <div className="text-center">
          <FontAwesomeIcon icon="circle-notch" className="fa-spin app-spinner"/>
        </div>
      )
    } else if (boxScore){
      return (
        <div className="GameStats">
          <div className="jumbotron text-center">
            <h1>{boxScore.teams.away.team.name} @ {boxScore.teams.home.team.name}</h1>
            <h2 className="text-muted">
              {new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'long',
                day: '2-digit'
              }).format(gameTime)}
            </h2>
          </div>
          <div>
            <div className="row">
              <div className="col-lg-6">
                <h3>Line Score</h3>
                <LineScore gameId={this.props.match.params.id}/>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <h3>Team Stats</h3>
              </div>
              <div className="col-lg-6">
                <SkaterTable team={boxScore.teams.away} />
                <GoalieTable team={boxScore.teams.away} />
              </div>
              <div className="col-lg-6">
                <SkaterTable team={boxScore.teams.home} />
                <GoalieTable team={boxScore.teams.home} />
              </div>
            </div>
          </div>
        </div>
      );
    }

  }
}

export default GameStats;
