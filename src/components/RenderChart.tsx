import React, { useState } from 'react';
import dynamic from 'next/dynamic'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

import type { Temperatures } from './FormInputs';
import type { ApexOptions } from 'apexcharts';

interface ChartData {
	chartData: Temperatures;
}


const RenderChart = ({chartData}: ChartData) => {
	const [chartType, setChartType] = useState("line")
	const options: ApexOptions = {
		chart: {
			id: "watz-tha-weatha",
			width: '700px'
		},
		xaxis: {
			categories: chartData.time
		},
		legend: {
			position: 'top',
		},
		colors: ['#ffd203', '#7bdcff'],
		dataLabels: {
			enabled: true,	
		}
	}



	const series = [
		{
			name: "Max Temp",
			data: chartData.temperature_2m_max
		},
		{
			name: "Min Temp",
			data: chartData.temperature_2m_min
		},
	]

	const handledToggleChart = () => {
		setChartType(chartType === 'bar' ? "line" : "bar")
	}

	return (
		<div className="app lg:w-2/3 w-full">
			<div className="row">
				<div className="mixed-chart">
					<p className="text-xs text-center text-white mb-5">Click on legend to select and de-select data</p>
				{(typeof window !== 'undefined') &&
					<Chart
					options={options}
					series={series}
					type={chartType as 'line' | 'bar'}
					/>
				}
				</div>
				<div className="chart-choice text-center">
					<button
						className="bg-[#ff6b6b] text-white px-4 py-2 rounded-lg" onClick={handledToggleChart}
					>
						Swith to {chartType === 'bar' ? 'Line' : 'Bar'} Chart
					</button>
				</div>
			</div>
		</div>
	)
}

export default RenderChart