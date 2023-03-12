
import axios from 'axios';

export default axios.create({
	baseURL: '/api/',
	headers : {
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Expires': '0',
	}
});