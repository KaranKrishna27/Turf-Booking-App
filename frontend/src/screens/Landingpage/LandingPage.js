
import React from 'react';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="LandingPage">
      <header className="LandingPage-header">
        <h1>Welcome to Your Turf</h1>
        <p>The All in One Booking Spot</p>

        
        <a href='/signup'>
          <button className='button2'>Sign Up</button>
        </a>
        <a href='/signin'>
          <button className='button1'>Sign In</button>
        </a>
      </header>
    </div>
  );
}

export default LandingPage;
