import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';

export const authMiddleware = async (req, res, next) => {
    let token;
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ msg: 'No token, authorization denied' });
        }
        
        token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Tambahkan properti username dan email jika ada dalam token
        req.user = {
            id: decoded.user.id,
            username: decoded.user.username || null,
            email: decoded.user.email || null,
            role: decoded.user.role || null,
        };

        next();
    } catch (err) {
        console.error(err.message);
        res.status(401).json({ msg: 'Token is not valid' });
    }
};


export const adminMiddleware = (req, res, next) => {
    if (req.user.role !== 'Admin') {
        return res.status(403).json({ msg: 'Access denied' });
    }
    next();
};

export const superAdminMiddleware = (req, res, next) => {
    if (req.user.role !== 'Superadmin') {
        return res.status(403).json({ msg: 'Access denied' });
    }
    next();
};
