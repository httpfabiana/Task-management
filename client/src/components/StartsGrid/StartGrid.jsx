import { FolderOpen, CheckCircle, Users, AlertTriangle } from "lucide-react";
import { useSelector } from "react-redux";
import { Card, CardContent } from "../ui/card";


export default function StatsGrid(){
  const { currentWorkspace } = useSelector((state) => state.workspace)

   const stats = {
   totalProjects: currentWorkspace?.projects.length || 0,

   completedProjects:
    currentWorkspace?.projects.filter(
      (project) => project.stats === "COMPLETED"
    ).length || 0,

   myTasks:
    currentWorkspace?.projects.reduce(
      (total, project) =>
        total +
        project.tasks.filter(
          (task) =>
            task.assignee?.email === currentWorkspace.owner.email
        ).length,
      0
    ) || 0,

   overduesIssues:
    currentWorkspace?.projects.reduce(
      (total, project) =>
        total +
        project.tasks.filter(
          (task) => new Date(task.due_date) < new Date()
        ).length,
      0
    ) || 0
}

    const cards = [
     {
      title: "Total Projects",
      value: stats.totalProjects,
      subtitle: `Projects in ${currentWorkspace?.name}`,
      icon: FolderOpen,
      iconColor: "Text-blue-500",
      bg: "bg-blue-500/10"
     },
     {
      title: "Completed",
      value: stats.completedProjects,
      subtitle: "Finished projects",
      icon: CheckCircle,
      iconColor: "Text-emerald-500",
      bg: "bg-emerald-500/10"
     },
     {
      title: "My Tasks",
      value: stats.myTasks,
      subtitle: "Assigned to me",
      icon: Users,
      iconColor: "Text-Purple-500",
      bg: "bg-purple-500/10"  
     },
     {
      title: "Overdue",
      value: stats.overduesIssues,
      subtitle: "Need attention",
      icon: AlertTriangle,
      iconColor: "Text-amber-500",
      bg: "bg-amber-500/10"
     }
    ]

    return (
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-8"> 
      {cards.map((card, index) => {
       const Icon = card.icon

       return (
        <Card key={index} className="border-zinc-200 dark:border-zinc-800">
        <CardContent className="p-5">
         <div className="flex items-start justify-between">
          <div>
          <p className="text-muted-foreground">
            {card.title}
          </p>

           <h2 className="text-2xl font-bol mt-1">
            {card.value}
           </h2>

           <p className="text-sm text-muted-foreground mt-1">
            {card.subtitle}
           </p>
         </div>  

         <div className={`p-3 rounded-xl ${card.bg}`}>
           <Icon size={23} className={card.iconColor}/>
         </div>
         </div>
        </CardContent>
        </Card>
       )
      })}
     </div>
    )
}