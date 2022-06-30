import express from 'express';
import cors from 'cors';
import joi from 'joi';
import {  MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;
mongoClient.connect().then(() => {
    db = mongoClient.db(process.env.MONGO_DATABASE);
})

app.post('/signup', async (req, res) => {

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
    
});

app.post('/signin', async (req, res) => {

    try {
        
    } catch (error) {
        return res.status(500).send(error);
    }


});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server started on port " + PORT));