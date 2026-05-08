import { useState } from "react";
import { X } from "lucide-react";
import { useSelector } from "react-redux";


import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";

import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

const CreateProjectDialog = ({
  isDialogOpen,
  setIsDialogOpen,
}) => {

  const { currentWorkspace } = useSelector(
    (state) => state.workspace
  );

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

  // Atualiza qualquer campo
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Adicionar membro
  const addTeamMember = (email) => {
    if (!email) return;

    // Evita repetir membro
    if (formData.team_members.includes(email)) return;

    setFormData((prev) => ({
      ...prev,
      team_members: [...prev.team_members, email],
    }));
  };

  // Remover membro
  const removeTeamMember = (email) => {
    setFormData((prev) => ({
      ...prev,
      team_members: prev.team_members.filter(
        (member) => member !== email
      ),
    }));
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      console.log(formData);

      // Aqui vai sua API futuramente

      setIsDialogOpen(false);

    } catch (error) {
      console.log(error);

    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={setIsDialogOpen}
    >
      <DialogContent className="sm:max-w-2xl">

        {/* Header */}
        <DialogHeader>
          <DialogTitle>
            Create New Project
          </DialogTitle>

          <DialogDescription>
            Create a new project inside your workspace
          </DialogDescription>
        </DialogHeader>

        {/* Workspace */}
        {currentWorkspace && (
          <div className="text-sm text-muted-foreground">
            Workspace:
            <span className="ml-1 font-medium text-blue-500">
              {currentWorkspace.name}
            </span>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* Project Name */}
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

          {/* Description */}
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

          {/* Status + Priority */}
          <div className="grid grid-cols-2 gap-4">

            {/* Status */}
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
                  Planning
                </option>

                <option value="ACTIVE">
                  Active
                </option>

                <option value="COMPLETED">
                  Completed
                </option>

                <option value="ON_HOLD">
                  On Hold
                </option>

                <option value="CANCELLED">
                  Cancelled
                </option>
              </select>
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <Label>Priority</Label>

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
                  Low
                </option>

                <option value="MEDIUM">
                  Medium
                </option>

                <option value="HIGH">
                  High
                </option>
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">

            {/* Start Date */}
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

            {/* End Date */}
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

          {/* Team Lead */}
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

          {/* Team Members */}
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

            {/* Members List */}
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

          {/* Footer */}
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