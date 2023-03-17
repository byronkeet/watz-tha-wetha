import type { NextApiRequest, NextApiResponse } from 'next';

interface GetLatLngBody {
	address: string;
}

export interface Address {
	latitude: number,
	longitude: number,
	type: string,
	name: string,
	number: string,
	postal_code: string,
	street: string,
	confidence: string,
	region: string,
	region_code: string,
	county: string,
	locality: string,
	administrative_area: string,
	neighbourhood: string,
	country: string,
	country_code: string,
	continent: string,
	label: string,
}
interface GetAddressData {
	data: Address[]
}

const getLatLng = async (req: NextApiRequest, res: NextApiResponse) => {
	const { address } = JSON.parse(req.body as string) as GetLatLngBody;

	const options = {
		access_key: process.env.POSITIONSTACK_API_KEY as string,
		query: address,
	};

	const queryUrl = 'http://api.positionstack.com/v1/forward?' + new URLSearchParams(options).toString();

	try {
		const response = await fetch(queryUrl);
		const data = await response.json() as GetAddressData;

		res.status(200);
		res.json(data.data[0]);
	} catch (err) {
		console.error(err);
		res.status(500);
		res.json({ err: 'failed'})
	}
}

export default getLatLng;