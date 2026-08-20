import { useState } from "react"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { format } from "date-fns"
import { ArrowRight, Calendar, Users, FolderOpen } from "lucide-react"
import CreateProjectDialog from "../createProjectDialog/createProjectDialog"
import { Card,CardHeader, CardTitle, CardContent } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"

const ProjectOverview = () => {
   const { currentWorkspace } = useSelector((state) => state.workspace)

   const [isDialogOpen, setIsDialogOpen] = useState(false)

   const projects = currentWorkspace?.projects || []

   const statusStyle = {
    PLANNING: "secondary",
    ACTIVE: "default",
    ON_HOLD: "outline",
    COMPLETED: "default",
    CANCELLED: "destructive"
}

  return (
   currentWorkspace && (
    <Card>
     <CardHeader className="flex justify-between">
      <CardTitle>Project Overview</CardTitle>

      <Link to="/projects" className="text-sm flex items-center gap-1 text-muted-foreground">
        Ver tudo
        <ArrowRight size={17}/>
      </Link>
     </CardHeader>

     <CardContent className="p-0">
     {projects.length === 0 ? (
      <div className="p-10 text-center space-y-4">
        <div className="w-14 h-14 mx-auto rounded-full bg-muted flex items-center justify-center">
          <FolderOpen size={28}/>
        </div>
        <p className="text-sm text-muted-foreground">
         Nenhum projeto ainda
        </p>

        <Button onClick={() => setIsDialogOpen(true)}>
          Crie seu primeiro projeto
        </Button>

        <CreateProjectDialog isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen}/>
      </div>
     ) : (
     <div className="divide-y">
      {projects .slice(0,5) .map((project) => (
       <Link key={project.id} to={`/projectDetail?id=${project.id}&tab=tasks`} 
        className="block p-5 hover:bg-muted/40 transition">
       
        <div className="flex justify-between gap-3 mb-3">
          <div>
          <h3 className="font-semibold">
            {project.name}
          </h3>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {project.description || "No description"}
          </p>
         </div> 

         <Badge variant={statusStyle[project.status]}>
          {project.status.replaceAll("_", " ")}
        </Badge> 
        </div>

        <div className="flex gap-4 text-xs text-muted-foreground mb-3">
         {project.members?.length > 0 && (
          <div className="flex items-center gap-1">
           <Users size={20}/>
           {project.members.length}
          </div>
         )}

         {project.end_date && (
          <div className="flex items-center gap-1">
          <Calendar size={20}/>
          {format(new Date(project.end_date), "dd/mm/yyyy")}
          </div>
         )}
        </div>

         <div className="space-y-1">
         <div className="flex justify-between text-xs">
          <span>Progresso</span>

          <span>
           {project.progress || 0} %
          </span>
         </div>

          <div className="w-full h-2 rounded bg-muted overflow-hidden">
          <div className="h-2 bg-blue" style={{width: `${project.progress || 0}%`}}/>
          </div>
         </div>
       </Link>
      ))}
     </div>
     )}
     </CardContent>
    </Card>
   )
  )

}

export default ProjectOverview