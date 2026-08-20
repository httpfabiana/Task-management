import { Routes, Route } from "react-router-dom";
import { Toaster} from 'react-hot-toast'
import Dashboard from './pages/Dashboard/dashboard.jsx'
import Layout from './pages/Layout/layout.jsx'
import ProjectDetails from './pages/ProjectDetail/projectDetail.jsx'
import Projects from './pages/Projects/projects.jsx'
import TaskDetails from './pages/TaskDetail/taskDetail.jsx'
import Team from './pages/Team/team.jsx'


const App = () => {
  return (
    <>
     <Toaster/>
     <Routes>
      <Route path='/' element={<Layout/>}>
        <Route index element={<Dashboard/>}/>
        <Route path='/team' element={<Team/>}/>
        <Route path='/projects' element={<Projects/>}/>
        <Route path='/projectDetail' element={<ProjectDetails/>}/>
        <Route path='/taskDetail' element={<TaskDetails/>}/>
        </Route>
     </Routes>
    </>
  )
}

export default App;