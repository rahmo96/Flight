import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Flights from './pages/Flights';
import Booking from './pages/Booking';
import Homepage from './pages/Homepage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/" element={<Homepage />} />
        <Route path="/index" element = {<Home />} />
        <Route path="/flights" element={<Flights />} />
        <Route path="/booking/:flight_number" element={<Booking />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
