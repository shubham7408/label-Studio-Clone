
import jwt from 'jsonwebtoken';

const SECRET_KEY = 'LableStudioReplica';

export const valid_user = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    // console.log(token);
    if (!token) {
        return res.status(403).json({ error: 'Access denied. No token provided.' });
    }
    try {
        const verified = jwt.verify(token, SECRET_KEY);
        req.user = verified;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid or expired token.' });
    }
};

export const valid_manager = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(403).json({ error: 'Access denied. No token provided.' });
    }
    try {
        const verified = jwt.verify(token, SECRET_KEY);
        req.user = verified; 
        if (req.user.role !== 'manager') {
            return res.status(403).json({ error: 'Access denied. Only managers can access this route.' });
        }
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid or expired token.' });
    }
};


export const valid_admin = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(403).json({ error: 'Access denied. No token provided.' });
    }
    try {
        const verified = jwt.verify(token, SECRET_KEY);
        req.user = verified;
        //  console.log(req.user);
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied. Only admins can access this route.' });
        }
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid or expired token.' });
    }
};

