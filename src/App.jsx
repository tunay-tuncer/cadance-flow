//DEPENDENCIES
import { Routes, Route } from 'react-router'
import { ProjectContextProvider } from './context/ProjectContext';
import { AuthContextProvider } from './context/AuthContext';
//PAGES
import Home from "./Pages/Home";
import Support from "./Pages/Support";
import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';
//COMPONENTS
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
          <Route path='/dashboard' element={<Dashboard />} />
        </Routes>
      </ProjectContextProvider>
    </AuthContextProvider>
  )
}

export default App
