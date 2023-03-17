import React, { useRef } from 'react';

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

	const handleGetLatLng = () => {
		setLoading(true);
		const address = addressRef.current?.value || '';

		if (!address) {
			alert('Please enter an address');
			setLoading(false);
			return;
		}
		console.log(address)
		request<Address>(`http://localhost:3000/api/getLatLng`, {
			method: 'POST',
			body: JSON.stringify({ address: address })
		})
		.then(data => {
			console.log(data)
			if (data.latitude && latRef.current) {
				latRef.current.value = data.latitude.toString();
			}
			if (data.longitude && lngRef.current) {
				lngRef.current.value = data.longitude.toString();
			}
		})
		.catch(err => {
			console.log(err);
		})
		.finally(() => {
			setLoading(false);
		})
		

	}

	const handleGetWeather = () => {
		setLoading(true);
		const lat = latRef.current?.value || '';
		const lng = lngRef.current?.value || '';
	
		const error = validateLatitude(lat) || validateLongitude(lng);
		if (error) {
			alert(error);
			setLoading(false);
			return;
		}

		request<Forecast>(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=temperature_2m_max,temperature_2m_min&timezone=Africa%2FCairo`)
		.then(data => {
			setTemperatures(data.daily);
		})
		.catch(err => {
			console.log(err);
		})
		.finally(() => {
			setLoading(false);
		})
		
	}

	return (
		<div className="detail flex flex-col items-center">
			<div className="coords mb-5">
				<input
					type="text"
					name="latitude"
					placeholder="Latitude"
					ref={latRef}
					onBlur={(e) => {
						const error = validateLatitude(e.target.value);
						if (error) {
							console.log(error)
						}
					}}
					className="w-64 mr-5 px-4 py-2 rounded-lg" 
				/>
				<input
					type="text"
					name="longitude"
					placeholder="Longitude"
					ref={lngRef}
					onBlur={(e) => {
						const error = validateLongitude(e.target.value);
						if (error) {
							alert('Format is incorrect');
						}
					}}
					className="w-64 px-4 py-2 rounded-lg" 
				/>
				
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
					className="bg-[#ff6b6b] text-white px-4 py-2 rounded-lg basis=1/3"
					onClick={handleGetLatLng}
				>
					Get Coords
				</button>
			</div>
			
			{ loading ?
				<Spinner /> :
				<button
					className="bg-[#ff6b6b] text-white px-4 py-2 rounded-lg w-64"
					onClick={handleGetWeather}
				>
					Get Weather
				</button>
			}
		</div>
	)
}

export default FormInputs