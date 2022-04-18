import axios from 'axios';
import { SearchResult } from 'leaflet-geosearch/src/providers/provider';

const service_url = "https://nominatim.openstreetmap.org/reverse?format=json";
const API_KEY = null; // if too many calls are made you need to provide an email to avoid access denied

export interface GeoLocationResult extends SearchResult { };

export const searchReverseLocation = async ({ latitude, longitude, zoom = 18 }): Promise<GeoLocationResult> => {
    let url = `${service_url}&lat=${latitude}&lon=${longitude}&zoom=${zoom}`;
    url = API_KEY ? `${url}&key=${API_KEY}` : url;
    try {
        const response = await axios.get(url);
        console.log(response.data);
        return {
            x: response.data.lon,
            y: response.data.lat,
            label: response.data.display_name,
            bounds: response.data.boundingbox,
            raw: response.data
        }
    } catch (error) {
        console.error(error);
        return error.toString();
    }
}
