const { Sequelize } = require('sequelize');
const User  = require('../model/UserModel');
const app=require("../index")
const fetch = require('node-fetch');
require('dotenv').config();
describe('Auth test suite', () => {
    // Initialize Sequelize
    const sequelize = new Sequelize({
        dialect: 'mysql',
        host: process.env.DB_HOST,
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
    });
    

    beforeAll(async () => {
        // Connect to the database
        await sequelize.authenticate();

        // Delete users with email "test2@example.com"
        // await User.destroy({
        //     where: {
        //         email: 'test2@example.com'
        //     }
        // });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    test('Register API', async () => {
        const response = await fetch('http://localhost:3000/api/v1/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: 'John Does',
                mobile:"999874781",
                email: 'test3@example.com',
                password: 'JohnDoes142',
                isAdmin: true,
                role:"Admin"
            })
        });

        const data = await response.json();
        console.log("code",data.code);

        expect(data.code).toBe(200);
        expect(data.message).toBe('User Register Successfully');
        
    }, 10000);

    
    test('Login', async () => {
        const response = await fetch('http://localhost:3000/api/v1/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'test3@example.com',
                password: 'JohnDoes142'
            })
        });

        const data = await response.json();
        console.log(data.code);

        expect(data.code).toBe(200);
        expect(data.message).toBe('User Login Successfully');
    }, 10000);
});