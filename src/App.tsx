import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import BasePage from './pages/BasePage'

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<BasePage />} />
			</Routes>
		</Router>
	)
}

export default App
