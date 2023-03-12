// import Register from './Register';
import { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './otherPages/login/Login';
import Register from './otherPages/login/Register';
import NoPage from './otherPages/NoPage';
import Dashboard from './components/Dashboard';
import Test from './components/Test';
import AuthContext from './context/AuthProvider';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const { token } = useContext(AuthContext);

  return (
		<main className="App">
			<Router>
				<Routes>
					{/* <Route path="/" exact element={<Register />} /> */}
					<Route path="/login" element={token ? <Navigate to="/dashboard"/> :<Login />} />
					<Route path="/register" element={token ? <Navigate to="/dashboard"/> :<Register />} />
					<Route path="/dashboard" element={token ? <Dashboard /> :<Navigate to="/login" />} />
					<Route path="/test" element={<Test/>} />
					<Route path="/" element={!token ? <Navigate to="/login" /> : <Navigate to="/dashboard"/>} />
					<Route path="*" element={<NoPage />} />
				</Routes>
			</Router>
		</main>
	);
}

export default App;
