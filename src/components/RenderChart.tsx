import React from 'react';
import dynamic from 'next/dynamic'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

import type { Temperatures } from '../pages/index';

interface ChartData {
	chartData: Temperatures;
  }

const RenderChart = ({chartData}: ChartData) => {
	console.log(chartData);
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
			  name: "min-temp",
			  data: chartData.temperature_2m_min
			},
			{
				name: "max-temp",
				data: chartData.temperature_2m_max
			  }
		  ]

	return (
		<div className="app w-1/2">
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