import React, { Component } from "react";
import Select from 'react-select';

import Logo from '../images/Logo.js';
import "../App.css";

export class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedOption: [],
    }  
  }

  render() {
    return (
      <div className="nav-column-wrapper">
        <div className="logo">
          <Logo />
          <br/>
          <br/>
          <br/>
          <Select
            isMulti
            value={this.props.countryInput}
            onChange={this.props.onCountryChange}
            options={this.props.countries.map(country => ({
              value: country,
              label: country,
            }))}
          />
        </div>
      </div>    
    );
  }
}

export default App;
