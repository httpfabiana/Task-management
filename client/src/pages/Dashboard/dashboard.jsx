import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import CreateProjectDialog from '@/components/createProjectDialog/createProjectDialog'
import StatsGrid from '@/components/StartsGrid/StartGrid'
import ProjectOverview from '@/components/ProjectOverview/ProjectOverview'
import RecentActivity from '@/components/RecentActivity/RecentActivity'
import TasksSummary from '@/components/TaskSummary/TaskSummary'
import { useUser } from '@clerk/react'

const Dashboard = () => {
  
  const {user} = useUser()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
   <div className='max-w-6xl mx-auto'>
    <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6'>
     <div>
      <h1 className='text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-1'>Bem vindo de volta, {user?.fullName || 'user'}</h1>
      <p className='text-gray-500 dark:text-zinc-400 text-sm'>Acompanhe o que esta acontecendo com seus projetos hoje</p>
    </div>

     <Button onClick={() => setIsDialogOpen(true)} className="flex items-center gap-2 px-5 py-2 text-sm rounded from-blue-500 to-blue-600 bg-gradient-to-br text-white space-x-2 hover:opacity-90 transition">
      <Plus size={16}/> Novo projeto
     </Button>

     <CreateProjectDialog  isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen}/>
    </div>

     <StatsGrid/>

     <div className='grid lg:grid-cols-3 gap-8'>
      <div className='lg:col-span-2 space-y-8'>
       <ProjectOverview/>
       <RecentActivity/>
      </div>

      <div>
       <TasksSummary/>
      </div>
     </div>
   </div> 
  )
}

 export default Dashboard