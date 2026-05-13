import prisma from "../../lib/prisma.js";


export const addComment = async(req, res) => {
  try{
    const {userId} = await req.auth();
    const { content, taskId} = req.body;

    const task = await prisma.task.findUnique({
     where: {
       id: taskId 
     }
    })

    const project = await prisma.project.findUnique({
      where: {
        id: task.projectId
      },
      include: {
       members: {
        include: {
         user: true
        }
       }
      }
    })

    if(!project){
      return res.status(404).json({
      message: "projeto não encontrada"
     })
    }

    const member = project.members.find((member) => 
     member.userId === userId
    )

    if(!member){
      return res.status(404).json({
      message: "Voce não e membro desse projeto"
     })  
    }

    const comment = await prisma.comment.create({
     data: {
       taskId,
       content,
       userId
     },
     include: {
       user: true
     }
    })

    req.json({comment})


  }catch(error){
    console.log(error)
     return res.status(500).json({
      message: error.message || error.code
     })
  }
}

export const getTaskComments = async(req, res) => {
  try{
    const { taskId } = req.params;

    const comments = await prisma.comment.findMany({
      where: {taskId},
      include: {
        user: true
      }
    })

    res.json({comments})

  }catch(error){
     console.log(error)
     return res.status(500).json({
      message: error.message || error.code
     })
  }
}