import { Link } from "react-router-dom";
import {Card,CardContent,} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const statusColors = {
  PLANNING: "secondary",
  ACTIVE: "default",
  ON_HOLD: "outline",
  COMPLETED: "default",
  CANCELLED: "destructive",
};

export default function ProjectCard({ project }) {

  const progress = project.progress || 0;

  return(
   <Link to={`/projectDetail?.id=${project.id}&tab=tasks`}>
   <Card className="h-full hover:shadow-md transition">
   <CardContent className="p-5 space-y-4">
   <div>
    <h3 className="font-semibold text-lg truncate">
     {project.name}
    </h3>
    <p>
     {project.description || "No description"}
    </p>
   </div>

     <div className="flex items-center justify-between gap-2">
     <Badge variant={statusColors[project.status] || "secondary"}>
       {project.status?.replace("_", " ")} 
     </Badge>

     <span>
      {project.priority} priority
     </span>
     </div>

     <div className="space-y-2">
     <div className="flex justify-between text-xs">
      <span className="text-muted-foreground">
        Progress
      </span>
      <span>
        {progress}%
      </span>
     </div>

     <div className="w-full h-2 rounded bg-muted overflow-hidden">
      <div className="h-2 bg-primary" style={{width: `${progress}`}}/>
     </div>
     </div>
   </CardContent>
   </Card>
   </Link>
  )
}