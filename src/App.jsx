import { Routes, Route } from 'react-router'
import Home from "./Pages/Home";
import Support from "./Pages/Support";
import { ProjectContextProvider } from './context/ProjectContext';
import CursorGlow from "./components/CursorGlow";
import Login from './Pages/Login';

function App() {

  return (
    <ProjectContextProvider>
      <CursorGlow />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/support' element={<Support />} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </ProjectContextProvider>
  )
}

export default App
