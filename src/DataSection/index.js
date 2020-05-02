import React, { Component } from "react";
import { ResponsiveLine } from "@nivo/line";
import { ResponsiveCalendar } from "@nivo/calendar";
import GraphTotalCombined from "../GraphTotalCombined";
import movingAverage from "../utils/movingAverage"

export class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
        dailyCases: []
    }

    this.props = {
      data: {},
      country: ''
    }

    this.handleUpdateDaily = this.handleUpdateDaily.bind(this);
  }

  componentDidMount() {
    const { data, country } = this.props;
    const countryData = data[country];
    
    this.setState({
        dailyCases: [
            {
              id: 'Case Avg.',
              status: true,
              color: '#ddd',
              colorOriginal: '#ddd',
              data: movingAverage(this.addNewDaily(countryData, 'confirmed').map(a => a.y), 7 ).map((c, index) => ({
                y: c || index * 10,
                x: this.addNewDaily(countryData, 'confirmed')[index]?.x
              })),
              dataOriginal: movingAverage(this.addNewDaily(countryData, 'confirmed').map(a => a.y), 7 ).map((c, index) => ({
                y: c || index * 10,
                x: this.addNewDaily(countryData, 'confirmed')[index]?.x
              }))
            },
            {
              id: 'Death Avg.',
              status: true,
              color: '#ddd',
              colorOriginal: '#ddd',
              data:  movingAverage(this.addNewDaily(countryData, 'deaths').map(a => a.y), 7 ).map((c, index) => ({
                y: c,
                x: this.addNewDaily(countryData, 'deaths')[index]?.x
              })),
              dataOriginal:  movingAverage(this.addNewDaily(countryData, 'deaths').map(a => a.y), 7 ).map((c, index) => ({
                y: c,
                x: this.addNewDaily(countryData, 'deaths')[index]?.x
              }))
            },
            {
                id: 'Cases',
                status: true,
                color: '#d74721',
                colorOriginal: '#d74721',
                data: this.addNewDaily(countryData, 'confirmed'),
                dataOriginal: this.addNewDaily(countryData, 'confirmed')
            },
            {
                id: 'Deaths',
                status: true,
                color: '#af0041',
                colorOriginal: '#af0041',
                data: this.addNewDaily(countryData, 'deaths'),
                dataOriginal: this.addNewDaily(countryData, 'deaths')
            },            
        ] 
    })
  }

  componentDidUpdate(nextProps) {
    const { data, country } = this.props;
    const countryData = data[country];

    return country !== nextProps.country && this.setState({
      dailyCases: [
        {
          id: 'Case Avg.',
          data: movingAverage(this.addNewDaily(countryData, 'confirmed').map(a => a.y), 7 ).map((c, index) => ({
            y: c || index * 10,
            x: this.addNewDaily(countryData, 'confirmed')[index]?.x
          }))
        },
        {
          id: 'Death Avg.',
          data:  movingAverage(this.addNewDaily(countryData, 'deaths').map(a => a.y), 7 ).map((c, index) => ({
            y: c,
            x: this.addNewDaily(countryData, 'deaths')[index]?.x
          }))
        },
        {
          id: 'Cases',
          data: this.addNewDaily(countryData, 'confirmed')
        },
        {
          id: 'Deaths',
          data: this.addNewDaily(countryData, 'deaths')
        },            
      ] 
    })
  }

  addNewDaily(data = [], type) {
    return data?.filter((d, i) => d.confirmed > 100 && (i % 1 === 0 || i === data.length - 1))?.map((day, index, array) => {
      const dailyValue = (day[type] - array[index - 1]?.[type]);
      const previouesDailyValue = (day[type] - array[index - 2]?.[type])/1.25;
      return {
        y: Math.abs(dailyValue === 0 ? previouesDailyValue : dailyValue) || 0,
        x: day.date
      };
    })
  }

  handleUpdateDaily(a,b) {
    this.setState({
        dailyCases: this.state.dailyCases.map(d => {
          console.log(d.id, a.id);

          return d.id === a.id ? {
            ...d,
            id: d.id,
            status: d.status ? false : true,
            color: d.status ? '#f5f5f5' : d.colorOriginal, 
            data: d.status ? d.dataOriginal.map(dd => ({ ...dd, y: 0 })) : d.dataOriginal
          } : d;
        })
    })                 
  }

  render() {
    const { dailyCases } = this.state;
    const { data, country } = this.props;
    const countryData = data[country];

    console.log(dailyCases);
    

    const calendar = this.addNewDaily(countryData, 'confirmed').map(cases => ({
      day: `${cases.x.split('-')[0]}-${cases.x.split('-')[1] <= 9 ? '0' + cases.x.split('-')[1] : cases.x.split('-')[1]}-${(cases.x.split('-')[2]) <= 9 ? '0' + cases.x.split('-')[2] : cases.x.split('-')[2]}`,
      value: cases.y
    }))


    const linear = [
      {
        id: 'Desths Avg.',
        data:  movingAverage(this.addNewDaily(countryData, 'deaths').map(a => a.y), 2 ).map((c, index) => ({
          y: Math.abs(c*1 || index || 1),
          x: this.addNewDaily(countryData, 'deaths')[index]?.x
        }))
      },
      {
        id: 'Cases Avg.',
        data:  movingAverage(this.addNewDaily(countryData, 'confirmed').map(a => a.y), 2 ).map((c, index) => ({
          y: Math.abs(c*1 || index || 1),
          x: this.addNewDaily(countryData, 'confirmed')[index]?.x
        }))
      },
    ]

    return countryData ? (
      <div className="country-column-wrapper">
        <div className="country-column">
          <h1>{country}</h1>
          <div className="chart short">
            <ResponsiveLine
              data={linear}
              margin={{ top: 0, right: 0, bottom: 5, left: 0 }}
              xScale={{ type: 'point' }}
              yScale={{ type: 'log', base: 2, min: 'auto', max: '500000' }}
              curve="basis"
              areaBaselineValue="-20"
              axisTop={null}
              axisRight={null}
              enableGridX={false}
              enableGridY={false}
              enableSlices={'x'}
              axisBottom={null}
              axisLeft={null}
              colors={['#ddd', '#ddd', '#af0041', '#580022']}
              lineWidth={3}
              enablePoints={false}
              pointSize={4}
              pointColor={{ theme: 'background' }}
              pointBorderWidth={2}
              pointBorderColor={{ from: 'serieColor' }}
              pointLabel="y"
              pointLabelYOffset={0}
              enableArea={false}
              areaOpacity={0.9}
              useMesh={true}
            />
          </div>

          <GraphTotalCombined data={countryData} />
          
          <h2>{"Daily Data + Rolling Average"}</h2>
          <div className="chart">
            <ResponsiveLine
              data={dailyCases}
              hiddenIds={['Cases']}
              margin={{ top: 0, right: 115, bottom: 60, left: 50 }}
              xScale={{ type: 'point' }}
              yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false, reverse: false }}
              curve="basis"
              areaBaselineValue="-20"
              axisTop={null}
              axisRight={null}
              enableGridX={false}
              enableSlices={'x'}
              axisBottom={{
                  orient: 'bottom',
                  tickSize: 5,
                  tickPadding: 6,
                  tickRotation: -45,
                  tickValues: countryData?.filter((d, i) => d.confirmed > 100 && i % 7 === 0)?.map(d => d.date),
                  legend: '',
                  legendOffset: 0,
                  legendPosition: 'middle'
              }}
              axisLeft={{
                  orient: 'left',
                  tickSize: 5,
                  tickPadding: 6,
                  tickRotation: 0,
                  legend: '',
                  legendOffset: 0,
                  legendPosition: 'middle'
              }}
              colors={dailyCases.map(({ color }) => color)}
              lineWidth={3}
              enablePoints={false}
              pointSize={4}
              pointColor={{ theme: 'background' }}
              pointBorderWidth={2}
              pointBorderColor={{ from: 'serieColor' }}
              pointLabel="y"
              pointLabelYOffset={0}
              enableArea={false}
              areaOpacity={0.9}
              useMesh={true}
              legends={[
                  {
                      onClick: this.handleUpdateDaily,
                      anchor: 'bottom-right',
                      direction: 'column',
                      justify: false,
                      translateX: 100,
                      translateY: 0,
                      itemsSpacing: 0,
                      itemDirection: 'left-to-right',
                      itemWidth: 65,
                      itemHeight: 20,
                      itemOpacity: 0.75,
                      symbolSize: 12,
                      symbolShape: 'circle',
                      symbolBorderColor: 'rgba(0, 0, 0, .5)',
                      effects: [
                          {
                              on: 'hover',
                              style: {
                                  itemBackground: 'rgba(0, 0, 0, .03)',
                                  itemOpacity: 1
                              }
                          }
                      ]
                  }
              ]}
            />
          </div>
          
          <h2 style={{ margin: '25px 0px -35px 0px'}}>{"Cases Calendar Heatmap "}</h2>
          <div className="chart short">
            <ResponsiveCalendar
                data={calendar}
                from={calendar[0].day}
                to={calendar[calendar.length - 1 ].day}
                emptyColor="#eeeeee"
                colors={[ '#61cdbb', '#97e3d5', '#e8c1a0', '#f47560' ]}
                margin={{ top: 0, right: 0, bottom: 50, left: 0 }}
                yearSpacing={40}
                dayBorderWidth={1.5}
                monthBorderWidth={0.5}
                monthBorderColor="rgba(0, 0, 0, 0.15)"
                monthLegendOffset={18}
                daySpacing={3}
                dayBorderColor="#ffffff"
                monthLegendPosition="after"
                legends={[
                    {
                        anchor: 'bottom',
                        direction: 'row',
                        translateY: 36,
                        itemCount: 7,
                        itemWidth: 35,
                        itemHeight: 5,
                        itemsSpacing: 25,
                        symbolSize: 12,
                        symbolShape: 'circle',
                        itemDirection: 'right-to-left'
                    }
                ]}
            />
        </div>     
      </div>
      </div>
    ) : null;
  }
}

export default App;
