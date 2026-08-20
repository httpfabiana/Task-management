import { useState,useMemo } from "react";
import { useSelector } from "react-redux";

import {Plus,Search,FolderOpen,} from "lucide-react";
import ProjectCard from "@/components/ProjectCard/ProjectCard";
import CreateProjectDialog from "@/components/createProjectDialog/createProjectDialog";

import {Button} from '@/components/ui/button'
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Projects() {

  const projects = useSelector(
    (state) =>
      state?.workspace?.currentWorkspace?.projects || []
  );

  const [searchTerm, setSearchTerm] =
    useState("");

  const [isDialogOpen, setIsDialogOpen] =
    useState(false);

  const [filters, setFilters] = useState({
    status: "ALL",
    priority: "ALL",
  });

 const filteredProjects = useMemo(() => {

  let filtered = [...projects];

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

  if (filters.status !== "ALL") {

    filtered = filtered.filter(
      (project) =>
        project.status === filters.status
    );
  }

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

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <h1 className="text-2xl font-semibold">
            Projetos
          </h1>

          <p className="text-sm text-muted-foreground">
            Gerencie e acompanhe seus projetos
          </p>
        </div>

        <Button
          onClick={() =>
            setIsDialogOpen(true)
          }
          className="w-full sm:w-fit"
        >
          <Plus className="mr-2 size-4" />
          Novo projeto
        </Button>
      </div>

      <CreateProjectDialog
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
      />

   
      <div className="flex flex-col gap-4 md:flex-row">

        <div className="relative w-full md:max-w-sm">

          <Label className="opacity-0">Search</Label>

          <Search className="absolute left-3 top-1/2 size-4 mt-3 -translate-y-1/2 text-muted-foreground" />

          <Input
            placeholder="Pesquise projetos..."
            value={searchTerm}
            onChange={(e) =>
            setSearchTerm(e.target.value)
            }
            className="pl-10 mt-3"
          />
        </div>

    
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
              Todos os stattus
            </option>

            <option value="ACTIVE">
              Ativo
            </option>

            <option value="PLANNING">
              Planejamento
            </option>

            <option value="COMPLETED">
              Concluido
            </option>

            <option value="ON_HOLD">
              Em espera
            </option>

            <option value="CANCELLED">
              Cancelada
            </option>
          </select>
        </div>

        <div className="space-y-1">          
          <Label>Prioridade</Label>

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
              Prioridade
            </option>

            <option value="HIGH">
              Alta
            </option>

            <option value="MEDIUM">
              Media
            </option>

            <option value="LOW">
              Baixa
            </option>
          </select>
        </div>
      </div>

      {filteredProjects.length === 0 ? (

        <div className="flex flex-col items-center justify-center rounded-xl border py-16 text-center">

          <div className="mb-5 flex size-20 items-center justify-center rounded-full bg-muted">

            <FolderOpen className="size-10 text-muted-foreground" />
          </div>

          <h3 className="text-lg font-semibold">
            Nenhum projeto encontrado
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Crie seu primeiro projeto para começa
          </p>

          <Button
            onClick={() =>
              setIsDialogOpen(true)
            }
            className="mt-6"
          >
            <Plus className="mr-2 size-4" />
            Criar projeto
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