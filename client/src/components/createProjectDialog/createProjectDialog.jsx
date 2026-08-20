import { useState } from "react";
import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {Dialog,DialogContent,DialogHeader,DialogTitle,DialogDescription,} from "../ui/dialog";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {toast} from 'react-hot-toast'
import api from "@/configs/api";
import { useAuth } from "@clerk/react";
import { addProject } from "@/features/workspaceSlice";

const CreateProjectDialog = ({ isDialogOpen,setIsDialogOpen,}) => {
  const {getToken} = useAuth()
  const dispatch = useDispatch()

  const { currentWorkspace } = useSelector((state) => state.workspace);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "PLANNING",
    priority: "MEDIUM",
    start_date: "",
    end_date: "",
    team_lead: "",
    team_members: [],
    progress: 0,
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addTeamMember = (email) => {
    if (!email) return;

    if (formData.team_members.includes(email)) return;

    setFormData((prev) => ({
      ...prev,
      team_members: [...prev.team_members, email],
    }));
  };

  const removeTeamMember = (email) => {
    setFormData((prev) => ({
      ...prev,
      team_members: prev.team_members.filter(
        (member) => member !== email
      ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if(!formData.team_lead){
        return toast.error("Por favor, selecione um lider da equipe.")
      }

      setIsSubmitting(true);
      const {data} = await api.post("/api/projects", 
        { workspaceId: currentWorkspace.id, ...formData},
        {headers: {Authorization: `Bearer ${await getToken()}`}})
        
        dispatch(addProject(data.project))
        setIsDialogOpen(false);

        console.log(formData);

    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)

    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={setIsDialogOpen}
    >
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">

        <DialogHeader>
          <DialogTitle>
            Create New Project
          </DialogTitle>

          <DialogDescription>
            Create a new project inside your workspace
          </DialogDescription>
        </DialogHeader>

        {currentWorkspace && (
          <div className="text-sm text-muted-foreground">
            Workspace:
            <span className="ml-1 font-medium text-blue-500">
              {currentWorkspace.name}
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">

          <div className="space-y-2">
            <Label>Project Name</Label>

            <Input
              placeholder="Enter project name"
              value={formData.name}
              onChange={(e) =>
                handleChange("name", e.target.value)
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>

            <Textarea
              placeholder="Describe your project"
              value={formData.description}
              onChange={(e) =>
                handleChange(
                  "description",
                  e.target.value
                )
              }
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

            <div className="space-y-2">
              <Label>Status</Label>

              <select
                className="w-full h-10 rounded-md border bg-background px-3 text-sm"
                value={formData.status}
                onChange={(e) =>
                  handleChange(
                    "status",
                    e.target.value
                  )
                }
              >
                <option value="PLANNING">
                  Planejamento
                </option>

                <option value="ACTIVE">
                  Ativo
                </option>

                <option value="COMPLETED">
                  Concluido
                </option>

                <option value="ON_HOLD">
                  Em espera
                </option>

                <option value="CANCELLED">
                  Canceleada
                </option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Prioridade</Label>

              <select
                className="w-full h-10 rounded-md border bg-background px-3 text-sm"
                value={formData.priority}
                onChange={(e) =>
                  handleChange(
                    "priority",
                    e.target.value
                  )
                }
              >
                <option value="LOW">
                  Baixa
                </option>

                <option value="MEDIUM">
                  Média
                </option>

                <option value="HIGH">
                  Alta
                </option>
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

            <div className="space-y-2">
              <Label>Start Date</Label>

              <Input
                type="date"
                value={formData.start_date}
                onChange={(e) =>
                  handleChange(
                    "start_date",
                    e.target.value
                  )
                }
              />
            </div>

            <div className="space-y-2">
              <Label>End Date</Label>

              <Input
                type="date"
                value={formData.end_date}
                onChange={(e) =>
                  handleChange(
                    "end_date",
                    e.target.value
                  )
                }
                min={formData.start_date}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Project Lead</Label>

            <select
              className="w-full h-10 rounded-md border bg-background px-3 text-sm"
              value={formData.team_lead}
              onChange={(e) => {

                const email = e.target.value;

                handleChange("team_lead", email);

                // Adiciona automaticamente nos membros
                if (email) {
                  addTeamMember(email);
                }
              }}
            >
              <option value="">
                Select lead
              </option>

              {currentWorkspace?.members?.map(
                (member) => (
                  <option
                    key={member.user.email}
                    value={member.user.email}
                  >
                    {member.user.email}
                  </option>
                )
              )}
            </select>
          </div>

          <div className="space-y-3">

            <Label>Team Members</Label>

            <select
              className="w-full h-10 rounded-md border bg-background px-3 text-sm"
              onChange={(e) =>
                addTeamMember(e.target.value)
              }
            >
              <option value="">
                Add team member
              </option>

              {currentWorkspace?.members
                ?.filter(
                  (member) =>
                    !formData.team_members.includes(
                      member.user.email
                    )
                )
                .map((member) => (
                  <option
                    key={member.user.email}
                    value={member.user.email}
                  >
                    {member.user.email}
                  </option>
                ))}
            </select>

            {formData.team_members.length > 0 && (
              <div className="flex flex-wrap gap-2">

                {formData.team_members.map(
                  (email) => (
                    <div
                      key={email}
                      className="flex items-center gap-2 rounded-md bg-blue-500/10 px-3 py-1 text-sm text-blue-500"
                    >
                      {email}

                      <button
                        type="button"
                        onClick={() =>
                          removeTeamMember(email)
                        }
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3">

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setIsDialogOpen(false)
              }
            >
              Cancel
            </Button>

            <Button
              disabled={
                isSubmitting ||
                !currentWorkspace
              }
            >
              {isSubmitting
                ? "Creating..."
                : "Create Project"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectDialog;