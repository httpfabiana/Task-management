
import prisma from "../../lib/prisma.js";

export const createProject = async(req, res) => {
  try{
    const {userId} = await req.auth();

    const {
      workspaceId,
      name,
      description,
      status,
      priority,
      start_date,
      end_date,
      team_members,
      team_lead,
      progress
    } = req.body;

    const workspace = await prisma.workspace.findUnique({
      where:{
        id: workspaceId
      },
      include:{
        members: {
         include: {
          user: true,
         }
        }
      }
    })

    if(!workspace){
      return req.status(404).json({
        message: "Workspace não encontrado"
      })
    }

    const isAdmin = workspace.members.some((member) => member.userId === userId && member.role === 'ADMIN')

    if(!isAdmin){
        return req.status(404).json({
        message: "Voce não tem permissão"
      })
    }

    let teamLeadId = null;

    if(team_lead){
     const teamLead = await prisma.user.findUnique({
      where:{
        email: team_lead
      },
      select:{
        id: true
      }
     })

     teamLeadId = teamLead?.id || null;
    }

    const project = await prisma.project.create({
      data: {
       workspaceId,
       name,
       description,
       status,
       priority,
       progress,
       team_lead: teamLeadId,
       start_date: end_date ? new Date(start_date) : null,
       end_date: end_date ? new Date(end_date) : null,
      }
    });

    if(team_members?.length > 0) {
     const membersToAdd = workspace.members.filter((member) => 
     team_members.includes(member.user.email)
    )
     .map((member) => ({
       projectId: project.id,
       userId: member.user.id
     }))
     if(membersToAdd.length > 0) {
       await prisma.projectMember.createMany({
        data: membersToAdd
       })
     }
    }

    const projectWithMembers = await prisma.project.findUnique({
      where: {
        id: project.id
      },
      include: {
        owner: true,

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
    })

    return res.json({
      project: projectWithMembers, 
      message: "Projeto criado com sucesso"
    })

  }catch(error){
    console.log(error)
    res.status(500).json({message: error.code || error.message})
  }
}


export const updateProject = async(req, res) => {
  try{
    const { userId} = await req.auth();

    const {
      id,
      workspaceId,
      name,
      description,
      status,
      priority,
      progress,
      start_date,
      end_date
    } = req.body;

    const workspace = await prisma.workspace.findUnique({
      where:{
        id: workspaceId
      },

      include:{
        members:{
         include: {
          user: true
         }
        }
      }
    })

    if(!workspace){
      return res.status(404).json({
       message: "workspace não encontrado"
     })
    }

    const isAdmin = workspace.members.some((member) => 
      member.userId === userId && member.role === "ADMIN"
    );

    const project = await prisma.project.findUnique({
      where: {
        id
      }
    })

    if(!project){
     return res.status(404).json({
       message: "projeto não encontrado"
     })
    }

    if(!isAdmin && project.team_lead !== userId){
     return res.status(404).json({
       message: "voce não tem permissão"
     })
    }

    const updatedProject = await prisma.project.update({
      where: {
        id
      },
      data: {
        workspaceId,
        name,
        description,
        status,
        priority,
        progress,
        start_date: start_date ? new Date(start_date) : null,
        end_date: end_date ? new Date(end_date) : null
      }
    })

    return res.json({
      project: updateProject, message: "Projeto atualizado com sucesso"
    })

  }catch(error){
    console.log(error)
    res.status(500).json({message: error.code || error.message})
  }
}


export const addMember = async(req, res) => {
  try{
    const { userId } = await req.auth();

    const { projectId} = req.params;
    const {email} = req.body;

    const project = await prisma.project.findUnique({
     where: {
       id: projectId
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
        message: "projeto não encontrado"
      })
    }

    if(project.team_lead !== userId){
      return res.status(404).json({
        message: "Voce não tem permissão"
      })


    }

    const user = await prisma.user.findUnique({
     where: {
       email
     }
    })

    if(!user){
      return res.status(404).json({
        message: "usuario não encontrado"
      })
    }

    const memberExists = project.members.find((member) => 
     member.user.email === email
    )

    if(memberExists){
     return res.status(404).json({
        message: "usuario ja e membro do projeto"
      })
    }

    const member = await prisma.projectMember.create({
      data: {
       userId: user.id,
       projectId
      }
    })

    return res.json({member, message: "Membro adicionado com sucesso"})

  }catch(error){
    console.log(error)
    res.status(500).json({message: error.code || error.message})
  }
}