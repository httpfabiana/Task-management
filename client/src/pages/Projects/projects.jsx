import { useState,useMemo } from "react";
import { useSelector } from "react-redux";

import {
  Plus,
  Search,
  FolderOpen,
} from "lucide-react";

import ProjectCard from "@/components/ProjectCard/ProjectCard";
import CreateProjectDialog from "@/components/createProjectDialog/createProjectDialog";

import {Button} from '@/components/ui/button'
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Projects() {

  // Pega os projetos do workspace atual
  const projects = useSelector(
    (state) =>
      state?.workspace?.currentWorkspace?.projects || []
  );

  // Estados


  const [searchTerm, setSearchTerm] =
    useState("");

  const [isDialogOpen, setIsDialogOpen] =
    useState(false);

  const [filters, setFilters] = useState({
    status: "ALL",
    priority: "ALL",
  });

  // Filtrar projetos
 const filteredProjects = useMemo(() => {

  let filtered = [...projects];

  // Search
  if (searchTerm) {

    filtered = filtered.filter((project) => {

      return (
        project.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||

        project.description
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    });
  }

  // Status
  if (filters.status !== "ALL") {

    filtered = filtered.filter(
      (project) =>
        project.status === filters.status
    );
  }

  // Priority
  if (filters.priority !== "ALL") {

    filtered = filtered.filter(
      (project) =>
        project.priority === filters.priority
    );
  }

  return filtered;

}, [projects, searchTerm, filters]);

  return (
    <div className="mx-auto max-w-7xl space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        {/* Title */}
        <div>
          <h1 className="text-2xl font-semibold">
            Projects
          </h1>

          <p className="text-sm text-muted-foreground">
            Manage and track your projects
          </p>
        </div>

        {/* Button */}
        <Button
          onClick={() =>
            setIsDialogOpen(true)
          }
          className="w-full sm:w-fit"
        >
          <Plus className="mr-2 size-4" />
          New Project
        </Button>
      </div>

      {/* Dialog */}
      <CreateProjectDialog
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
      />

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row">

        {/* Search */}
        <div className="relative w-full md:max-w-sm">

          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
            className="pl-10"
          />
        </div>

        {/* Status */}
        <div className="space-y-1">

          <Label>Status</Label>

          <select
            value={filters.status}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                status: e.target.value,
              }))
            }
            className="h-10 rounded-md border bg-background px-3 text-sm"
          >
            <option value="ALL">
              All Status
            </option>

            <option value="ACTIVE">
              Active
            </option>

            <option value="PLANNING">
              Planning
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
        <div className="space-y-1">

          <Label>Priority</Label>

          <select
            value={filters.priority}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                priority: e.target.value,
              }))
            }
            className="h-10 rounded-md border bg-background px-3 text-sm"
          >
            <option value="ALL">
              All Priority
            </option>

            <option value="HIGH">
              High
            </option>

            <option value="MEDIUM">
              Medium
            </option>

            <option value="LOW">
              Low
            </option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (

        <div className="flex flex-col items-center justify-center rounded-xl border py-16 text-center">

          {/* Icon */}
          <div className="mb-5 flex size-20 items-center justify-center rounded-full bg-muted">

            <FolderOpen className="size-10 text-muted-foreground" />
          </div>

          {/* Text */}
          <h3 className="text-lg font-semibold">
            No projects found
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Create your first project to get started
          </p>

          {/* Button */}
          <Button
            onClick={() =>
              setIsDialogOpen(true)
            }
            className="mt-6"
          >
            <Plus className="mr-2 size-4" />
            Create Project
          </Button>
        </div>

      ) : (

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
            />
          ))}
        </div>
      )}
    </div>
  );
}