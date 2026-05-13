import express from 'express';
import { getUserWorkspace, addMember } from '../controller/workspaceController/index.js';

const workspaceRouter = express.Router();

workspaceRouter.get("/", getUserWorkspace)

workspaceRouter.post("/add-member", addMember)

export default workspaceRouter;