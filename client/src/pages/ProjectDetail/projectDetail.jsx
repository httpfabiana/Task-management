import { useMemo, useState } from "react";
import {useNavigate,useSearchParams,} from "react-router-dom";
import { useSelector } from "react-redux";
import {ArrowLeftIcon,BarChart3Icon,CalendarIcon,FileStackIcon,PlusIcon,SettingsIcon,UsersIcon,
  CheckCircleIcon, Clock3Icon,
  Calendar,} from "lucide-react";
import { Button } from "@/components/ui/button";
import {Card,CardContent,} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {Tabs,TabsContent,TabsList,TabsTrigger,} from "@/components/ui/tabs";


export default function ProjectDetail(){
  const navigate = useNavigate();
  
  const [ setShowCreateTask] = useState(false)

  const [searchParams, setSearchParams] = useSearchParams()

  const projectId = searchParams.get("id")

 const defaultTab = searchParams.get("tab") || "tasks"

 const projects = useSelector(
  (state) => state.workspace.currentWorkspace?.projects || []
 )

const project = projects.find(
  (project) => project.id === projectId
)

  const tasks = useMemo(() => {
    return project?.tasks || []
  }, [project])

  const stats = useMemo(() => {
    return {
     total:tasks.length,
      completed: tasks.filter((task) => task.status === "DONE").length,

      inProgress: tasks.filter((task) => task.status === "IN_PROGRESS" || task.status === "TODO").length,
      members: project?.members?.length || 0,
     }
    },[tasks, project])

    const statusStyles = {
     PLANNING: "secondary",
     ACTIVE: "default",
     ON_HOLD: "outline",
     COMPLETED: "default",
     CANCELLED: "destructive",
    };

    if(!project){
     return (
      <div className="flex flex-col items-center justify-center py-32">
        <h1 className="text-4xl font-bold mb-6">
          Projeto não encontrado
        </h1>

        <Button variant="outline" onClick={() => navigate("/projects")}>
          Volta para os projetos
        </Button>
      </div>
     )
    }

   return (
    <div className="max-w-6xl mx-auto space-y-6">
     <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
     <div className="flex items-center gap-4">
       <Button onClick={() => navigate("/projects")} size="icon" variant="ghost">
        <ArrowLeftIcon className="size-4"/>
     </Button>  
    
     <div className="space-y-1">
     <div className="flex items-center gap-3">
      <h1 className="text-2xl font-bold">
        {project.name}
      </h1>

      <Badge variant={statusStyles[project.status]}>
        {project.status.replace("_", " ")}
      </Badge>
     </div>

     {project.description && (
      <p className="text-sm text-muted-foreground">
        {project.description}
      </p>
     )}
     </div>
     </div>

     <Button onClick={() => setShowCreateTask(true)}>
       <PlusIcon className="size-4 mr-2"/>
       Nova tarefa
     </Button>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
     {[
      {
       title: "Total Tasks",
       value: stats.total,
       icon: FileStackIcon,
      },
      {
       title: "Completed",
       value: stats.completed,
       icon: CheckCircleIcon, 
      },
      {
       title: "In Progress",
       value: stats.inProgress,
       icon: Clock3Icon,  
      },
      {
       title: "Team members",
       value: stats.members,
       icon: UsersIcon, 
      },
     ].map((item) => (
      <Card key={item.title}>
      <CardContent className='p-5 flex items-center justify-between'>
       <div>
        <p className="text-sm text-muted-foreground">
         {item.title}
        </p>
        <h2 className="text-3xl font-bold mt-1">
          {item.value}
        </h2>
       </div>

       <item.icon className="size-5 text-muted-foreground"/>
      </CardContent>
      </Card>
     ))}
    </div>

    <Tabs defaultValue={defaultTab} onValueChange={(value) => setSearchParams({id: projectId, tab: value})}>
     <TabsList className='flex flex-wrap h-auto'>

     <TabsTrigger>
      <CalendarIcon className="size-4 mr-2"/>
      Calendario
     </TabsTrigger>

      <TabsTrigger>
      <BarChart3Icon className="size-4 mr-2"/>
       Analise
     </TabsTrigger>

      <TabsTrigger>
      <SettingsIcon className="size-4 mr-2"/>
       Configuração
     </TabsTrigger>
     </TabsList>

     <TabsContent value="tasks">
        
     </TabsContent>
    </Tabs>
  </div>
   )
}
