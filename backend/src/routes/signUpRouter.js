const express = require("express");
const router = express.Router();
const signUpController = require("../controllers/signUpController");

// 이메일 인증
router.post("/auth", signUpController.auth);
router.post("/authcheck", signUpController.emailCheck);

// 회원가입 및 로그인
router.post("/signup_or_login", signUpController.signUpOrLogin);

module.exports = router;