import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { Loader2Icon } from "lucide-react";
import Navbar from "@/components/Navbar/navBar";
import Sidebar from "@/components/Sidebar/sidebar";
import {loadTheme} from '@/features/themeSlice'
import {useUser, SignIn, useAuth, CreateOrganization} from '@clerk/react'
import { fetchWorkspaces } from "@/features/workspaceSlice";


const Layout = () => {
  // controla se a sidebar está aberta ou fechada
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // pega estado de loading do workspace
  const { loading, workspaces } = useSelector((state) => state.workspace);

  const dispatch = useDispatch();

  const { user, isLoaded } = useUser()

  const {getToken} = useAuth()

  // carrega o tema quando o app abre
  useEffect(() => {
    dispatch(loadTheme());
  }, [dispatch]);

  useEffect(() => {
    if(isLoaded && user && workspaces?.length === 0){
      dispatch(fetchWorkspaces({getToken}))
    }
  }, [user, isLoaded])

  if(!user){
    return (
      <div className="flex justify-center items-center h-screen bg-white dark:bg-zinc-950">
        <SignIn/>
      </div>
    )
  }

  // enquanto estiver carregando, mostra tela de loading
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-zinc-950">
        <Loader2Icon className="size-7 text-blue-500 animate-spin" />
      </div>
    );
  }

   if(user && workspaces.length === 0){
      return(
        <div className="min-h-screen flex justify-center items-center">
          <CreateOrganization/>
        </div>
      )
    }

  return (
    <div className="flex bg-white dark:bg-zinc-950 text-gray-900 dark:text-slate-100">
      
      {/* Sidebar lateral */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Área principal */}
      <div className="flex-1 flex flex-col h-screen">
        
        {/* Barra superior */}
        <Navbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        {/* Conteúdo da página (rotas) */}
        <main className="flex-1 p-6 xl:p-10 xl:px-16 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;

 