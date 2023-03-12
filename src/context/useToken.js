import { useState } from 'react';

/**
 * based on https://www.digitalocean.com/community/tutorials/how-to-add-login-authentication-to-react-applications
 * @returns a custom token
 */
export default function useToken() {
  const getToken = () => {
    const tokenString = sessionStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    // console.log('useToken', tokenString, userToken);
    return userToken
  };

  const [token, setToken] = useState(getToken());

  const saveToken = userToken => {
    /**
     * Go under App -> Session storage
     * 
     */
    // console.log('saveToken', userToken);
    if(!userToken){
      sessionStorage.removeItem('token');
      window.location.reload();
    } else {
      sessionStorage.setItem('token', JSON.stringify(userToken));
      setToken(userToken);
    }
  };

  return {
    setToken: saveToken,
    token: token
  }
}