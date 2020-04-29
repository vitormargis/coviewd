import React, { Component } from "react";
import { ResponsiveLine } from "@nivo/line";
import { ResponsiveCalendar } from "@nivo/calendar";
import GraphTotalCombined from "../GraphTotalCombined";

export class App extends Component {
  constructor(props) {
    super(props);

    this.props = {
      data: {},
      country: ''
    }
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

  render() {
    const { data, country } = this.props;
    const countryData = data[country];

    function movingAvg(array, count, qualifier){

        // calculate average for subarray
        var avg = function(array, qualifier){

            var sum = 0, count = 0, val;
            for (var i in array){
                val = array[i];
                if (!qualifier || qualifier(val)){
                    sum += val;
                    count++;
                }
            }

            return sum / count;
        };

        var result = [], val;

        // pad beginning of result with null values
        for (var i=0; i < count-1; i++)
            result.push(null);

        // calculate average for each subarray and add to result
        for (let i=0, len=array.length - count; i <= len; i++){

            val = avg(array.slice(i, i + count), qualifier);
            if (isNaN(val))
                result.push(null);
            else
                result.push(val);
        }

        return result;
    }        

    const dailyCases = [
      {
        id: 'Case Avg.',
        data: movingAvg(this.addNewDaily(countryData, 'confirmed').map(a => a.y), 7 ).map((c, index) => ({
          y: c || index * 10,
          x: this.addNewDaily(countryData, 'confirmed')[index]?.x
        }))
      },
      {
        id: 'Death Avg.',
        data:  movingAvg(this.addNewDaily(countryData, 'deaths').map(a => a.y), 7 ).map((c, index) => ({
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

    const calendar = dailyCases[2].data.map(cases => ({
        day: `${cases.x.split('-')[0]}-${cases.x.split('-')[1] <= 9 ? '0' + cases.x.split('-')[1] : cases.x.split('-')[1]}-${(cases.x.split('-')[2]) <= 9 ? '0' + cases.x.split('-')[2] : cases.x.split('-')[2]}`,
        value: cases.y
    }))


    const linear = [
      {
        id: 'Desths Avg.',
        data:  movingAvg(this.addNewDaily(countryData, 'deaths').map(a => a.y), 2 ).map((c, index) => ({
          y: Math.abs(c*1 || index || 1),
          x: this.addNewDaily(countryData, 'deaths')[index]?.x
        }))
      },
      {
        id: 'Cases Avg.',
        data:  movingAvg(this.addNewDaily(countryData, 'confirmed').map(a => a.y), 2 ).map((c, index) => ({
          y: Math.abs(c*1 || index || 1),
          x: this.addNewDaily(countryData, 'confirmed')[index]?.x
        }))
      },
    ]

    const today = new Date()
    console.log(`2020-${today.getMonth() + 1}-${today.getDate()}`)

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
          
          <div className="chart">
            <ResponsiveLine
              data={dailyCases}
              margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
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
          <div className="chart short">
            <ResponsiveCalendar
                data={calendar}
                from={calendar[0].day}
                to={calendar[calendar.length - 1 ].day}
                emptyColor="#eeeeee"
                colors={[ '#61cdbb', '#97e3d5', '#e8c1a0', '#f47560' ]}
                margin={{ top: 0, right: 0, bottom: 60, left: 0 }}
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
