import React, { useRef, useState } from 'react';

import Spinner from "./Spinner";

import type { Address } from "../pages/api/getLatLng";

import { validateLatitude, validateLongitude } from "../utils/validation";
import request from "../utils/typedRequest";

export interface Temperatures {
	temperature_2m_max: number[];
	temperature_2m_min: number[];
	time: string[];
}

export interface Forecast {
	daily: Temperatures;
	error?: string;
}

interface FormInputsProps {
	setLoading: (loading: boolean) => void;
	setTemperatures: (temperatures: Temperatures) => void;
	loading: boolean;
}

const FormInputs = ({setLoading, setTemperatures, loading}: FormInputsProps) => {
	const latRef = useRef<HTMLInputElement>(null);
	const lngRef = useRef<HTMLInputElement>(null);
	const addressRef = useRef<HTMLInputElement>(null);

	const [latErr, setLatErr] = useState('') ;
	const [lngErr, setLngErr] = useState('');
	const [coordsErr, setCoordsErr] = useState('');
	const [getWeatherErr, setGetWeatherErr] = useState('');

	const handleGetLatLng = () => {
		setLoading(true);
		const address = addressRef.current?.value || '';

		if (!address) {
			setCoordsErr('Please enter an address');
			setLoading(false);
			return;
		}
		setCoordsErr('');
		request<Address>(`${process.env.NEXT_PUBLIC_DOMAIN as string}/api/getLatLng`, {
			method: 'POST',
			body: JSON.stringify({ address: address })
		})
		.then(data => {
			if (data.error) {
				throw new Error();
			}
			if (data.latitude && latRef.current) {
				latRef.current.value = data.latitude.toString();
				setLatErr('');
			}
			if (data.longitude && lngRef.current) {
				lngRef.current.value = data.longitude.toString();
				setLngErr('');
			}
		})
		.catch(err => {
			setCoordsErr('Error. Please try a different address.');
			console.log(err);
		})
		.finally(() => {
			setGetWeatherErr('');
			setLoading(false);
		})
		

	}

	const handleGetWeather = () => {
		setLoading(true);
		const lat = latRef.current?.value || '';
		const lng = lngRef.current?.value || '';
	
		const error = validateLatitude(lat) || validateLongitude(lng);
		if (error) {
			setGetWeatherErr(error);
			setLoading(false);
			return;
		}

		setGetWeatherErr('');

		request<Forecast>(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=temperature_2m_max,temperature_2m_min&timezone=Africa%2FCairo`)
		.then(data => {
			if (data.error) {
				throw new Error();
			}
			setTemperatures(data.daily);
		})
		.catch(err => {
			setGetWeatherErr('An error occured. Please try again.');
			console.log(err);
		})
		.finally(() => {
			setLoading(false);
		})
		
	}

	return (
		<div className="detail flex flex-col items-center">
			<div className="coords flex gap-5 mb-5 justify-end items-end">
				<div className="flex flex-col gap-2 w-full">
					<div className="error text-[#ff6b6b]">
						{latErr}
					</div>
					<input
						type="text"
						name="latitude"
						placeholder="Latitude"
						ref={latRef}
						onBlur={(e) => {
							const error = validateLatitude(e.target.value);
							if (error) {
								setLatErr(error);
							} else {
								setLatErr('');
							}
						}}
						className=" mr-5 px-4 py-2 rounded-lg w-full" 
					/>
				</div>
				<div className="flex flex-col gap-2 w-full">
					<div className="error text-[#ff6b6b]">
						{lngErr}
					</div>
					<input
						type="text"
						name="longitude"
						placeholder="Longitude"
						ref={lngRef}
						onBlur={(e) => {
							const error = validateLongitude(e.target.value);
							if (error) {
								setLngErr(error);
							} else {
								setLngErr('');
							}
						}}
						className=" px-4 py-2 rounded-lg w-full" 
					/>
				</div>
			</div>
			<div className="flex flex-col mb-2 w-full">
					<div className="error text-[#ff6b6b]">
						{coordsErr}
					</div>
			</div>
			<div className="address mb-5 w-full flex flex-row justify-between gap-5">
				<input
					type="text"
					name="address"
					placeholder="Address"
					ref={addressRef}
					className=" px-4 py-2 rounded-lg grow"
				/>
				<button
					className="bg-[#ff6b6b] text-white text-[14px] sm:text-base px-4 py-2 rounded-lg basis=1/3"
					onClick={handleGetLatLng}
					disabled={loading}
				>
					Get Coords
				</button>
			</div>
			
			{ loading ?
				<Spinner /> :(
			<div>
				<div className="flex flex-col mb-2 w-full">
					<div className="error text-[#ff6b6b]">
						{getWeatherErr}
					</div>
				</div>
				<button
					className="bg-[#ff6b6b] text-white px-4 py-2 rounded-lg w-64"
					onClick={handleGetWeather}
				>
					Get Weather
				</button>
			</div>
			)}
		</div>
	)
}

export default FormInputs