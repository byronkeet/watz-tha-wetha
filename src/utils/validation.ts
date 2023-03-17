const LATITUDE_PATTERN = /^-?([1-8]?\d(\.\d{1,6})?|90(\.0{1,6})?)$/;
const LONGITUDE_PATTERN = /^-?((1[0-7]|[1-9])?\d(\.\d{1,6})?|180(\.0{1,6})?)$/;

export const validateLatitude = (value: string) => {
	if (!LATITUDE_PATTERN.test(value)) {
		return 'Invalid latitude value';
	}
}

export const validateLongitude = (value: string) => {
	if (!LONGITUDE_PATTERN.test(value)) {
		return 'Invalid longitude value';
	}
}
