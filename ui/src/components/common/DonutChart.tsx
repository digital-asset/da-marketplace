import React from 'react'

import { PieChart } from 'react-minimal-pie-chart';

export type IDonutChartData = {
    title: string,
    value: number,
    color: string
}

export const donutChartColors = ['#835AF7', '#5AF7AC', '#FF29D0', '#131720', '#CBD0CB']

const DonutChart = (props: {
    data: IDonutChartData[]
}) => (
    <div className='donut-chart'>
        <PieChart
            radius={30}
            animate
            lineWidth={25}
            data={props.data}
            labelPosition={110}
            viewBoxSize={[100,100]}
            label={({ dataEntry }) => `${dataEntry.title} ${dataEntry.percentage.toFixed(1)}%`}
        />
    </div>
)
export function getDonutChartColor(index: number) {
    return donutChartColors[index % donutChartColors.length]
}
export default DonutChart;
