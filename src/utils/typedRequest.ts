export default function request<TResponse>(
	url: string,
	config: RequestInit = {}
  ): Promise<TResponse> {
	try {
		return fetch(url, config)
	  .then((response) => response.json())
	  .then((data) => data as TResponse)
	  .catch((error) => {
		console.error(error);
		throw new Error();
	  });
	} catch (error) {
		console.error(error);
		throw new Error();
	}	
}
