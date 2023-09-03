import React, { useEffect, useState } from 'react';
import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import { mockLineData as data1} from "../data/mockData";

const LineChart = ( {selectedYear}) => {
  const [data, setData] = useState([]);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    fetch("http://localhost:3000/api/payments")
      .then((response) => response.json())
      .then((fetchedData) => {
        const transformedData = transformData(fetchedData, selectedYear);
        console.log(transformedData)
        setData(transformedData);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, [selectedYear]);  // Note the added dependency on selectedYear

  const transformData = (apiData, selectedYear) => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    const cashInData = months.map(month => ({ x: month, y: 0 }));
    const cashOutData = months.map(month => ({ x: month, y: 0 }));
    const revenueData = months.map(month => ({ x: month, y: 0 }));
  
    // Your existing logic here
    apiData.forEach(item => {
      const dateObj = new Date(item.date);
      const month = dateObj.toLocaleString('default', { month: 'long' }); // Get month name
      const year = dateObj.getFullYear(); // Get year
  
      if (year !== selectedYear) return; // Skip if not the selected year
  
      const amount = item.amount;
  
      const cashInMonth = cashInData.find(data => data.x === month);
      const cashOutMonth = cashOutData.find(data => data.x === month);
  
      if (item.cashin === 1 && cashInMonth) {
        cashInMonth.y += amount;
      } else if (cashOutMonth) {
        cashOutMonth.y += amount;
      }
    });
  
    // Calculate revenueData based on cashInData and cashOutData
    cashInData.forEach((data, index) => {
      revenueData[index].y = data.y - cashOutData[index].y;
    });
  
    return [
      {
        id: "Cash In",
        color: colors.greenAccent[500],
        data: cashInData,
      },
      {
        id: "Cash Out",
        color: colors.blueAccent[300],
        data: cashOutData,
      },
      {
        id: "Revenue",
        color: colors.redAccent[200],
        data: revenueData,
      },
    ];
  };
  

  return (
    
    <ResponsiveLine
      data={data}
      theme={{
        axis: {
          domain: {
            line: {
              stroke: colors.grey[100],
            },
          },
          legend: {
            text: {
              fill: colors.grey[100],
            },
          },
          ticks: {
            line: {
              stroke: colors.grey[100],
              strokeWidth: 1,
            },
            text: {
              fill: colors.grey[100],
            },
          },
        },
        legends: {
          text: {
            fill: colors.grey[100],
          },
        },
        tooltip: {
          container: {
            color: colors.primary[500],
          },
        },
      }}
      colors={1===1 ? { datum: "color" } : { scheme: "nivo" }} // added
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        min: "auto",
        max: "auto",
        stacked: true,
        reverse: false,
      }}
      yFormat=" >-.2f"
      curve="catmullRom"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        orient: "bottom",
        tickSize: 0,
        tickPadding: 5,
        tickRotation: 0,
        legend: undefined,
        legendOffset: 36,
        legendPosition: "middle",
      }}
      axisLeft={{
        orient: "left",
        tickValues: 5, // added
        tickSize: 3,
        tickPadding: 5,
        tickRotation: 0,
        legend: undefined,
        legendOffset: -40,
        legendPosition: "middle",
      }}
      enableGridX={false}
      enableGridY={false}
      pointSize={8}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabelYOffset={-12}
      useMesh={true}
      legends={[
        {
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 100,
          translateY: 0,
          itemsSpacing: 0,
          itemDirection: "left-to-right",
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: "circle",
          symbolBorderColor: "rgba(0, 0, 0, .5)",
          effects: [
            {
              on: "hover",
              style: {
                itemBackground: "rgba(0, 0, 0, .03)",
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
    />
    
  );
};

export default LineChart;
