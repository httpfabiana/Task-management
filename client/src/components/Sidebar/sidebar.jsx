import { useEffect, useRef} from 'react'
import { NavLink } from 'react-router-dom';
import {FolderOpenIcon, UserIcon, LayoutDashboardIcon, SettingsIcon} from 'lucide-react'
import WorkspaceDropdown from '../SidebarDropdown/WorkspaceDropdown';
import MyTaskSidebar from '../MyTasksSidebar/myTaskSidebar';
import { Separator } from '../ui/separator'
import { ScrollArea} from '../ui/scroll-area'
import { useClerk } from '@clerk/react';


const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const sidebarRef = useRef(null)

  const {openUserProfile} = useClerk()
  
  const menuItems = [
   {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboardIcon,
   },
   {
    name: "Projects",
    href: "/projects",
    icon: FolderOpenIcon,
   },
   {
    name: "Team",
    href: "/team",
    icon: UserIcon,
   },
   {
    name: "Settings",
    action: () => openUserProfile(),
    icon: SettingsIcon,
   }
  ];

   useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      isSidebarOpen &&
      sidebarRef.current &&
      !sidebarRef.current.contains(event.target)
    ) {
      setIsSidebarOpen(false)
    }
  }

  document.addEventListener("mousedown", handleClickOutside)

  return () => {
    document.removeEventListener("mousedown", handleClickOutside)
  }
}, [isSidebarOpen, setIsSidebarOpen])

  return (
   <aside ref={sidebarRef} className={`w-72 h-screen border-r bg-background fixed top-0 left-0 z-40 transition-transform duration-300
    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0 sm:static`}>
    <WorkspaceDropdown/>

    <Separator/>

    <ScrollArea className='h-[calc(100vh-80px)]'>
     <div className='p-4 space-y-6'>

     <div className='space-y-1'>
     {menuItems.map((item) => (

     item.href ? (

    <NavLink key={item.name} to={item.href} className={({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-4 py-2
        text-md transition-all ${
          isActive
            ? "bg-muted font-medium"
            : "hover:bg-muted/60"
        }`
      }
    >
      <item.icon size={28} />
      <span>{item.name}</span>
    </NavLink>

  ) : (

    <button key={item.name} onClick={item.action} className="flex w-full items-center gap-3 rounded-lg px-4 py-2
      text-md transition-all hover:bg-muted/60"
     >
        <item.icon size={28} />
        <span>{item.name}</span>
    </button>
  )
))}
     </div>

     <Separator/>

     <MyTaskSidebar/>
     </div>
    </ScrollArea>
   </aside>
  )
}

export default Sidebar;