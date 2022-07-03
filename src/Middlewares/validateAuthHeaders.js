import {  db, ObjectId } from '../db/mongoConfig.js';

async function validateAuthHeaders (req, res, next) {
    const { authorization } = req.headers;

    const token = authorization?.replace('Bearer ', '');

    if(!token) return res.sendStatus(401);
    

    const session = await db.collection("sessions").findOne({ token });
   
    if (!session) {
        return res.sendStatus(401);
    }

    res.locals.session = session;

    console.log(req.body)
    next();
}

export default validateAuthHeaders;