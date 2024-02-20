import React, { useState, useEffect, useCallback, memo } from 'react';
import './ViewTurf.css';
import { useNavigate, useLocation } from 'react-router-dom'; 
import Header from '../../components/Header/Header';


const ViewTurf = memo(({ viewId, onSuccessPayment  }) => {
  const [selectedStartTime, setSelectedStartTime] = useState('');
  const [selectedEndTime, setSelectedEndTime] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [totalAmount, setTotalAmount] = useState('');

  const navigate = useNavigate();
  const [bookedTimeSlots, setBookedTimeSlots] = useState({
    turf1: [],
    turf2: [],
    turf3: [],
  });
  const location = useLocation();
  const { turfId } = location.state || {}; 
  const userData = localStorage.getItem('userInfo') && JSON.parse(localStorage.getItem('userInfo'));


  console.log('User ID:', userData?._id);
  console.log('User Email:', userData?.email);

  const dates = generateDateOptions();
  const timeSlots = generateTimeSlots(selectedDate, selectedStartTime);
  

  useEffect(() => {
    console.log('Selected Turf ID:', location.state.turfId);
  }, []);

  const handleSuccessPayment = useCallback(() => {
    handleBookClick(); 
  }, []);


  const calculateTotalAmount = useCallback(
    (start, end, type) => {
      if (!start || !end || !type) {
        return 'Select start time, end time, and type';
      }
  
      let startHour = parseInt(start.split(':')[0]);
      let endHour = parseInt(end.split(':')[0]);
  
   
      if (startHour > endHour || (startHour === 23 && endHour === 0)) {
        endHour += 24; 
      }
  
      const hours = endHour - startHour; 
      const rate = type === '5s' ? 1000 : type === '6s' ? 1200 : 0;
  
      const totalAmount = hours * rate;
  
      return `Total Amount: Rs${totalAmount}`;
    },
    []
  );
  

  useEffect(() => {
    if (selectedStartTime && selectedEndTime && selectedType) {
      setTotalAmount(calculateTotalAmount(selectedStartTime, selectedEndTime, selectedType));
    }
  }, [selectedStartTime, selectedEndTime, selectedType, calculateTotalAmount]);

  const handleSelectStartTime = (time) => {
    setSelectedStartTime(time);
    setSelectedEndTime(''); 
    setTotalAmount(''); 
  };

  const handleSelectEndTime = (time) => {
    setSelectedEndTime(time);
    setTotalAmount(''); 
  };

  const handleSelectType = (type) => {
    setSelectedType(type);
  };

  const handleSelectDate = (date) => {
    console.log('Selected date:', date);
    setSelectedDate(date);
  };
  useEffect(() => {
    const fetchBookedTimeSlots = async (turfId) => {
      try {
        if (!selectedDate || !turfId) {
          return;
        }
        const response = await fetch(`http://localhost:5000/api/bookings?date=${encodeURIComponent(selectedDate)}&turfId=${turfId}`);
        console.log('Selected date:', selectedDate);
        console.log('Selected id:', turfId);
        if (response.ok) {
          const data = await response.json();
          setBookedTimeSlots(prevState => ({
            ...prevState,
            [turfId]: data.bookings,
          }));
        } else {
          console.error('Failed to fetch booked time slots');
        }
      } catch (error) {
        console.error('Error fetching booked time slots:', error);
      }
    };

    if (selectedDate && turfId) {
      fetchBookedTimeSlots(turfId);
    }
  }, [selectedDate, turfId]);
  const handleBookClick = async () => {
    console.log('handleBookClick called');
   try {
    if (!bookedTimeSlots[turfId]) {
      console.error('Booked time slots data not available yet.');
      return;
    }
    const isSlotBooked = bookedTimeSlots[turfId].some(slot => {
      return (
        (selectedStartTime >= slot.startTime && selectedStartTime < slot.endTime) ||
        (selectedEndTime > slot.startTime && selectedEndTime <= slot.endTime) ||
        (selectedStartTime <= slot.startTime && selectedEndTime >= slot.endTime)
      );
    });
    if (isSlotBooked) {
      const bookedSlots = bookedTimeSlots[turfId].map(slot => `${slot.startTime} - ${slot.endTime}`).join('\n');
      console.log('Booking failed: Slot already booked');
      console.log('Booked slots:', bookedSlots);
      alert(`This time slot (${selectedStartTime} - ${selectedEndTime}) is already booked.\n\nBooked slots:\n${bookedSlots}`);
      return;
    }

      const userEmail = userData ? userData.email : '';
      const userId = userData ? userData._id : '';
  
      const bookingData = {
        startTime: selectedStartTime,
        endTime: selectedEndTime,
        type: selectedType,
        userId: userId,
        userEmail: userEmail,
        bookingDate: new Date(selectedDate),
        turfId: turfId,
      };
  
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });
  
      if (response.ok) {
        const responseData = await response.json();
        const bookingID = responseData.bookingId;
        navigate('/payment', { state: { bookingData, bookingID } });
        console.log('Booking ID:', bookingID);
        console.log('Booking successful');
      } else {
        console.error('Failed to create booking:', response.statusText);
      }
    } catch (error) {
      console.error('Error booking turf:', error);
    }
  };
  

  const calculateHours = (start, end) => {
    const startHour = parseInt(start.split(':')[0]);
    const endHour = parseInt(end.split(':')[0]);
    const startMinutes = parseInt(start.split(':')[1]);
    const endMinutes = parseInt(end.split(':')[1]);

    const totalHours = endHour - startHour + (endMinutes - startMinutes) / 60;
    return totalHours;
  };

  function generateDateOptions() {
    const today = new Date();
    const nextDay = new Date(today);
    nextDay.setDate(nextDay.getDate() + 1);
    const dayAfterNext = new Date(today);
    dayAfterNext.setDate(dayAfterNext.getDate() + 2);
  
    const formattedToday = formatDate(today);
    const formattedNextDay = formatDate(nextDay);
    const formattedDayAfterNext = formatDate(dayAfterNext);
  
    return [formattedToday, formattedNextDay, formattedDayAfterNext];
  }
  
  function generateTimeSlots(selectedDate, selectedStartTime) {
    const timeSlots = [];
    const currentDate = new Date();
    const currentHour = selectedStartTime ? parseInt(selectedStartTime.split(':')[0]) : 0;
    const startHour = currentHour > 22 ? currentHour : 0;
  
    for (let hour = startHour; hour < 24; hour++) {
      const time = `${hour.toString().padStart(2, '0')}:00`;
      if (selectedDate === formatDate(currentDate)) {
        timeSlots.push(time);
      } else {
        timeSlots.push(`${time}`);
      }
    }
  
    if (currentHour === 23) {
      timeSlots.push(`00:00`);
    }
  
    return timeSlots;
  }
  
  function formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }



  return (
    <div>
      <Header/>
    <div className="view-turf-container">
      <h3 className="view-turf-header">Book {viewId}</h3>
      <div className="date-selection">
        <h4>Select Date:</h4>
        <select
  className="select-dropdown"
  value={selectedDate}
  onChange={(e) => handleSelectDate(e.target.value)}
>
  <option value="">Choose</option>
  {dates.map((date) => (
    <option key={date} value={date}>
      {date}
    </option>
  ))}
</select>

      </div>
      <div className="type-selection">
          <h4>Select Type:</h4>
          <button
            className={`type-button ${selectedType === '5s' ? 'selected' : ''}`}
            onClick={() => handleSelectType('5s')}
          >
            5's
          </button>
          <button
            className={`type-button ${selectedType === '6s' ? 'selected' : ''}`}
            onClick={() => handleSelectType('6s')}
          >
            6's
          </button>
        </div>
      <div className="time-selection">
        <h4>Select Start Time:</h4>
        <select
          className="select-dropdown"
          value={selectedStartTime}
          onChange={(e) => handleSelectStartTime(e.target.value)}
        >
          <option value="">Choose</option>
          {timeSlots.map((time, index) => (
  <option key={`${time}-${index}`} value={time}>
    {time}
  </option>
))}


        </select>
      </div>
      <div>
        <h4>Select End Time:</h4>
        <select
          className="select-dropdown"
          value={selectedEndTime}
          onChange={(e) => handleSelectEndTime(e.target.value)}
          disabled={!selectedStartTime}
        >
          <option value="">Choose</option>
          {selectedStartTime &&
            timeSlots
              .slice(timeSlots.indexOf(selectedStartTime) + 1)
              .map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
        </select>
      </div>
      <div className="result-container">
        {selectedStartTime && selectedEndTime && selectedType && (
          <div className="displayed-info">
            <p>Selected Time Range: {selectedStartTime} to {selectedEndTime}</p>
            <p>Selected Type: {selectedType}</p>
            <br />
            <p className="total-amount">{totalAmount}</p>
          </div>
        )}
        {selectedEndTime && bookedTimeSlots[turfId] && (
          <button className="book-button" onClick={handleBookClick}>
            Book Now
          </button>
        )}
      </div>
      
    </div>
  </div>
  );  
})

export default ViewTurf;
