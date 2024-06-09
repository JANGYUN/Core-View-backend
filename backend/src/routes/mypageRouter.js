const express = require('express');
const userController = require('../controllers/mypageController');
const { authenticateSession } = require('../middleware/authmiddleware');
const router = express.Router();

// 마이페이지 접근에 authenticateSession 미들웨어 추가
router.get('/:username', authenticateSession, userController.getUser.bind(userController));

module.exports = router;