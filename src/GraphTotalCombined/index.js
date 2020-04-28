import React, { Component } from "react";
import { ResponsiveLine } from "@nivo/line";

export class App extends Component {
  constructor(props) {
    super(props);

    this.props = {
      data: [],
    }
  }

  render() {
    const { data } = this.props;

    const dataParsed = [
      { 
        id: "Recovered",
        color: '#ccc626',
        data: data?.filter((d, i) => d.confirmed > 100 && (i % 1 === 0 || i === data.length - 1))?.map(d => ({
          y: d.recovered,
          x: d.date,
        })) || []
      },
      { 
        id: "Deaths",
        color: '#af0041',
        data: data?.filter((d, i) => d.confirmed > 100 && (i % 1 === 0 || i === data.length - 1))?.map(d => ({
          y: d.deaths,
          x: d.date,
        })) || []
      },
      { 
        id: "Cases",
        color: '#d74721',
        data: data?.filter((d, i) => d.confirmed > 100 && (i % 1 === 0 || i === data.length - 1))?.map(d => ({
          y: d.confirmed,
          x: d.date,
        })) || []
      },
    ].map((a, index, arr) => {
      
      // const c = a.data.map(b => {
      //   return b
      // })

      if (index === 0 && arr[0].data[arr[0].data.length-1].y > arr[1].data[arr[1].data.length-1].y) {
        return arr[1]
      }

      if (index === 1 && arr[0].data[arr[0].data.length-1].y > arr[1].data[arr[1].data.length-1].y) {
        return arr[0]
      }

      return arr[index]
    })

    const percentage = [
      { 
        id: "Death Rate",
        data: data?.filter((d, i) => d.confirmed > 100 && (i % 1 === 0 || i === data.length - 1))?.map(d => ({
          y: (d.deaths/d.confirmed*100).toFixed(2),
          x: d.date,
        })) || []
      }
    ]
    
    return data ? (
      <div className="graph-total-combined chart-wrapper">
        <div className="chart">
          <ResponsiveLine
            data={dataParsed}
            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
            xScale={{ type: 'point' }}
            yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false, reverse: false }}
            curve="basis"
            areaBaselineValue="-20"
            axisTop={null}
            enableGridX={false}
            axisBottom={{
                orient: 'bottom',
                tickSize: 5,
                tickPadding: 6,
                tickRotation: -45,
                tickValues: data?.filter((d, i) => d.confirmed > 100 && i % 7 === 0)?.map(d => d.date),
                legend: '',
                legendOffset: 0,
                legendPosition: 'middle'
            }}
            axisLeft={{
                orient: 'left',  
                // tickValues: dataParsed ?.filter((d, i) => d.confirmed > 100 && i % 10 === 0 || i === dataParsed .length - 1)?.map(d => d.confirmed),
                tickSize: 5,
                tickPadding: 6,
                tickRotation: 0,
                legend: '',
                legendOffset: -50,
                legendPosition: 'middle'
            }}
            axisRight={false}
            colors={[dataParsed[0].color, dataParsed[1].color, dataParsed[2].color]}
            lineWidth={3}
            enablePoints={false}
            pointSize={10}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabel="y"
            pointLabelYOffset={-12}
            enableArea={true}
            areaOpacity={0.9}
            useMesh={true}
            legends={[
                {
                    anchor: 'bottom-right',
                    direction: 'column',
                    justify: false,
                    translateX: 100,
                    translateY: 0,
                    itemsSpacing: 0,
                    itemDirection: 'left-to-right',
                    itemWidth: 60,
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
        <div className="chart-stack">
          <ResponsiveLine
            data={percentage}
            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
            xScale={{ type: 'point' }}
            yScale={{ type: 'linear', min: '0', max: '100', stacked: false, reverse: false }}
            curve="cardinal"
            areaBaselineValue="-20"
            axisTop={null}
            enableGridX={false}
            enableSlices={'x'}
            enableGridY={false}
            axisBottom={{
                orient: 'bottom',
                tickSize: 5,
                tickPadding: 6,
                tickRotation: -45,
                tickValues: dataParsed  ?.filter((d, i) => d.confirmed > 100 && i % 7 === 0)?.map(d => d.date),
                legend: '',
                legendOffset: 0,
                legendPosition: 'middle'
            }}
            axisLeft={false}
            axisRight={{
              orient: 'left',
              tickSize: 5,
              tickPadding: 6,
              tickRotation: 0,
              legend: 'Percentage %',
              legendOffset: 47.5,
              legendPosition: 'middle'
            }}
            colors={['#700000']}
            lineWidth={1.2}
            enablePoints={true}
            pointSize={1.75}
            pointColor={null}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabel="y"
            pointLabelYOffset={-12}
            enableArea={false}
            areaOpacity={0}
            useMesh={true}
            gridYValues={[1,2,3,4,5,6,7,8,9]}
            legends={[
                {
                    anchor: 'top-right',
                    direction: 'column',
                    justify: false,
                    translateX: 100,
                    translateY: 0,
                    itemsSpacing: 0,
                    itemDirection: 'left-to-right',
                    itemWidth: 60,
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
      </div>
    ) : null;
  }
}

export default App;
