
import { useSelector } from "react-redux";
import { format } from "date-fns";
import {GitCommit, MessageSquare, Clock,Bug,Zap,Square,} from "lucide-react";
import {Card,CardHeader,CardTitle,CardContent,} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const RecentActivity = () => {
  const {currentWorkspace} = useSelector((state) => state.workspace)

  const tasks = currentWorkspace?.projects.flatMap(
    (project) => project.tasks || []
  ) || [];

  const iconTypes = {
   BUG: Bug,
   FEATURE: Zap,
   TASK: Square,
   IMPROVEMENT: MessageSquare,
   OTHER: GitCommit,
  };

  return (
   <Card>
    <CardHeader>
     <CardTitle>Atividade recente</CardTitle>
    </CardHeader>

    <CardContent>
     {tasks.length === 0 ? (
      <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
       <Clock className="w-8 h-8 mb-2"/>
      </div>  
     ) : (
      <div className="space-y-4">
       {tasks.map((task) => {
        const Icon = iconTypes[task.type] || Square;

       return (
        <div key={task.id} className="border rounded-lg space-y-2">
         <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4"/>

            <h4 className="font-medium">
             {task.title}
            </h4>
          </div>

          <Badge variant="secondary">
           {task.status?.replace("_", " ")}
          </Badge>
         </div>

         <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          <span>{task.type}</span>

          {task.assignee && (
           <span>
            {task.assignee.name}
           </span>
          )}

         {task.updatedAt && (
         <span>
           {format(new Date(task.updatedAt), "dd/mm/yyyy")} 
         </span>
         )}
         </div>
        </div>
        )
       })}
      </div>
     )}
    </CardContent>
   </Card>
  )
}

export default RecentActivity;