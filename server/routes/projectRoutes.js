
import express from 'express'
import {createProject, updateProject, addMember} from '../controller/projectControler/projectController.js'

const projectRouter = express.Router();

projectRouter.post("/", createProject)

projectRouter.put("/", updateProject)

projectRouter.post("/:projectId/addMember", addMember)

export default projectRouter;