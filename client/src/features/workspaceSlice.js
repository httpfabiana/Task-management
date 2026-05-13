import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
//import { dummyWorkspaces} from '../assets/assets';
import api from '../configs/api'

export const fetchWorkspaces = createAsyncThunk('workspace/fetchWorkspaces', async({getToken}) => {
   try{
    const { data } = await api.get('/api/workspaces', {headers: {
      Authorization: `Bearer ${await getToken()}`
    }})

     console.log(data)
    return data.workspaces || []

   }catch(error){
    console.log(error?.response?.data?.message || error.message)
    return []
   }
})

const initialState = {
  workspaces:  [],
  currentWorkspace: null,
  loading: false,
};

const workspaceSlice = createSlice({
   name: 'workspace',
   initialState,
   reducers: {
    setWorkspaces: (state, action) => {
      state.workspaces = action.payload
    },
    setCurrentWorkspace: (state, action) => {
      const id = action.payload;

      localStorage.setItem("currentWorkspaceId", id);

      state.currentWorkspace = state.workspaces.find((workspace) => workspace.id === action.payload)
    },
    addWorkspace: (state, action) => {
      const workspace = action.payload;

      state.workspaces.push(workspace);
      state.currentWorkspace = workspace;
    },

     updateWorkspace: (state, action) => {
      const updated = action.payload;

      const workspace = state.workspaces.find((workspace) => workspace.id === updated.id);

      if(workspace) {
       Object.assign(workspace, updated);
      }

      if(state.currentWorkspace?.id === updated.id) {
       state.currentWorkspace = workspace;
      }
     },

     deleteWorkspace: (state, action) => {
      const id = action.payload;

      state.workspaces = state.workspaces.filter((workspace) => workspace.id !== id);

      if(state.currentWorkspace?.id === id){
       state.currentWorkspace = null;
      }
     },

     addProject: (state, action) => {
      const project = action.payload;

      // 1. adiciona no atual
     state.currentWorkspace.projects.push(project);

      // 2. sincroniza no array geral
      const workspace = state.workspaces.find(
      (w) => w.id === state.currentWorkspace.id
     );

      if (workspace) {
      workspace.projects.push(project);
     }
     },

     addTask: (state, action) => {
      const { projectId} = action.payload;

      //achar o projeto tual
      const project = state.currentWorkspace.projects.find((project) => project.id === projectId);

      if(project){
      project.tasks.push(action.payload);
      }

     const workspace = state.workspaces.find((workspace) => workspace.id === state.currentWorkspace.id);

     if(workspace) {
      const proj = workspace.projects.find((project) => project.id === projectId);
       if(proj) {
        proj.tasks.push(action.payload);
       }
     }
     
     },

      updateTask: (state, action) => {
       const { projectId, id } = action.payload;

      const project = state.currentWorkspace.projects.find((project) => project.id === projectId);

      if(project) {
      project.tasks = project.tasks.map((task) => task.id === id ? action.payload : task);
      }

      const workspace = state.workspaces.find((workspace) => workspace.id === state.currentWorkspace.id);

      if(workspace) {
       const projet = workspace.projects.find((project) => project.id === projectId);
       if(projet) {
        projet.tasks = projet.tasks.map((task) => task.id === id ? action.payload : task);
       }
      }
      },
     deleteTask: (state, action) => {
      const { projectId, taskId } = action.payload;

     const project = state.currentWorkspace.projects.find((project) => project.id === projectId);

      if(project) {
       project.tasks = project.tasks.filter((task) => !taskId.includes(task.id));
      }

      const workspace = state.workspaces.find((workspace) =>  workspace.id === state.currentWorkspace.id);

      if(workspace) {
       const proj = workspace.projects.find((projet) => projet.id === projectId);
       if(proj) {
        proj.tasks = proj.tasks.filter((task) => !taskId.includes(task.id));
       }
      }
     } 
    },

    extraReducers: (builder) =>{
     builder.addCase(fetchWorkspaces.pending, (state) => {
      state.loading = true
     });
      
     builder.addCase(fetchWorkspaces.fulfilled, (state, action) => {
      const workspaces = action.payload;

      state.workspaces = workspaces;

      if(workspaces.length === 0){
        state.loading = false;
        return
      }

      const saveWorkspaceId = localStorage.getItem("currentWorkspaceId");

      const saveWorkspace = workspaces.find((workspace) => workspace.id === saveWorkspaceId);

      state.currentWorkspace = saveWorkspace || workspaces[0];

      console.log("payload", action.payload)
      state.loading = false;
     })

     builder.addCase(fetchWorkspaces.rejected, (state) => {
      state.loading = false;
     })
    },
})

export const { setWorkspaces, setCurrentWorkspace, addWorkspace, updateWorkspace, deleteWorkspace, addProject, addTask, updateTask, deleteTask } = workspaceSlice.actions;
export default workspaceSlice.reducer;