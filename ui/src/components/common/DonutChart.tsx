import React, { useState } from 'react'

import "./DonutChart.css"

export type IDonutInfo = {
    label: string,
    amount: number
}

const BASE_CLASS = `pie-chart`
const DonutChart = (props: {slices: number []}) => {

  function getCoordinatesForPercent( percent: number ) {
    const x = Math.cos(2 * Math.PI * percent)
    const y = Math.sin(2 * Math.PI * percent)
    return [ x, y ]
  }

  function createSlices( slices: number [] ) {
    let cumulativePercent = 0
    return slices.map( (percent, index) => {
      // destructuring assignment sets the two variables at once
      const [startX, startY] = getCoordinatesForPercent( cumulativePercent )
      // each slice starts where the last slice ended, so keep a cumulative percent
      cumulativePercent = cumulativePercent + percent
      const [endX, endY] = getCoordinatesForPercent( cumulativePercent )
      // if the slice is more than 50%, take the large arc (the long way around)
      const largeArcFlag = percent > .5 ? 1 : 0
      // some SVG path here
      // • M = Move
      // • A = Arc
      // • L = Line
      const pathData = [
        `M ${startX} ${startY}`,
        `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
        `L 0 0`,
      ].join(` `)
      return <path key={ index } d={ pathData } />
    })
  }

 const cumulativePercent = 0
    return (
      <div className={BASE_CLASS}>
        <p className={`${BASE_CLASS}__title`}>React Pie Chart</p>
        <svg viewBox="-1 -1 2 2" className={`${BASE_CLASS}__pie`}>
          <defs>
            <mask id="pie-mask">
              <rect fill="white" x="-1" y="-1" width="2" height="2" />
              <circle fill="black" cx="0" cy="0" r=".65" />
            </mask>
          </defs>          
          <g mask="url(#pie-mask)">
            <circle className={`${BASE_CLASS}__pie_bg`} cx="0" cy="0" r="1"/>
            { createSlices( props.slices )  }            
          </g>
        </svg>
      </div>
    )
}

//const rSlices = [ 0.1, 0.65, 0.2 ]

export default DonutChart;
