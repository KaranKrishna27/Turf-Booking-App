import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { CssBaseline, Box, Container, Grid, Card, CardActions, Typography, Button } from '@mui/material';
import ViewTurf from '../View/ViewTurf';
import './MainPage.css'


const defaultTheme = createTheme();

const MainPageUser = ({ userData }) => {
  const [editedCards, setEditedCards] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null); 
  const location = useLocation();
  const navigate= useNavigate();

  useEffect(() => {
    fetchTurfs();
  }, []);

  const fetchTurfs = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/turfs');
      if (!response.ok) {
        throw new Error('Failed to fetch turfs');
      }
      const data = await response.json();
      setEditedCards(data);
    } catch (error) {
      console.error('Error fetching turfs:', error);
    }
  };

  const handleBook = (id) => {
    console.log('Selected Card ID:', id);
    // Implement book functionality here
    setSelectedTime(id); // Set the selected turf ID
    navigate('/viewturf', { state: { turfId: id } });
  };

  return (
    <div className='App'>
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Header />
      <main>
        <Box
          sx={{
            bgcolor: 'background.paper',
            pt: 8,
            pb: 6,
          }}
        >
          {/* Content */}
        </Box>
        <Container sx={{ py: 8 }} maxWidth="md">
          <Grid container spacing={4}>
            {editedCards.map((card) => (
             <Grid item key={card._id} xs={12} sm={6} md={4} className="card-container">
             <Card className="card">
               <img src={card.imageURL} alt={`Image for ${card.name}`} />
               <div className="card-content">
                 <Typography variant="h5" className="card-title">{card.name}</Typography>
                 <Typography className="card-description">{card.description}</Typography>
                 <Button className="book-now-btn" size="small" onClick={() => handleBook(card._id)}>Book Now</Button>
               </div>
             </Card>
           </Grid>
            ))}
          </Grid>
        </Container>
      </main>
      <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
        {/* Footer */}
      </Box>
      <Footer />
    </ThemeProvider>
    {selectedTime && <ViewTurf userData={userData} viewId={selectedTime} />} 
     </div>
  );
}  
export default MainPageUser;
