const { validationResult } = require('express-validator');
const User = require('../models/user');
const ZoomLink = require('../models/zoomLink');
const jwt = require('jsonwebtoken');

exports.checkAuth = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token)
    return res.status(403).json({ message: 'AuthError: Missing Token' });
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_ACCESS_SECRET, {
      algorithms: ['HS256'],
    });
  } catch (error) {
    return res.status(401).json({ message: 'AuthError: Token Invalid' });
  }
  if (!decodedToken)
    return res.status(401).json({ message: 'AuthError: Token Invalid' });

  const user = await User.findById(decodedToken.user_id);

  if (user == 'Fail')
    return res.status(500).json({ message: 'AuthError: Fail' });

  if (user == 'Not Found')
    return res.status(404).json({ message: 'AuthError: User not found' });

  if (user?.passChangeTime > decodedToken.iat)
    return res.status(401).json({ message: 'AuthError: Password Changed' });

  if (!user?.isAdmin)
    return res.status(403).json({ message: 'AuthError: Not an admin' });
  req.user = user;
  next();
};

exports.getSystemSummary = async (req, res, next) => {
  const numOfUnapprovedUsers = await User.getNumOfUnapprovedUsers();
  const numOfApprovedUsers = await User.getNumOfApprovedUsers();
  const numOfLinks = await ZoomLink.getNumOfLinks();
  if (
    numOfApprovedUsers == 'Fail' ||
    numOfUnapprovedUsers == 'Fail' ||
    numOfLinks == 'Fail'
  )
    return res.status(500).json({ message: 'Error' });
  return res.status(200).json({
    message: 'Success',
    numOfUnapprovedUsers: numOfUnapprovedUsers,
    numOfApprovedUsers: numOfApprovedUsers,
    numOfLinks: numOfLinks,
  });
};

exports.getUnapprovedUsers = async (req, res, next) => {
  const result = await User.getUsers(0);
  if (result == 'Fail') return res.status(500).json({ message: 'Fail' });
  return res.status(200).json({
    message: 'Success',
    users: result,
  });
};

exports.getApprovedUsers = async (req, res, next) => {
  const result = await User.getUsers(1);
  if (result == 'Fail') return res.status(500).json({ message: 'Fail' });
  return res.status(200).json({
    message: 'Success',
    users: result,
  });
};

exports.getZoomLinks = async (req, res, next) => {
  const result = await ZoomLink.getLinks();
  if (result == 'Fail') return res.status(500).json({ message: 'Fail' });
  return res.status(200).json({
    message: 'Success',
    links: result,
  });
};

exports.getUser = async (req, res, next) => {
  const result = await User.findById(req.params.user_id);
  if (result == 'Not Found')
    return res.status(404).json({ message: 'User not found' });

  if (result == 'Fail') return res.status(500).json({ message: 'Fail' });

  return res.status(200).json({
    message: 'Success',
    user: result,
  });
};

exports.putEditUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json({ message: 'Vaildate Error' });

  const { fname, lname, email, user_id } = req.body;

  const user = new User(user_id);
  user.setFname(fname);
  user.setLname(lname);
  user.setEmail(email);

  const result = await user.save(1);
  if (result == 'Fail' || !result)
    return res.status(500).json({ message: 'Fail' });
  if (result == 'Email Error')
    return res.status(409).json({ message: 'Email Error' });
  if (result == 'User Not Found')
    return res.status(404).json({ message: 'User Not Found' });
  return res.status(201).json({ message: 'Success' });
};

exports.putChangeUserPassword = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json({ message: 'Vaildate Error' });

  const { password, user_id } = req.body;

  const user = new User(user_id);
  const result = await user.changePassword(password);

  if (result == 'Fail' || !result)
    return res.status(500).json({ message: 'Fail' });

  if (result == 'User Not Found')
    return res.status(404).json({ message: 'User Not Found' });

  return res.status(201).json({ message: 'Success' });
};

exports.deleteUser = async (req, res, next) => {
  const user = new User(req.body.user_id);
  const deleted = await user.deleteById();
  if (deleted == 'Fail' || !deleted)
    return res.status(500).json({ message: 'Fail' });
  if (deleted == 'User Not Found')
    return res.status(404).json({ message: 'User Not Found' });
  return res.status(201).json({ message: 'Success' });
};

exports.putApproveUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json({ message: 'Vaildate Error' });

  if (parseInt(req.body.approve)) {
    const result = await User.approveUser(req.body.user_id);
    if (result == 'Fail') return res.status(500).json({ message: 'Fail' });
    if (result == 'User Not Found')
      return res.status(404).json({ message: 'User Not found' });
    return res.status(201).json({ message: 'Success' });
  }

  const user = new User(req.body.user_id);
  const result = await user.deleteById();
  if (result == 'Fail') return res.status(500).json({ message: 'Fail' });
  if (result == 'User Not Found')
    return res.status(404).json({ message: 'User Not found' });
  return res.status(201).json({ message: 'Success' });
};

exports.getAssignedLinks = async (req, res, next) => {
  const user = new User(req.params.user_id);
  const links = await user.getAssignedLinks();
  if (links == 'Fail') return res.status(500).json({ message: 'Fail' });
  return res.status(200).json({ message: 'Success', links: links });
};

exports.getUnassignedLinks = async (req, res, next) => {
  const user = new User(req.params.user_id);
  const links = await user.getUnassignedLinks();
  if (links == 'Fail') return res.status(500).json({ message: 'Fail' });
  return res.status(200).json({ message: 'Success', links: links });
};

exports.postAssignLink = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json({ message: 'Vaildate Error' });

  const user_id = req.body.user_id;
  const link = req.body.link_id;
  const user = new User(user_id);
  const assign = await user.assignLink(link);

  if (assign == 'Fail') return res.status(500).json({ message: 'Fail' });
  if (assign == 'Not Found')
    return res.status(404).json({ message: 'Link or User not Found' });

  return res.status(201).json({ message: assign });
};

exports.deleteUnassignLink = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json({ message: 'Vaildate Error' });

  const user_id = req.body.user_id;
  const link = req.body.link_id;
  const user = new User(user_id);
  const unassign = await user.unAssignLink(link);

  if (unassign == 'Fail') return res.status(500).json({ message: 'Fail' });

  return res.status(200).json({ message: unassign });
};

exports.putSaveZoomURL = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json({ message: 'Vaildate Error' });
  const link = new ZoomLink(req.body.link_id);
  link.setUrl(req.body.url);
  const result = await link.saveUrl();
  if (result == 'Fail' || !result)
    return res.status(500).json({ message: 'Fail' });
  if (result == 'Link Not Found')
    return res.status(404).json({ message: 'Link Not Found' });
  return res.status(201).json({ message: 'Success' });
};

exports.getAssignedUsers = async (req, res, next) => {
  const link = new ZoomLink(req.params.link_id);
  const users = await link.getAssignedUsers();
  if (users == 'Fail') return res.status(500).json({ message: 'Fail' });
  return res.status(200).json({ message: 'Success', links: users });
};

exports.getUnassignedUsers = async (req, res, next) => {
  const link = new ZoomLink(req.params.link_id);
  const users = await link.getUnassignedUsers();
  if (users == 'Fail') return res.status(500).json({ message: 'Fail' });
  return res.status(200).json({ message: 'Success', links: users });
};

exports.postAssignUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json({ message: 'Vaildate Error' });

  const link_id = req.body.link_id;
  const link = new ZoomLink(link_id);
  const assign = await link.assignUser(req.body.user_id);
  if (assign == 'Fail') return res.status(500).json({ message: 'Fail' });
  if (assign == 'Not Found')
    return res.status(404).json({ message: 'Link or User not Found' });

  return res.status(201).json({ message: assign });
};

exports.deleteUnassignUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json({ message: 'Vaildate Error' });
  const user_id = req.body.user_id;
  const link_id = req.body.link_id;
  const link = new ZoomLink(link_id);

  const unassign = await link.unassignUser(user_id);
  if (unassign == 'Fail') return res.status(500).json({ message: 'Fail' });

  return res.status(200).json({ message: unassign });
};
