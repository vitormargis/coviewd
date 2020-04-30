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

    const dimensions = [
      { id: 'Recovered', color: '#ccc626'},
      { id: 'Deaths', color: '#af0041'},
      { id: 'Confirmed', color: '#d74721'},
    ]

    const defaultTimSeriesStartFilter = (d, i) => 
      d.confirmed > 100 && (i % 1 === 0 || i === data.length - 1);

    const dataTotalSummaryView = dimensions.map(({ id, color }) => ({
      id,
      color,
      data: data?.filter(defaultTimSeriesStartFilter)?.map(item => ({
        y: item[id.toLocaleLowerCase()],
        x: item.date,
      })) || []
    })).map((a, index, arr) => {
      const moreRecoveredThanDeaths = 
        arr[0].data[arr[0].data.length-1].y > arr[1].data[arr[1].data.length-1].y;

      if (index === 0 && moreRecoveredThanDeaths) return arr[1]
      if (index === 1 && moreRecoveredThanDeaths) return arr[0]
      return arr[index]
    })

    const percentage = [{ 
      id: "Death Rate",
      data: data?.filter(defaultTimSeriesStartFilter)?.map(({deaths, confirmed, date}) => ({
        y: (deaths / confirmed * 100).toFixed(2),
        x: date,
      })) || []
    }]
    
    return data ? (
      <>
        <h2>{"Total Summary View"}</h2>
        <div className="graph-total-combined chart-wrapper">
          <div className="chart">
            <ResponsiveLine
              data={dataTotalSummaryView}
              margin={{ top: 10, right: 115, bottom: 65, left: 48 }}
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
                  tickSize: 5,
                  tickPadding: 6,
                  tickRotation: 0,
                  legend: '',
                  legendOffset: -50,
                  legendPosition: 'middle'
              }}
              axisRight={false}
              colors={[dataTotalSummaryView[0].color, dataTotalSummaryView[1].color, dataTotalSummaryView[2].color]}
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
              legends={dataTotalSummaryView.map((data, index) => ({
                data:[{
                  id: data.id,
                  label: data.id,
                  value: index,
                  fill: data.color,
                  color: data.color,
                }],
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 100,
                itemsSpacing: 0,
                itemDirection: 'left-to-right',
                itemWidth: 65,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 10,
                translateY: index * 20 - 32,
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
              }))}
            />
          </div>
          <div className="chart-stack">
            <ResponsiveLine
              data={percentage}
              margin={{ top: 10, right: 115, bottom: 65, left: 48 }}
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
                  tickValues: dataTotalSummaryView  ?.filter((d, i) => d.confirmed > 100 && i % 7 === 0)?.map(d => d.date),
                  legend: '',
                  legendOffset: 0,
                  legendPosition: 'middle'
              }}
              axisLeft={false}
              axisRight={{
                orient: 'left',
                tickSize: 3,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Percentage %',
                legendOffset: 40,
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
                      itemWidth: 65,
                      itemHeight: 20,
                      itemOpacity: 0.75,
                      symbolSize: 10,
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
      </>
    ) : null;
  }
}

export default App;
