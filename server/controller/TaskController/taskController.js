import prisma from "../../lib/prisma.js";
import { inngest } from "../../inngest/index.js";

export const createTask = async(req, res) => {
  try{
    const { userId } = await req.auth();

    const {
     projectId,
     title,
     description,
     type,
     status,
     priority,
     assigneeId,
     due_date
    } = req.body;

    const project = await prisma.project.findUnique({
      where: {
       id: projectId
      },
      include: {
        members:{
         include: {
          user: true
         }
        }
      } 
    })

    if(!project){
     return res.status(404).json({
      message: "Projeto não encontrado"
     })
    }

    if(project.team_lead !== userId){
      return res.status(404).json({
      message: "voce não tem permissão"
     })
    }

    if(assigneeId){
      const isMember = project.members.find((member) => 
       member.user.id === assigneeId
    );

     if(!isMember){
      return res.status(400).json({
      message: "Usuario não e membro do projeto"
     })
     }
    }

    const task = await prisma.task.create({
      data: {
       projectId,
       title,
       description,
       type,
       status,
       priority,
       assigneeId,
       due_date: new Date(due_date)
      }
    });

    const taskWithAssignee = await prisma.task.findUnique({
      where: {
        id: task.id
      },
      include: {
        assignee: true
      }
    })

     await inngest.send({
      name: "app/task.assigned",
      data: {
        taskId: task.id, origin
      }
     })
    return res.json({task: taskWithAssignee, message: "Task criada com sucesso"})

  }catch(error){
    console.log(error)
     return res.status(500).json({
      message: error.message || error.code
     })
  }
}

export const updateTask = async(req, res) => {
  try{
     const task = await prisma.task.findUnique({
       where: {
        id: req.params.id
       }
     })

     if(!task){
       return res.status(404).json({
        message: "tarefa não encontrada"
       })
     }

    const { userId } = await req.auth();

    const project = await prisma.project.findUnique({
      where: {
       id: task.projectId
      },
      include: {
        members:{
         include: {
          user: true
         }
        }
      } 
    })

    if(!project){
     return res.status(404).json({
      message: "Projeto não encontrado"
     })
    }

    if(project.team_lead !== userId){
      return res.status(404).json({
      message: "voce não tem permissão"
     })
    }

     const updatedTask = await prisma.task.update({
       where: {
        id: req.params.id
       },
       data: req.body,
     })

    return res.json({task: updateTask, message: "Task atualizada com sucesso"})

  }catch(error){
    console.log(error)
     return res.status(500).json({
      message: error.message || error.code
     })
  }
}

export const deleteTask = async(req, res) => {
  try{
     
    const { userId } = await req.auth();
    const {tasksId} = req.body;
    const tasks = await prisma.task.findMany({
     where: {
        id: tasksId
     }
    })

     if(tasks.length === 0){
      return res.status(404).json({
      message: "task não encontrada"
     })
     }

    const project = await prisma.project.findUnique({
      where: {
       id: tasks[0].projectId
      },
      include: {
        members:{
         include: {
          user: true
         }
        }
      } 
    })

    if(!project){
     return res.status(404).json({
      message: "Projeto não encontrado"
     })
    }

    if(project.team_lead !== userId){
      return res.status(404).json({
      message: "voce não tem permissão"
     })
    }

      await prisma.task.deleteMany({
        where: {
          id: tasksId
        }
      })

     return res.json({ message: "Task deletada com sucesso"})

  }catch(error){
    console.log(error)
     return res.status(500).json({
      message: error.message || error.code
     })
  }
}