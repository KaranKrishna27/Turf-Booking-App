import React, { useState, useEffect } from 'react'; 
import { useLocation, useNavigate } from "react-router-dom";
import './styles.css'


const PayPal = function ({ onSuccessPayment }) {

  const [paid, setPaid] = useState(false); 
  const [error, setError] = useState(null);
  const paypalRef = React.useRef();
  const location = useLocation();
  const bookingData = location.state && location.state.bookingData;
  const navigate = useNavigate();
  const bookingID = location.state.bookingID;
  const [paymentSuccessful, setPaymentSuccessful] = useState(false);

useEffect(() => {
  const handleBeforeUnload = async function(event) {
    try {
      const deleteResponse = await fetch(`http://localhost:5000/api/bookings/${bookingID}`, {
        method: 'DELETE',
      });
      if (deleteResponse.ok) {
        console.log('Booking data deleted successfully.');
      } else {
        console.error('Failed to delete booking data.');
      }
    } catch (error) {
      console.error('Error deleting booking data:', error);
    }

    const message = 'Your booking has been canceled because you are navigating away from the page.';
    alert(message);
  };

  window.addEventListener('beforeunload', handleBeforeUnload);

  return () => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
  };
}, [bookingID]);


  const handleNavigateBack = () => {
    navigate('/mainpageuser');
  }
  const handlePaymentError = async () => {
    setError(true); 
    try {
            console.log(bookingID);
            const deleteResponse = await fetch(`http://localhost:5000/api/bookings/${bookingID}`, {
              method: 'DELETE',
            });
            if (deleteResponse.ok) {
              console.log('Booking data deleted successfully due to payment failure.');
            } else {
              console.error('Failed to delete booking data.');
            }
          } catch (error) {
            console.error('Error deleting booking data:', error);
          }
  }

  const handleDownload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 500;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

     ctx.font = 'bold 24px Arial';
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    ctx.fillText('Your Turf', canvas.width / 2, 40);

    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`User Email: ${bookingData.userEmail}`, 10, 80);
    ctx.fillText(`Type: ${bookingData.type}`, 10, 110);
    ctx.fillText(`Date: ${bookingData?.bookingDate?.toLocaleDateString()}`, 10, 140);
    ctx.fillText(`Time: ${bookingData.startTime} - ${bookingData.endTime}`, 10, 170);
    ctx.fillText(`Booking ID: ${bookingID}`, 10, 200);

    ctx.font = 'italic 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Thank you for booking!', canvas.width / 2, canvas.height - 20);

    const image = canvas.toDataURL('image/png');

    const link = document.createElement('a');
    link.href = image;
    link.setAttribute('download', 'booking_details.png');
    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };
  const handlePaymentSuccess = () => {
    setPaymentSuccessful(true);
  };

  useEffect(() => {
    window.paypal
      .Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            intent: 'CAPTURE',
            purchase_units: [
              {
                description: 'Your description',
                amount: {
                  currency_code: 'USD',
                  value: 1.0,
                },
              },
            ],
          });
        },
        onApprove: async (data, actions) => {
          const order = await actions.order.capture();
          setPaid(true);
          console.log(order);
          handlePaymentSuccess();
        },
        onError: (err) => {
          setError(true); 
          console.error(err);
          handlePaymentError();
        },
      })
      .render(paypalRef.current);
  }, []);

  if (paid) {
    return (
      <div className='paypal'>
        <div className='booking-details-card'>
          <h2>Booking Details</h2>
          <p><strong>User Email:</strong> {bookingData.userEmail}</p>
          <p><strong>Type:</strong> {bookingData.type}</p>
          <p><strong>Date:</strong> {bookingData?.bookingDate?.toLocaleDateString()}</p>
          <p><strong>Time:</strong> {bookingData.startTime} - {bookingData.endTime}</p>
          <p><strong>Booking ID:</strong> {bookingID}</p>
          <p>Thank you for booking!</p>
          <button onClick={handleDownload}>Download Booking Details</button><br/><br/>
          <button onClick={handleNavigateBack}>Back to Main Page</button>
        </div>
        <div>Payment successful!</div>
      </div>
    );
  }

  if (error) {
    return <div>Error Occurred in processing payment.! Please try again.</div>;

  }

  return (
    <div className='paypal-container'>
      <h4>PAY HERE</h4>
      <div className='paypal' ref={paypalRef} />
    </div>
  );
}
export default PayPal;