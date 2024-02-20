import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ViewTurf from './screens/View/ViewTurf';
import LandingPage from './screens/Landingpage/LandingPage';
import SignUp from './screens/SignUp/SignUp';
import SignIn from './screens/SignIn/SignIn';
import MainPageUser from './screens/Main/MainPageUser';
import MainPageAdmin from './screens/Main/MainPageAdmin';
import PayPal from './components/Paypal/paypal'
import './App.css'


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/mainpageuser" element={<MainPageUser />} />
        <Route path="/mainpageadmin" element={<MainPageAdmin />} />
        <Route path="/viewturf" element={<ViewTurf />} />
        <Route path="/payment" element={<PayPal/>} />
      </Routes>
    </Router>
  );
};

export default App;
