import React from 'react'

import { PieChart } from 'react-minimal-pie-chart';

export type IDonutChartData = {
    title: string,
    value: number,
    color: string
}

export const donutChartColors = ['#835AF7', '#5AF7AC', '#FF29D0', '#131720', '#CBD0CB']

export const disabledColor = '#303132'

const DonutChart = (props: {
    data: IDonutChartData[]
}) => {

    if (props.data.length === 0) {
        return (
            <div className='donut-chart'>
                <PieChart
                    radius={30}
                    animate
                    lineWidth={25}
                    data={[{title: '', value: 100, color: disabledColor}]}
                    labelPosition={0}
                    viewBoxSize={[100,100]}
                    label={() => `No allocations`}
                />
            </div>
        )
    }
    return (
        <div className='donut-chart'>
            <PieChart
                radius={30}
                animate
                lineWidth={25}
                data={props.data}
                labelPosition={110}
                viewBoxSize={[100,100]}
                label={({ dataEntry }) => `${dataEntry.title} \n ${dataEntry.percentage.toFixed(1)}%`}
                labelStyle={{ fontWeight: 600, fontSize: '3.5px', zIndex: 2 } }
            />
        </div>
    )
}
export function getDonutChartColor(index: number) {
    return donutChartColors[index % donutChartColors.length]
}
export default DonutChart;
