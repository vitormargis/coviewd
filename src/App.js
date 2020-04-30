import React, { Component } from "react";
import DataSection from "./DataSection";
import SidePanel from './SidePanel';
import "./App.css";

export class App extends Component {
  constructor(props) {
    super(props);

    const queryParams = new URLSearchParams(window.location.search);
    
    this.state = {
      coronaData: null,
      country: queryParams.get('country')?.charAt(0).toUpperCase() + queryParams.get('country')?.slice(1) || 'Netherlands',
      countryInput: [{ value: 'Netherlands', label: 'Netherlands' }],
    }
    this.handleCountryChange = this.handleCountryChange.bind(this)
  }

  componentDidMount() {
    
    fetch(`https://pomber.github.io/covid19/timeseries.json`)
      .then((data) => data.json())
      .then((data) => {
        const countries = Object.keys(data);

        this.setState({ 
          coronaData: data,
          countries
        });
    })
  }

  handleCountryChange(selectedCountry) {
    this.setState({ countryInput: selectedCountry })
  }

  render() {
    const { countryInput } = this.state;

    return this.state.coronaData ? (
      <>
        <SidePanel countries={this.state.countries} countryInput={countryInput} onCountryChange={this.handleCountryChange}/>
        { countryInput && countryInput.map(country => <DataSection data={this.state.coronaData} country={country.value} />).reverse() }
      </>
    ) : null;
  }
}

export default App;
