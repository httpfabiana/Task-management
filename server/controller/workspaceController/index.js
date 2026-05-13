import prisma from '../../lib/prisma.js'

export const getUserWorkspace = async(req, res) => {
  try{
    const { userId } = await req.auth();

    const workspaces = await prisma.workspace.findMany({
     where: {
      members: {
       some: {
        userId
       }
      }
     },
     include: {
      owner: true,

      members: {
       include: {
        user: true
       }
      },
      projects: {
       include: {
        members: {
         include: {
          user: true
         }
        },
        tasks: {
         include: {
         assignee: true,
         comments: {
          include: {
            user: true
          }
         }
         }
        }
       }
      }
     }
    })

    return res.json({workspaces})

  }catch(error){
    console.log(error);
    res.status(500).json({ message: error.code || error.message})
  }
}

export const addMember = async(req, res) => {
  try{
     const { userId } = await req.auth();
     const {email, role, workspaceId, message} = req.body;

     if(!workspaceId || !role){
      return res.status(400).json({ message: "Parametros obrigatorios ausente"})
     }

     if(!["ADMIN", "MEMBER"].includes(role)) {
      return res.status(400).json({
        message: "Role invalido"
      })
     }

     const user = await prisma.user.findUnique({
      where: {
        email
      }
     });

     if(!user){
       return res.status(404).json
       ({message: "Usuario não encontrado"
       })
     }

     const workspace = await prisma.workspace.findUnique({
       where: {
        id: workspaceId
       },
       include: {
        members: true
       }
     });

     if(!workspace) {
        return res.status(400).json({
        message: "Workspace não encontrado"
        })
     }

     const isAdmin = workspace.members.find((member) => member.userId === userId && member.role === "ADMIN")

     if(!isAdmin){
         return res.status(400).json({
         message: "Voce não tem permissão"
        })
     }

     const memberExists = workspace.members.find((member) => member.userId === user.id)

     if(memberExists){
      return res.status(400).json({
       message: "Usuario ja e membro"
      })
     }

     const member = await prisma.workspaceMember.create({
      data: {
        userId: user.id,
        workspaceId,
        role,
        message
      }
     })

     return res.json({
      member, message: "Membro adicionado com sucesso"
     })

  }catch(error){
    console.log(error);
    res.status(500).json({ message: error.code || error.message})
  }
}