import React, { Component } from 'react';
import Select from 'react-select';
import ScoreBoard from './ScoreBoard';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import '../styles/Calendar.css';

// Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendar } from '@fortawesome/free-solid-svg-icons'
library.add(faCalendar)

class LineScore extends Component {
  constructor(props) {
    super(props)
    this.state = {
      error: null,
      isLoaded: false,
      seasons: [],
      selectedSeason: null,
      selectedDate: null,
      selectedDateYMD: null
    }
  }

  handleSeasonChange(selectedSeason) {
    const now = new Date()
    const selectedSeasonBegin = new Date(selectedSeason.value.regularSeasonStartDate+"T20:00:00Z")
    const selectedSeasonEnd = new Date(selectedSeason.value.regularSeasonEndDate+"T20:00:00Z")
    const selectedDate = now > selectedSeasonBegin && now < selectedSeasonEnd ? now : selectedSeasonBegin
    const selectedDateYMD = selectedDate.toISOString().split('T')[0]

    localStorage.setItem('CalendarSelectedDate', selectedDate)

    this.setState({
      selectedSeason: selectedSeason,
      selectedDate: selectedDate,
      selectedDateYMD: selectedDateYMD
    })
  }

  handleDateChange(selectedDate) {
    const selectedDateYMD = selectedDate.toISOString().split('T')[0]
    localStorage.setItem('CalendarSelectedDate', selectedDate)

    this.setState({
      selectedDate: selectedDate,
      selectedDateYMD: selectedDateYMD
    })
  }

  componentDidMount() {
    // Fetch the seasons
    fetch("https://statsapi.web.nhl.com/api/v1/seasons")
      .then(res => res.json())
      .then(
        (result) => {
          let seasonOptions = []
          result.seasons.forEach(function (s) {
            let seasonName = s.seasonId.substring(0,4) + "-" + s.seasonId.substring(4,8) + " Season"
            seasonOptions.unshift({
              value: s,
              label: seasonName
            })
          })

          const selectedSeason = seasonOptions[0]

          // initialize date of calendar
          const storedDate = localStorage.getItem('CalendarSelectedDate')
          let selectedDate
          if(storedDate) {
            selectedDate = new Date(storedDate)
          } else {
            const now = new Date()
            const selectedSeasonBegin = new Date(selectedSeason.value.regularSeasonStartDate+"T20:00:00Z")
            const selectedSeasonEnd = new Date(selectedSeason.value.regularSeasonEndDate+"T20:00:00Z")
            selectedDate = now > selectedSeasonBegin && now < selectedSeasonEnd ? now : selectedSeasonBegin
          }

          // formatted date string
          const selectedDateYMD = selectedDate.toISOString().split('T')[0]

          this.setState({
            isLoaded: true,
            seasons: seasonOptions,
            selectedSeason: selectedSeason,
            selectedDate: selectedDate,
            selectedDateYMD: selectedDateYMD
          })
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error,
            seasons: [],
            selectedDate: null,
            selectedDateYMD: null
          })
        }
      )
  }

  render() {
    const { error, isLoaded, seasons, selectedSeason, selectedDate, selectedDateYMD } = this.state

    if(!isLoaded) {
      return (
        <span></span>
      )
    } else if(error) {
      return (
        <div>
          {error.message}
        </div>
      )
    } else {
      return (
        <div className="Calendar container">
          <div className="row">
            <div className="col-md-6">
              <div className="input-group mb-4">
                <div className="input-group-prepend">
                  <label className="input-group-text" htmlFor="dateSelect">
                    <FontAwesomeIcon icon="calendar"/>
                  </label>
                </div>
                <DatePicker
                  selected={selectedDate}
                  onChange={this.handleDateChange.bind(this)}
                  className="form-control"
                  dateFormat="MMM dd, yyyy"
                  id="dateSelect"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-inline float-md-right mb-4">
                <div className="form-group mr-2 d-none d-md-block">
                  <label>Jump To:</label>
                </div>
                <div className="form-group">
                  <Select
                    value={selectedSeason}
                    onChange={this.handleSeasonChange.bind(this)}
                    options={seasons}
                    className="seasonSelect"
                  />
                </div>
              </div>
              <div className="clearfix"></div>
            </div>
          </div>
          <ScoreBoard
            scheduleDate={selectedDateYMD}
          />
        </div>
      )
    }
  }
}

export default LineScore;
