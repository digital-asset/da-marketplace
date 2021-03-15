import React from 'react'

import { PieChart } from 'react-minimal-pie-chart';

import { Table } from 'semantic-ui-react'

export type IDonutChartData = {
    title: string,
    value: number,
    color: string
}

export const donutChartColors = ['#835AF7', '#5AF7AC', '#FF29D0', '#131720', '#CBD0CB']

const DonutChart = (props: {
    data: IDonutChartData[]
}) => {
    const total = props.data.map(d => d.value).reduce((sum, item) => sum + item)

    return (
        <div className='donut-chart'>
            <PieChart
                radius={30}
                animate
                lineWidth={25}
                data={props.data}
                labelPosition={110}
                viewBoxSize={[100,100]}
                label={({ dataEntry }) => +dataEntry.percentage.toFixed(1) > 5 ? `${dataEntry.title} ${dataEntry.percentage.toFixed(1)}%`: ''}
            />
            <div className='key-table'>
                <Table>
                    <Table.Body>
                        {props.data.map(d =>
                            <Table.Row>
                                <Table.Cell>
                                    <div className='color-block' style={{backgroundColor: d.color}}></div>
                                </Table.Cell>
                                <Table.Cell>
                                    <p>{d.title} {((total/d.value)*100).toFixed(1)}%</p>
                                </Table.Cell>
                            </Table.Row>
                        )}
                    </Table.Body>
                </Table>
            </div>
        </div>
    )
}

export function getDonutChartColor(index: number) {
    return donutChartColors[index % donutChartColors.length]
}
export default DonutChart;
