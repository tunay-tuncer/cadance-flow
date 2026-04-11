//DEPENDENCIES
import { Routes, Route } from 'react-router'
import { ProjectContextProvider } from './context/ProjectContext';
import { AuthContextProvider } from './context/AuthContext';
//PAGES
import Home from './Pages/Home';
import Support from './Pages/Support';
import Login from './Pages/Login';
import DashboardHome from './Pages/DashboardHome';
import Archive from './Pages/FlowPages/Archive';
import Media from './Pages/FlowPages/Media';
import FlowSupport from './Pages/FlowPages/Support';
import Settings from './Pages/FlowPages/Settings';
import ProjectDetailsController from './Pages/FlowPages/project/ProjectDetailsController';
//LAYOUT & COMPONENTS
import FlowPageWrapper from './wrappers/FlowPageWrapper';
import CursorGlow from "./components/CursorGlow";

function App() {

  return (
    <AuthContextProvider>
      <ProjectContextProvider>
        <CursorGlow />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/support' element={<Support />} />
          <Route path='/login' element={<Login />} />

          <Route path='/dashboard' element={<FlowPageWrapper />}>
            <Route index element={<DashboardHome />} />
            <Route path='archive' element={<Archive />} />
            <Route path='media' element={<Media />} />
            <Route path='support' element={<FlowSupport />} />
            <Route path='settings' element={<Settings />} />
            <Route path='project/:projectId' element={<ProjectDetailsController />} />
          </Route>

        </Routes>
      </ProjectContextProvider>
    </AuthContextProvider>
  )
}

export default App
