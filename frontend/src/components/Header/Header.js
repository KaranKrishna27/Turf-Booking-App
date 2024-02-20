import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useNavigate } from 'react-router-dom';
import UserBookings from './userBookings';
import './Header.css'

const userData = localStorage.getItem('userInfo') && JSON.parse(localStorage.getItem('userInfo'));

const Header = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [showBookings, setShowBookings] = useState(false);
  const isAdmin = userData?.isAdmin;
  const userId = userData?._id;
console.log(userId);
console.log(isAdmin);
  const fetchUserBookings = async () => {
    try {
      let url;
      if (isAdmin) {
        // If user is admin, fetch all bookings
        url = 'http://localhost:5000/api/bookings/all';
      } else {
        // If user is not admin, fetch bookings for the specific userId
        url = `http://localhost:5000/api/bookings/all?userId=${userId}`;
      }
  
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings);
      } else {
        console.error('Failed to fetch user bookings');
      }
    } catch (error) {
      console.error('Error fetching user bookings:', error);
    }
  };
  

  useEffect(() => {
    if (userId) {
      fetchUserBookings();
    }
  }, [userId]);
  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/');
  };

  const handleBookingsClick = () => {
    fetchUserBookings();
    setShowBookings(true);
  };

  const handleYourTurfClick = () =>{
    if (isAdmin) {
      navigate('/mainpageadmin');
    } else {
      navigate('/mainpageuser');
    }
  };
  const handleHomeClick = () =>{
    if (isAdmin) {
      navigate('/mainpageadmin');
    } else {
      navigate('/mainpageuser');
    }
  };

  return (
    <div className='header' style={{ backgroundColor: 'rgba(255, 255, 255, 255)' }}>
      <Navbar expand="lg" style={{ marginBottom: '0' }}>
        <Container fluid>
        <Navbar.Brand onClick={handleYourTurfClick}>Your TURF</Navbar.Brand>
          <Nav className="ml-auto">
            <Nav.Link onClick={handleHomeClick}>Home</Nav.Link>
            <NavDropdown title="Profile" id="navbarScrollingDropdown">
              <NavDropdown.Item onClick={handleBookingsClick}>Bookings</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Container>
      </Navbar>
      <Container fluid>
        <div style={{ marginTop: '20px' }}>
          {showBookings && <UserBookings bookings={bookings} />}
        </div>
      </Container>
    </div>
  );
};

export default Header;
