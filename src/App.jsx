//DEPENDENCIES
import { Routes, Route } from 'react-router'
import { HelmetProvider } from 'react-helmet-async';
import { ProjectContextProvider } from './context/ProjectContext';
import { AuthContextProvider } from './context/AuthContext';
import { Analytics } from '@vercel/analytics/react';
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
import PublicProjectDetails from './Pages/FlowPages/project/PublicProjectDetails';
//LAYOUT & COMPONENTS
import FlowPageWrapper from './wrappers/FlowPageWrapper';
import CursorGlow from "./components/CursorGlow";

function App() {
  return (
    <HelmetProvider>
      <AuthContextProvider>
        <ProjectContextProvider>
          <CursorGlow />
          <Analytics />
          <Routes>
            {/* --- 1. HERKESE AÇIK ROTALAR --- */}
            <Route path='/' element={<Home />} />
            <Route path='/support' element={<Support />} />
            <Route path='/login' element={<Login />} />

            {/* MISAFIR ERIŞIMI: Dashboard dışında ve Auth0 koruması yok */}
            <Route path='/track/:trackingCode' element={<PublicProjectDetails />} />

            {/* --- 2. KORUMALI ROTALAR (Dashboard) --- */}
            {/* Buraya sadece giriş yapmış (Authenticated) kullanıcılar girebilmeli */}
            <Route path='/dashboard' element={<FlowPageWrapper />}>
              <Route index element={<DashboardHome />} />
              <Route path='archive' element={<Archive />} />
              <Route path='media' element={<Media />} />
              <Route path='support' element={<FlowSupport />} />
              <Route path='settings' element={<Settings />} />
              <Route path='project/:projectId' element={<ProjectDetailsController />} />
            </Route>

            {/* Yanlış yola girenleri ana sayfaya veya 404'e at */}
            <Route path="*" element={<Home />} />
          </Routes>
        </ProjectContextProvider>
      </AuthContextProvider>
    </HelmetProvider>
  )
}

export default App
