import express from 'express';
import cors from 'cors';
import joi from 'joi';
import {  db, ObjectId } from '../db/mongoConfig.js';


export async function saveRecordForUser (req, res) {

    const session = res.locals.session;
    const data = req.body;
    console.log(data);
    const registerSchema = joi.object({
        type: joi.string().valid('entrada', 'saida').required(),
        value: joi.string().required(),
        description: joi.string().required()
    });

    const validate = registerSchema.validate(data);

    if(validate.error) {
        return res.sendStatus(422);
    }

    const user = await db.collection("users").findOne({ 
        _id: session.userId 
    })
    
    if(user) {
        const date = new Date();
        await db.collection("registers").insertOne({...data, date: `${date.getDate()}/${date.getMonth()}`, userId: user._id});
        res.sendStatus(201);
    } else {
        res.sendStatus(401);
    }
}

export async function getAllRecordsForUser (req, res) {

    const session = res.locals.session;
    const user = await db.collection("users").findOne({ 
        _id: session.userId 
    })
  
    if(user) {
        const userData = await db.collection("registers").find({userId: user._id}).toArray();
        const filteredUserData = userData.map(({_id, userId, ...data}) => {return data});
        
        res.status(200).send(filteredUserData);
    } else {
        res.sendStatus(401);
    }
}