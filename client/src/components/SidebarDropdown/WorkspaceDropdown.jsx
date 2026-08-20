
import { ChevronDown, Check, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {setCurrentWorkspace} from '../../features/workspaceSlice';
import { useNavigate } from "react-router-dom";
//import { dummyWorkspaces } from "../../assets/assets";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel,
 DropdownMenuSeparator, DropdownMenuItem
} from "../ui/dropdown-menu";
import { useOrganizationList, useClerk } from "@clerk/react";
import { useEffect } from "react";

function WorkspaceDropdown() {

  const {setActive, isLoaded} = useOrganizationList({userMemberships: true})

  const {openCreateOrganization} = useClerk()

  const { workspaces, currentWorkspace} = useSelector((state) => state.workspace)
 
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSelectWorkspace = (workspaceId) => {
    setActive({organization: workspaceId})
    dispatch(setCurrentWorkspace(workspaceId))
    navigate("/")
  }

  useEffect(() => {
    if(currentWorkspace && isLoaded){
     setActive({organization: currentWorkspace.id})
    }

  },[currentWorkspace, isLoaded, setActive])

  return (
   <div className="w-full">
    <DropdownMenu>
     
     <DropdownMenuTrigger asChild>
     <Button variant="ghost" className="w-full justify-between mt-4 mb-4">
      <div className="flex items-center gap-3 text-left">
       <img
        src={currentWorkspace?.image_url}
        alt=""
        className="h-9 w-9 rounded-lg object-cover"
       />

       <div className="min-w-0">
       <p className="truncate text-xl font-semibold">
        {currentWorkspace?.name || "Select Workspace"}
       </p>

       <p className="text-sm text-muted-foreground">
        {workspaces.length} workspace
        {workspaces.length !== 1 ? "s" : ""}
       </p>
       </div>
      </div>
      <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground"/>

     </Button>
     </DropdownMenuTrigger>

     <DropdownMenuContent side="bottom" align="start" sideOffset={8} className="w-82 z-[99999]">
      <DropdownMenuLabel className="text-md mb-2">
        Workspaces
      </DropdownMenuLabel>

     
      {workspaces.map((workspace) => (
       <DropdownMenuItem key={workspace.id} onClick={() => handleSelectWorkspace(workspace.id)}  className="cursor-pointer">
        <div className="flex w-full items-center gap-3 ml-2">
         <img
          src={workspace.image_url}
          alt=""
          className="h-8 w-8 rounded-md object-cover"
         />

         <div className="flex flex-1 min-w-0 flex-col">
          <p className="truncate text-sm font-medium">
            {workspace.name}
          </p>

           <p className="truncate text-sm font-medium">
            {workspace.members?.length || 0} members
          </p>
         </div>

         {currentWorkspace?.id === workspace.id && (<Check className="h-4 w-4 text-blue-500"/>)}
        </div>
       </DropdownMenuItem>
      ))}

      <DropdownMenuItem onClick={() => {openCreateOrganization()}} className="cursor-pointer py-2 text-xl text-blue-500">
        <Plus className="mr-2 h-5 w-5"/>
        Create Workspace
      </DropdownMenuItem>
     </DropdownMenuContent>
    </DropdownMenu>
   </div>
  )
}

export default WorkspaceDropdown;