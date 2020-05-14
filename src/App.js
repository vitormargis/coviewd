import React, { Component } from "react";
import DataSection from "./DataSection";
import SidePanel from './SidePanel';
import "./App.css";

export class App extends Component {
  constructor(props) {
    super(props);

    const queryParams = new URLSearchParams(window.location.search);
    
    this.state = {
      timeseries: null,
      country: queryParams.get('country')?.charAt(0).toUpperCase() + queryParams.get('country')?.slice(1) || 'Netherlands',
      countryInput: [],
    }
    this.handleCountryChange = this.handleCountryChange.bind(this)
  }

  componentDidMount() {
   
    fetch(`https://freegeoip.app/json/`)
      .then((data) => data.json())
      .then((data) => {
        this.setState({ 
          countryInput: [{ value: data.country_name, label: data.country_name }],
        });
    })

    fetch(`https://pomber.github.io/covid19/timeseries.json`)
      .then((data) => data.json())
      .then((data) => {
        const countries = Object.keys(data);

        this.setState({ 
          timeseries: data,
          countries
        });
    })

    fetch(`https://api.covid19api.com/summary`)
      .then((data) => data.json())
      .then((data) => {
        this.setState({ 
          summary: data
        });
    })
  }

  handleCountryChange(selectedCountry) {
    this.setState({ countryInput: selectedCountry })
  }

  render() {
    const { countryInput } = this.state;

    return this.state.timeseries ? (
      <>
        <SidePanel countries={this.state.countries} countryInput={countryInput} onCountryChange={this.handleCountryChange}/>
        { countryInput && countryInput.map(country => <DataSection data={this.state.timeseries} country={country.value} />).reverse() }
      </>
    ) : null;
  }
}

export default App;
