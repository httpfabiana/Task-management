import { useState } from "react";
import { useSelector } from "react-redux";
import {Users,Search,UserPlus,FolderKanban,CheckSquare} from "lucide-react";
import InviteMemberDialog from "@/components/InviteMemberDialog/InviteMemberDialog";
import {Card,CardContent,CardHeader,CardTitle,} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";


const Team = () => {
  const currentWorkspace = useSelector((state) => state.workspace.currentWorkspace)
  const projects = currentWorkspace?.projects || []

  const [searchTerm, setSearchTerm] = useState("")
  const [openDialog, setOpenDialog] = useState(false)

   const users = currentWorkspace?.members || []

   const tasks =
    currentWorkspace?.projects?.flatMap(
    (project) => project.tasks || []
   ) || []

   const filteredUsers = users.filter((item) => {
    const name = item.user?.name?.toLowerCase() || "";

    const email = item.user?.email?.toLowerCase() || "";

    const search = searchTerm.toLowerCase();

    return (
      name.includes(search) || email.includes(search)
    )
  })

  const activeProjects = projects.filter(
   (project) => project.status !== "COMPLETED" && project.status !== "CANCELLED"
  ).length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
     <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-bold">
          Equipe
        </h1>

        <p className="text-sm text-muted-foreground">
          Gerencie seus membros
        </p>
      </div>

      <Button onClick={() => setOpenDialog(true)}>
        <UserPlus className="w-4 h-4 mr-2"/>
        Convidar membro
      </Button>

      <InviteMemberDialog isDialogOpen={openDialog} setIsDialogOpen={setOpenDialog}/>
     </div>

     <div className="grid gap-4 md:grid-cols-3">
      <Card>
      <CardContent className='p-5 flex justify-between items-center'>
       <div>
        <p className="text-sm text-muted-foreground">
          Membros
        </p>
        <h2 className="text-2xl font-bold">
          {users.length}
        </h2>
       </div>

       <Users className="w-5 h-5"/>
      </CardContent>
      </Card>

      <Card>
      <CardContent className='p-5 flex justify-between items-center'>
       <div>
        <p className="text-sm text-muted-foreground">
          Projetos ativos
        </p>
        <h2 className="text-2xl font-bold">
          {activeProjects}
        </h2>
       </div>

       <FolderKanban className="w-5 h-5"/>
      </CardContent>
      </Card>

     <Card>
      <CardContent className='p-5 flex justify-between items-center'>
       <div>
        <p className="text-sm text-muted-foreground">
          Tarefa
        </p>
        <h2 className="text-2xl font-bold">
          {tasks.length}
        </h2>
       </div>
       <CheckSquare className="w-5 h-5"/>
      </CardContent>
     </Card>
     </div>

     <div className="relative max-w-md">
      <Search className="absolute left-3 top-2 w-4 h-4 text-muted-foreground"/>
      <Input
       placeholder='Pesquise membros...'
       value={searchTerm}
       onChange={(e) => setSearchTerm(e.target.value)}
       className='pl-9'
      />
     </div>

     <Card>
      <CardHeader>
        <CardTitle>Membros da equipe</CardTitle>
      </CardHeader>

      <CardContent>
       {filteredUsers.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Nenhum membro encontrado
        </p>
       ) : (
        filteredUsers.map((item) => (
         <div key={item.id} className="flex items-center justify-between border rounded-lg p-4">
         <div className="flex items-center gap-3">
          <img
           src={item.user.image}
           alt=""
           className="w-10 h-10 rounded-full"
          />

          <div>
            <p className="font-medium">
             {item.user.name}
            </p>
            <p className="text-sm text-muted-foreground">
              {item.user.email}
            </p>
          </div>
         </div>

         <Badge variant='secondary'>
          {item.role}
         </Badge>
         </div>
        ))
       )}
      </CardContent>
     </Card>
    </div>
  )
}

export default Team