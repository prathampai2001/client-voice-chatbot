


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './UserLogin';
import Registration from './Register';
import Interface from './Interface';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/home" element={<Interface />} />
      </Routes>
    </Router>
  );
}

export default App;
