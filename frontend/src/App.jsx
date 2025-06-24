import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Flights from './pages/Flights';
import Booking from './pages/Booking';
import PersonalArea from './pages/PersonalArea'
function App() {
  return (
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
        <Route path="/" element={<Home />} />
        <Route path="/index" element = {<Home />} />
            <Route path="/flights" element={<Flights />} />
            <Route path="/booking/:flight_number" element={<Booking />} />
            <Route path="/personalarea" element={<PersonalArea />}/>
          </Routes>
      </BrowserRouter>
  );
}

export default App;
