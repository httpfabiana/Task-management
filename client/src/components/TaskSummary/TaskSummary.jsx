
import { useSelector } from "react-redux";
import {ArrowRight,Clock,AlertTriangle,User,} from "lucide-react";
import {Card,CardHeader,CardTitle,CardContent} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/react";

export default function TasksSummary() {
  const { currentWorkspace } = useSelector((state) => state.workspace);

   const {user} = useUser()
   
   const tasks =
    currentWorkspace?.projects.flatMap(
    (project) => project.tasks || []
   ) || []

  const myTasks = tasks.filter(
   (task) => task.assigneeId === user.id
  )

  const overdueTasks = tasks.filter(
   (task) => task.due_date && new Date(task.due_date) < new Date() &&
    task.status !== "DONE"
  );

  const inProgressTask = tasks.filter(
    (task) => task.status === "IN_PROGRESS"
  );

  const cards = [
   {
    title: "My Tasks",
    icon: User,
    count: myTasks.length,
    items: myTasks.slice(0,3)
   },
   {
    title: "Overdue",
    icon: AlertTriangle,
    count: overdueTasks.length,
    items: overdueTasks.slice(0,3)
   },
   {
    title: "In Progress",
    icon: Clock,
    count: inProgressTask.length,
    items: inProgressTask.slice(0,3)
   }
  ]
  return(
   <div className="space-y-6">
    {cards.map((card) => {
     const Icon = card.icon;

     return(
     <Card key={card.title}>
     <CardHeader className='pb-3'>
     <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
      <Icon className="w-4 h-4"/>
      <CardTitle>
        {card.title}
      </CardTitle>
      </div>

     <Badge variant="secondary">
      {card.count}
     </Badge> 
     </div>
     </CardHeader>

     <CardContent>
      {card.items.length === 0 ? (
        <p className="text-muted-foreground text-center py-4">
          No {card.title.toLowerCase()}
        </p>
      ) : (
       <div className="space-y-3">
        {card.items.map((task) => (
         <div key={task.id} className="border rounded-lg p-3">
          <h4 className="font-medium">
           {task.title}
          </h4>

          <p className="text-muted-foreground mt-1">
            {task.type} ° {task.priority}
          </p>
         </div>
        ))}

       {card.count > 3 && (
        <Button variant="ghost" className='w-full'>
          View {card.count - 3} more
          <ArrowRight className="w-4 h-4 ml-2"/>
        </Button>
       )}
       </div>
      )}  
     </CardContent>
     </Card> 
     )
    })}
   </div>
  )

}