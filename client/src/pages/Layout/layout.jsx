import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { Loader2Icon } from "lucide-react";
import Navbar from "@/components/Navbar/navBar";
import Sidebar from "@/components/Sidebar/sidebar";
import {loadTheme} from '@/features/themeSlice'
import {useUser, SignIn, useAuth, CreateOrganization} from '@clerk/react'
import { fetchWorkspaces } from "@/features/workspaceSlice";


const Layout = () => {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { loading, workspaces } = useSelector((state) => state.workspace);

  const dispatch = useDispatch();

  const { user, isLoaded } = useUser()

  const {getToken} = useAuth()

  const hasFetched = useRef(false)

  useEffect(() => {
    dispatch(loadTheme());
  }, [dispatch]);

  useEffect(() => {
    if(isLoaded && user && !hasFetched.current){
      hasFetched.current = true
      dispatch(fetchWorkspaces({getToken}))
    }
  }, [isLoaded, user, getToken, dispatch])

  if(!user){
    return (
      <div className="flex justify-center items-center h-screen bg-white dark:bg-zinc-950">
        <SignIn/>
      </div>
    )
  }

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
      
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <div className="flex-1 flex flex-col h-screen">
        
        <Navbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <main className="flex-1 p-6 xl:p-10 xl:px-16 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;

 