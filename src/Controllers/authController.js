import express from 'express';
import cors from 'cors';
import joi from 'joi';
import {  db, ObjectId } from '../db/mongoConfig.js';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { v4 as uuid} from 'uuid';

export async function signUpUser (req, res) {

    try {
        const userData = req.body;

        const userSignUpSchema = joi.object({
            name: joi.string().required(),
            email: joi.string().email().required(),
            password: joi.string().required()
        });

        const validateSignUp = userSignUpSchema.validate(userData);

        if(validateSignUp.error) {
            return res.sendStatus(422);
        }

        const findExistingEmail = await db.collection("users").findOne({email : userData.email});

        if(findExistingEmail){
            return res.status(302).send("Já existe usuário cadastrado!");
        }

        const hashedPassword = bcrypt.hashSync(userData.password, 10);

        await db.collection("users").insertOne({...userData, password: hashedPassword});
        res.status(201).send("Usuario cadastrado com sucesso!");

    } catch (error) {
        return res.status(500).send(error);
    }
    
}

export async function signInUser (req, res) {

    try {
        const userData = req.body;

        const userSignUpSchema = joi.object({
            email: joi.string().email().required(),
            password: joi.string().required()
        });

        const validateSignIn = userSignUpSchema.validate(userData);

        if(validateSignIn.error) {
            return res.sendStatus(422);
        }

        const accountData = await db.collection("users").findOne({email : userData.email});

        if(!accountData){
            return res.status(404).send("Não existe usuário cadastrado!");
        }

        const verificaSenhaInserida = bcrypt.compareSync(userData.password, accountData.password);

        if(!verificaSenhaInserida) {
            return res.status(401).send("Email ou senha incorretos!");
        }

        const token = uuid();
        console.log(token);

        await db.collection('sessions').insertOne({
            userId: accountData._id,
            token
        });
        
        return res.status(200).send(token);

    } catch (error) {
        return res.status(500).send(error);
    }
}

export async function logoutUser (req, res) {
    const { authorization } = req.headers;

    const token = authorization?.replace('Bearer ', '');
  
    if(!token) return res.sendStatus(401);
    

    const session = await db.collection("sessions").findOne({ token });
   
    if (!session) {
        return res.sendStatus(401);
    }
  
    const user = await db.collection("users").findOne({ 
        _id: session.userId 
    })
  
    if(user) {
        await db.collection("sessions").deleteOne({userId: user._id});
        res.sendStatus(201);
    } else {
        res.sendStatus(401);
    }
}