import express from 'express';
import deserializeUser from '../utils/deserializeUser';
import { requireUser } from '../utils/requireUser';
import { loginHandler, logoutHandler } from '../controllers/auth.controller';
import { createUserHandler } from '../controllers/user.controller';
import validate from '../middleware/validateResource';
import { createUserSchema, loginUserSchema } from '../schema/user.schema';

const auth = express.Router();

// Register user route
auth.post('/create', validate(createUserSchema), createUserHandler);

// Login user route
auth.post('/login', validate(loginUserSchema), loginHandler);

auth.use(deserializeUser, requireUser);

// Logout User
auth.get('/logout', logoutHandler);

export default auth;
