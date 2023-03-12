
import { createContext } from 'react';
import useToken from './useToken'

// https://www.makeuseof.com/react-context-api-tutorial/
const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {  // children e' un props
	const { token, setToken } =  useToken();

	return (
		<AuthContext.Provider value={{ token, setToken }}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthContext;