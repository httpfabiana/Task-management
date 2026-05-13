
import { Inngest } from "inngest";
import prisma from '../lib/prisma.js'
import sendEmail from "../configs/nodemailer.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "project-management" });

const syncUserCreation = inngest.createFunction(
  {
    id: "sync-user-from-clerk",
    triggers: [{ event: "clerk/user.created"}],
  },

  async({ event }) => {
    const { data } = event
    await prisma.user.create({
     data: {
      id: data.id,
      email: data?.email_addresses[0]?.email_address,
      name: data?.first_name + " " + data?.last_name,
      image: data?.image_url
     }
    })
  }
)

const syncUserDeletion = inngest.createFunction(
   {
    id: "delete-user-with-clerk",
    triggers: [{ event: "clerk/user.deleted"}],
  },

  async({ event }) => {
    const { data } = event
    await prisma.user.delete({
     where: {
       id: data.id,
     }
    })
  }
)

const syncUserUpdation = inngest.createFunction(
   {
    id: "update-user-from-clerk",
    triggers: [{ event: "clerk/user.updated"}],
  },

  async({ event }) => {
    const { data } = event
    await prisma.user.update({
     where: {
      id: data.id,
     },
     data: {
      email: data?.email_addresses[0]?.email_addresses,
      name: data?.first_name + " " + data?.last_name,
      image: data?.image_url
     }
    })
  }
)

const syncWorkspaceCreation = inngest.createFunction(
   {
    id: "sync-workspace-from-clerk",
    triggers: [{ event: "clerk/organization.created"}],
   },

  async({ event }) => {
   const { data } = event;
    await prisma.workspace.create({
     data: {
       id: data.id,
       name: data.name,
       slug: data.slug,
       ownerId: data.created_by,
       image_url: data.image_url
     }
    })

     await prisma.workspaceMember.create({
       data: {
        userId: data.created_by,
        workspaceId: data.id,
        role: "ADMIN"
       }
     })
  }
)

const syncWorkspaceUpdation = inngest.createFunction(
   {
    id: "sync-workspace-updated-from-clerk",
    triggers: [{ event: "clerk/organization.uptaded"}],
   },

   async ({ event }) => {
    const { data } = event;
    await prisma.workspace.update({
      where: {
        id: data.id
      },
      data: {
       name: data.name,
       slug: data.slug,
       image_url: data.image_url
      }
    })
   }
)

const syncWorkspaceDeletion = inngest.createFunction(
  {
    id: "sync-workspace-deleted-from-clerk",
    triggers: [{ event: "clerk/organization.deleted"}],
   },
   
   async ({ event }) => {
    const { data } = event;
    await prisma.workspace.delete({
     where: {
       id: data.id
     }
    })
   }
)

const syncWorkspaceMemberCreation = inngest.createFunction(
  {
    id: "sync-workspace-member-from-clerk",
    triggers: [{ event: "clerk/organizationInvitation.accepted"}],
   },

   async({ event }) => {
    const { data } = event;
    await prisma.workspaceMember.create({
     data: {
       userId: data.user_id,
       workspaceId: data.organization_id,
       role: String(data.role_name).toUpperCase(),
     }
    })
   }
)

 const sendTaskAssignmentEmail = inngest.createFunction(
   {
    id: "send-task-assignment-email",
    triggers: [{ event: "app/task.assigned"}],
   },
   async({event, step}) => {
    const {taskId, origin} = event.data;
    const task = await prisma.task.findUnique({
      where: {
        id: taskId
      },
      include: {
        assignee: true,
        project: true
      },
    })
     await sendEmail({
      to: task.assignee.email,
      subject: `Nova task atribuida no no ${task.project.name}`,
      body: `ola ${task.assignee.name}` `${task.title}`
         `${new Date(task.due_date).toLocaleDateString()}
          <a href=${origin}>View Task</a>
         `
     })

     if(new Date(task.due_date).toLocaleDateString() !== new Date().toLocaleDateString()){
      await step.sleepUntil('wait-for-the-due-date', new Date(task.due_date))

      await step.run('check-if-task-is-completed', async() => {
        const task = await prisma.task.findUnique({
          where: {
            id: taskId
          },
          include: {
            assignee: true,
            project: true
          }
        })
        if(!task) return;

        if(task.status !== "DONE"){
          await step.run('send-task-reminder-mail', async() => {
            await sendEmail({
              to: task.assignee.email,
              subject: `Reminder for ${task.project.name}`,
              body: ` <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
    
                       <h2>Task Reminder 📌</h2>

                      <p>Hello ${task.assignee.name},</p>

                    <p>
                      This is a reminder for your pending task.
                    </p>

             <div style="background: #f4f4f4; padding: 15px; border-radius: 8px;">
              <p><strong>Task:</strong> ${task.project.name}</p>
              <p><strong>Description:</strong> ${task.description}</p>
              <p><strong>Due Date:</strong> ${new Date(task.due_date).toLocaleDateString()}</p>
            </div>

            <p style="margin-top: 20px;">
              Please review and complete this task before the due date.
            </p>

           <small>
            TaskFlow Team 🚀
          </small>

           </div>`
            })
          })
        }
      })
     }
   }
 )

// Create an empty array where we'll export future Inngest functions
export const functions = [syncUserCreation, 
     syncUserDeletion, 
     syncUserUpdation,
     syncWorkspaceCreation,
     syncWorkspaceUpdation,
     syncWorkspaceDeletion,
     syncWorkspaceMemberCreation,
     sendTaskAssignmentEmail,
    ];