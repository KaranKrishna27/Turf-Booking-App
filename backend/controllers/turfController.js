const Turf = require('../models/TurfSchema');


exports.createTurf = async (req, res) => {
  try {
    const { name, description, imageURL } = req.body;
    const newTurf = new Turf({ name, description, imageURL });
    await newTurf.save();
    res.status(201).json(newTurf);
  } catch (error) {
    console.error('Error creating turf:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getAllTurfs = async (req, res) => {
  try {
    const turf = await Turf.find();
    res.status(200).json(turf);
  } catch (error) {
    console.error('Error getting turfs:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.getTurfById = async (req, res) => {
  try {
    const turf = await Turf.findById(req.params.id);
    if (!turf) {
      return res.status(404).json({ message: 'Turf not found' });
    }
    res.status(200).json(turf);
  } catch (error) {
    console.error('Error getting turf by ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateTurf = async (req, res) => {
  try {
    const { name, description, imageURL } = req.body;
    const updatedTurf = await Turf.findByIdAndUpdate(
      req.params.id,
      { name, description, imageURL },
      { new: true }
    );
    if (!updatedTurf) {
      return res.status(404).json({ message: 'Turf not found' });
    }
    res.status(200).json(updatedTurf);
  } catch (error) {
    console.error('Error updating turf:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteTurf = async (req, res) => {
  try {
    const deletedTurf = await Turf.findByIdAndDelete(req.params.id);
    if (!deletedTurf) {
      return res.status(404).json({ message: 'Turf not found' });
    }
    res.status(200).json({ message: 'Turf deleted successfully' });
  } catch (error) {
    console.error('Error deleting turf:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createTurf: exports.createTurf,
  getAllTurfs: exports.getAllTurfs,
  getTurfById: exports.getTurfById,
  updateTurf: exports.updateTurf,
  deleteTurf: exports.deleteTurf,
};