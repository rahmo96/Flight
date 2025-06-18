import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Flights from './pages/Flights';
import Booking from './pages/Booking';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/" element={<Home />} />
        <Route path="/flights" element={<Flights />} />
        <Route path="/booking/:id" element={<Booking />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
