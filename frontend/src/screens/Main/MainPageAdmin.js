import React, { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './mainpageadmin.css';
import {
  CssBaseline,
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
} from '@mui/material';

const defaultTheme = createTheme();

function MainPageAdmin() {
  const [editedCards, setEditedCards] = useState([]);
  const [newTurf, setNewTurf] = useState({ name: '', description: '', imageURL: '' });

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

  const handleAddTurf = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/turfs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTurf),
      });
      if (!response.ok) {
        throw new Error('Failed to add turf');
      }
      const data = await response.json();
      setEditedCards([...editedCards, data]);
      setNewTurf({ name: '', description: '', imageURL: '' });
    } catch (error) {
      console.error('Error adding turf:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/turfs/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete turf');
      }
      setEditedCards(editedCards.filter((card) => card._id !== id));
      console.log(`Deleted card with ID: ${id}`);
    } catch (error) {
      console.error('Error deleting turf:', error);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Header />
      <main>
        <Box className="add-turf-container" pt={8} pb={6} px={3}>
          <Container maxWidth="md">
            <Typography variant="h4" className="add-turf-title" gutterBottom>
              Add New Turf
            </Typography>
            <Box className="add-turf-inputs" gap={2} alignItems="center" marginBottom="16px">
              <TextField
                label="Name"
                value={newTurf.name}
                onChange={(e) => setNewTurf({ ...newTurf, name: e.target.value })}
              />
              <TextField
                label="Description"
                value={newTurf.description}
                onChange={(e) => setNewTurf({ ...newTurf, description: e.target.value })}
              />
              <TextField
                label="Image URL"
                value={newTurf.imageURL}
                onChange={(e) => setNewTurf({ ...newTurf, imageURL: e.target.value })}
              />
              <Button variant="contained" onClick={handleAddTurf} className="add-turf-btn">
                Add Turf
              </Button>
            </Box>
          </Container>
        </Box>

        <Container py={8} maxWidth="md">
          <Grid container spacing={4}>
            {editedCards.map((card) => (
              <Grid item key={card._id} xs={12} sm={6} md={4}>
                <Card className="turf-card">
                  <img src={card.imageURL} alt='' />
                  <CardContent className="turf-card-content">
                    <Typography gutterBottom variant="h5" className="turf-card-title" component="h2">
                      {card.name}
                    </Typography>
                    <Typography className="turf-card-description">{card.description}</Typography>
                  </CardContent>
                  <Button onClick={() => handleDelete(card._id)} className="turf-card-btn">Delete</Button>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
      <Box bgcolor="background.paper" p={6} component="footer">
        {/* Footer */}
      </Box>
      <Footer />
    </ThemeProvider>
  );
}

export default MainPageAdmin;
