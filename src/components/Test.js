
import styled from 'styled-components';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

import axios from '../api/axios';

const ElementStyle = styled.div`
	button{
		display: block;
		margin-top: 20px;
	}

`;

const SERVER_URL =  process.env.REACT_APP_SERVER_URL;
const TEST_URL =  SERVER_URL + 'api/hello';
const Test = () => {

	const handleTest1 = async (e) => {
    try {
			const response = await axios.post(
				TEST_URL,
				{},
				{
					headers: {
                        'Content-Type': 'application/json',
                        "Access-Control-Allow-Origin": "*",
                        "accepts":"application/json",
                        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
                    },
					withCredentials: true,
				}
			);
			const data = response?.data;
			console.log(data);
		} catch (err) {
			console.log('=>> err', err);
		}
	};

	const handleTest2 = async (e) => {
		try {
				const response = await axios.get(
					TEST_URL,
					{},
					{
						headers: {
            'Content-Type': 'application/json',
            },
						withCredentials: true,
					}
				);
				const data = response?.data;
				console.log(data);
			} catch (err) {
				console.log('=>> err', err);
			}
		};

	return (
		<ElementStyle>
      <section>
        <h1>Test....</h1>
        <div className="">
          <Button onClick={handleTest1} >test 1 - post</Button>
          <Button onClick={handleTest2} >test 2 - get</Button>
        </div>
      </section>
		</ElementStyle>
	);
};

export default Test;