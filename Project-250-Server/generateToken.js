const jwt = require('jsonwebtoken');

const generateToken = ({id,role})=>{
    return jwt.sign({id:id,role:role},process.env.JWT_KEY,{
        expiresIn: '3d'
    });
};

module.exports = generateToken;
