const crypto = require("crypto");
const { hashPassword } = require("../utils/cryptoUtils");
const pool = require("../../config/databaseSet");

const findUserByEmail = async (email) => {
  try {
    const [rows] = await pool.query("SELECT * FROM user WHERE user_email = ?", [email]);
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error("Error finding user by email:", error);
    throw error;
  }
};

const signUp = async (username, nickname, email, password) => {
  try {
    const [existingUsers] = await pool.query("SELECT * FROM user WHERE user_email = ?", [email]);

    if (existingUsers.length > 0) {
      return { success: false, error: "이미 등록된 이메일입니다." };
    }

    const user_salt = crypto.randomBytes(32).toString("hex");
    const hashedPassword = hashPassword(password, user_salt);

    const [result] = await pool.query("INSERT INTO user (user_name, user_nickname, user_email, user_password, user_salt, role) VALUES (?, ?, ?, ?, ?, 0)", [username, nickname, email, hashedPassword, user_salt]);

    if (result.affectedRows > 0) {
      return { success: true, id: result.insertId };
    } else {
      return { success: false, error: "회원가입에 실패했습니다." };
    }
  } catch (error) {
    console.error("Error signing up:", error);
    return { success: false, error: "서버 에러가 발생했습니다." };
  }
};

module.exports = { findUserByEmail, signUp };