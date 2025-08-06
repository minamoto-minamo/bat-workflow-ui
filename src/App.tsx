import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PageBase from './pages/PageBase';

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<PageBase />} />
			</Routes>
		</Router>
	);
}

export default App;
