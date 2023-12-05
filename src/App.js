import React from 'react';
import LandingPage from './LandingPage'; // adjust the path according to your project structure
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

function App() {
  return (
    <div className="App" style={{ backgroundColor: '#F5F5F5', height: '100vh' }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <LandingPage />
      </LocalizationProvider>
    </div>
  );
}

export default App;