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

    return data ? (
      <>
        <h2>{"Daily Data + Rolling Average"}</h2>
        <div className="chart">
          <ResponsiveLine
            data={this.state.dailyCases}
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
                legendOffset: 0,
                legendPosition: 'middle'
            }}
            colors={['#ddd', '#ddd', '#d74721', '#af0041']}
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
      </>
    ) : null;
  }
}

export default App;
