import React from 'react';
import dynamic from 'next/dynamic'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

import type { Temperatures } from './FormInputs';

interface ChartData {
	chartData: Temperatures;
  }

const RenderChart = ({chartData}: ChartData) => {
	const options = {
		chart: {
			id: "watz-tha-weatha",
			width: '700px'
		  },
		  xaxis: {
			categories: chartData.time
		  },
		}



		const series = [
			{
				name: "max-temp",
				data: chartData.temperature_2m_max
			},
			{
			  name: "min-temp",
			  data: chartData.temperature_2m_min
			},
		  ]

	return (
		<div className="app lg:w-2/3 w-full">
		  <div className="row">
			<div className="mixed-chart">
			{(typeof window !== 'undefined') &&
			  <Chart
				options={options}
				series={series}
				type="line"
			  />
			}
			</div>
		  </div>
		</div>
  )
}

export default RenderChart