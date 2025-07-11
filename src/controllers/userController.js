const userService = require('../services/userService');
const Friendship = require('../models/Friendship');
const { validationResult } = require('express-validator');

const register = async (req, res) => {
  try {
    const { user, token } = await userService.register(req.body);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' ? true : false,
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      maxAge: 3600000,
      path: '/',
    });
    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user,
      token
    });
  } catch (error) {
    res.status(error.message.includes('ya existe') ? 400 : 500).json({
      message: 'Error al registrar el usuario',
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { user, token } = await userService.login(req.body);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' ? true : false,
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      maxAge: 3600000,
      path: '/',
    });
    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      user,
      token
    });
  } catch (error) {
    res.status(error.message.includes('incorrectos') ? 401 : 500).json({
      message: 'Error al iniciar sesión',
      error: error.message,
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await userService.getUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error al listar usuarios', error: error.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await userService.getUserProfile(req.user.userId);
    res.json(user);
  } catch (error) {
    res.status(error.message.includes('no encontrado') ? 404 : 500).json({
      message: 'Error al obtener el perfil del usuario',
      error: error.message,
    });
  }
};

const sendFriendRequest = async (req, res) => {
  try {
    await userService.sendFriendRequest(req.user.userId, req.params.recipientId);
    res.status(200).json({ message: 'Solicitud de amistad enviada exitosamente' });
  } catch (error) {
    res.status(error.message.includes('no encontrado') || error.message.includes('a ti mismo') || error.message.includes('Ya son amigos') || error.message.includes('pendiente') ? 400 : 500).json({
      message: 'Error al enviar solicitud de amistad',
      error: error.message,
    });
  }
};

const acceptFriendRequest = async (req, res) => {
  try {
    await userService.acceptFriendRequest(req.user.userId, req.params.requesterId);
    res.status(200).json({ message: 'Solicitud de amistad aceptada exitosamente' });
  } catch (error) {
    res.status(error.message.includes('no encontrada') ? 404 : 500).json({
      message: 'Error al aceptar solicitud de amistad',
      error: error.message,
    });
  }
};

const rejectFriendRequest = async (req, res) => {
  try {
    await userService.rejectFriendRequest(req.user.userId, req.params.requesterId);
    res.status(200).json({ message: 'Solicitud de amistad rechazada exitosamente' });
  } catch (error) {
    res.status(error.message.includes('no encontrada') ? 404 : 500).json({
      message: 'Error al rechazar solicitud de amistad',
      error: error.message,
    });
  }
};

const removeFriend = async (req, res) => {
  try {
    await userService.removeFriend(req.user.userId, req.params.friendId);
    res.status(200).json({ message: 'Amigo eliminado exitosamente' });
  } catch (error) {
    res.status(error.message.includes('no encontrada') ? 404 : 500).json({
      message: 'Error al eliminar amigo',
      error: error.message,
    });
  }
};

const getFriends = async (req, res) => {
  try {
    const friends = await userService.getFriends(req.user.userId);
    res.status(200).json(friends);
  } catch (error) {
    res.status(500).json({ message: 'Error al listar amigos', error: error.message });
  }
};

const getPendingRequests = async (req, res) => {
  try {
    const requests = await userService.getPendingRequests(req.user.userId);
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error al listar solicitudes pendientes', error: error.message });
  }
};

const logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    path: '/',
  });
  res.status(200).json({ message: 'Cierre de sesión exitoso' });
};

const getPendingRequestsCount = async (req, res) => {
  try {
    const userId = req.user.userId;
    const pendingCount = await Friendship.countDocuments({
      recipient: userId,
      status: 'pending',
    });
    res.status(200).json({ pendingCount });
  } catch (error) {
    console.error('Error al obtener el conteo de solicitudes pendientes:', error);
    res.status(500).json({ message: 'Error al obtener el conteo de solicitudes pendientes', error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.user || !req.user.userId) {
      console.error('req.user no definido o sin id:', req.user);
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    const { phone, email, city, profilePicture } = req.body;

    const updatedUser = await userService.updateProfile(req.user.userId, {
      phone,
      email,
      city,
      profilePicture,
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Error in userController.updateProfile:', {
      message: error.message,
      stack: error.stack,
      requestBody: req.body,
      user: req.user,
    });
    if (error.message === 'The email is already in use') {
      return res.status(400).json({ error: error.message });
    }
    if (error.message === 'User not found') {
      return res.status(404).json({ error: error.message });
    }
    if (error.message === 'Invalid profile picture URL') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: `Error updating profile: ${error.message}` });
  }
};
const redeemPoints = async (req, res) => {
  try {
    const { option, points } = req.body;
    const userId = req.user.userId;
    const result = await userService.redeemPoints(userId, option, points);
    res.status(200).json({ message: 'Puntos canjeados exitosamente', result });
  } catch (error) {
    res.status(error.message.includes('insuficientes') ? 400 : 500).json({
      message: 'Error al canjear puntos',
      error: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  getUsers,
  getUserProfile,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
  getFriends,
  getPendingRequests,
  logout,
  getPendingRequestsCount,
  updateProfile,
  redeemPoints,
};