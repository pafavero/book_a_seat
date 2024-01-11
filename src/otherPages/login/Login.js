import { useRef, useState, useEffect, useContext } from 'react';
import AuthContext from '../../context/AuthProvider';
import styled from 'styled-components';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Postit from '../../components/Postit'

import axios from '../../api/axios';
const SERVER_URL =  process.env.REACT_APP_SERVER_URL;
const LOGIN_URL =  SERVER_URL + 'api/login';

const ElementStyle = styled.div`
  {
    margin-top: 2rem;
    text-align: left;
  }

  section {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 1rem;
    border: 1px solid rgba(0, 0, 0, 0.4);
  }

  form {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    flex-grow: 1;
    padding-bottom: 1rem;

    label, button {
      margin-top: 0.6rem;
    }
  }

  .wrapper_gif{
    margin-top: 12rem;
    border: 1px solid rgba(0, 0, 0, 0.4);
  }

`;

const Login = () => {
	const { setToken } = useContext(AuthContext);
	const userRef = useRef();
	const errRef = useRef();

	const [user, setUser] = useState('user1');
	const [pwd, setPwd] = useState('');
	const [errMsg, setErrMsg] = useState('');
	const [success, setSuccess] = useState(false);

	useEffect(() => {
    userRef.current.focus();
	}, []);

	useEffect(() => {
    setErrMsg('');
	}, [user, pwd]);

	const handleSubmit = async (e) => {
    e.preventDefault();

		try {
			const response = await axios.post(
				LOGIN_URL,
				JSON.stringify({ user, pwd }),
				{
					headers: {
            'Content-Type': 'application/json',
          },
					withCredentials: true,
				}
			);
			const accessToken = response?.data?.token;
			if (!accessToken) {
        setErrMsg('Login or password wrong...');
				setSuccess(false);
			}else{
				const role = response?.data?.role;
				// console.log({ user, role, accessToken });
				setToken({ user, role, accessToken });
				setUser('');
				setPwd('');
				setSuccess(true);
			}
			
		} catch (err) {
			if (!err?.response) {
        setErrMsg('No Server Response');
			} else if (err.response?.status === 400) {
				setErrMsg('Missing Username or Password');
			} else if (err.response?.status === 401) {
				setErrMsg('Unauthorized');
			} else {
				setErrMsg('Login Failed');
			}
		}
	};

	return (
		<ElementStyle>
      <section>
        {errMsg && (
        <Alert key="danger" variant="danger"
          ref={errRef}
          className={errMsg ? 'errmsg' : 'offscreen'}
        >
          {errMsg}
        </Alert>
        )}
        <h1>Sign In</h1>
        <form onSubmit={handleSubmit} className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            ref={userRef}
            autoComplete="off"
            onChange={(e) => setUser(e.target.value)}
            value={user}
            required
            className="form-control"
          />

          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPwd(e.target.value)}
            value={pwd}
            // required
            className="form-control"
          />
          <Button type="submit">Sign In</Button>
        </form>
        <p>
          Need an Account?
          <br />
          <span className="line">
            <a href="/register">Sign Up</a>
          </span>
        </p>
      </section>
      <Postit/>

      <img className="wrapper_gif"  src={require('./img2_readme.gif')} alt="Prototype video" />
		</ElementStyle>
	);
};

export default Login;