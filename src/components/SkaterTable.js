import React, { Component } from 'react';
import '../styles/StatsTable.css';

class SkaterTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      players: []
    }
  }

  componentDidMount() {
    let players = []

    // collect all the skaters
    Object.keys(this.props.team.players).map(key => {
      let thisPlayer = this.props.team.players[key]

      if (thisPlayer.stats && thisPlayer.stats.skaterStats) {
        thisPlayer.stats.skaterStats.points = thisPlayer.stats.skaterStats.goals + thisPlayer.stats.skaterStats.assists
        players.push(thisPlayer)
      }

      return true // suppresses warning
    })

    // sort by total points, goals, time on ice
    players.sort(function(a,b) {
      if(a.stats.skaterStats.points !== b.stats.skaterStats.points) {
        return b.stats.skaterStats.points - a.stats.skaterStats.points
      } else if(a.stats.skaterStats.goals !== b.stats.skaterStats.goals) {
        return b.stats.skaterStats.goals - a.stats.skaterStats.goals
      } else {
        return parseFloat(b.stats.skaterStats.timeOnIce) - parseFloat(a.stats.skaterStats.timeOnIce)
      }
    })

    this.setState({
      isLoaded: true,
      players: players
    })
  }

  render() {
    const { isLoaded, players } = this.state

    if(!isLoaded) {
      return (
        <span></span>
      )
    } else {
      return (
        <div className="StatsTable">
          <table className="table table-striped table-hover">
            <thead className="thead-dark">
              <tr>
                <th>Skater</th>
                <th className="text-right">Goals</th>
                <th className="text-right">Assists</th>
                <th className="text-right">TOI</th>
              </tr>
            </thead>
            <tbody>
              {players.map(player => (
                <tr key={player.person.id}>
                  <td>
                    {player.person.fullName}
                  </td>
                  <td className="text-right">
                    {player.stats.skaterStats.goals > 0 ? player.stats.skaterStats.goals : '-'}
                  </td>
                  <td className="text-right">
                    {player.stats.skaterStats.assists > 0 ? player.stats.skaterStats.assists : '-'}
                  </td>
                  <td className="text-right">
                    {player.stats.skaterStats.timeOnIce}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    }
  }
}

export default SkaterTable;
