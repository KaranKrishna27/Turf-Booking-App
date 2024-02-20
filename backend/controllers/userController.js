const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');

const getAllUsers = asyncHandler(async (req, res) => {

  if (!req.user || !req.user.isAdmin) {
    res.status(403).json({ message: 'Permission denied. Admin access required.' });
    return;
  }

  const users = await User.find({});
  res.json(users);
});
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
 

  if (password !== confirmPassword) {
    res.status(400).json({ message: 'Passwords do not match' });
    return;
  }
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User Already Exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    confirmPassword,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Error Occurred!');
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    email,
  });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid Email or Password!');
  }
});
const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: 'karan27@anything.com' });

    if (!adminExists) {
      await User.create({
        name: 'Admin',
        email: 'karan27@anything.com',
        password: 'admin', 
        confirmPassword: 'admin', 
        isAdmin: true,
      });
      console.log('Admin seeded successfully.');
    }
  } catch (error) {
    console.error('Error seeding admin user:', error);
  }
};



module.exports = { registerUser, authUser, seedAdmin, getAllUsers };
