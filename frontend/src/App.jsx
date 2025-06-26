import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Flights from './pages/Flights';
import Booking from './pages/Booking';
import MyBookings from './pages/MyBookings'
function App() {
  return (
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
        <Route path="/" element={<Home />} />
        <Route path="/index" element = {<Home />} />
            <Route path="/flights" element={<Flights />} />
            <Route path="/booking/:flight_number" element={<Booking />} />
            <Route path="/MyBookings" element={<MyBookings />}/>
          </Routes>
      </BrowserRouter>
  );
}

export default App;
