import React, { Component } from 'react';
import '../styles/StatsTable.css';

class GoalieTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      players: []
    }
  }

  componentDidMount() {
    let players = []

    // collect all the goalies
    Object.keys(this.props.team.players).map(key => {
      let thisPlayer = this.props.team.players[key]

      if (thisPlayer.stats && thisPlayer.stats.goalieStats) {
        players.push(thisPlayer)
      }

      return true // suppresses warning
    })

    // sort by time on ice
    players.sort(function(a,b) {
      return parseFloat(b.stats.goalieStats.timeOnIce) - parseFloat(a.stats.goalieStats.timeOnIce)
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
                <th>Goalie</th>
                <th className="text-right">Saves</th>
                <th className="text-right">SV%</th>
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
                    {player.stats.goalieStats.saves}
                  </td>
                  <td className="text-right">
                    {player.stats.goalieStats.savePercentage ? parseFloat(Math.round(player.stats.goalieStats.savePercentage*100)/10000).toFixed(3) : '-'}
                  </td>
                  <td className="text-right">
                    {player.stats.goalieStats.timeOnIce}
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

export default GoalieTable;
