const JWT = require("jsonwebtoken");

async function createToken(user) {
    const payload = {
        user_id: user._id,
        name: user.name,
        email: user.email,
    };

    const token = JWT.sign(payload, process.env.SECRET_KEY, { expiresIn: '1h' }); // Token expiry added
    return token;
}

async function verifyToken(token) {
    const Payload = JWT.verify(token, process.env.SECRET_KEY); // Ensure using process.env.SECRET_KEY
    return Payload;
}

module.exports = { createToken, verifyToken };
