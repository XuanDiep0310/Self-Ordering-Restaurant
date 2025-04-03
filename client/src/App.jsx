import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import EditMenu from './components/EditMenu';
import Management_table from './components/Management_table';
import Employees from "./components/Employees";

function App() {
  return (
    // <Router>
    //   <Routes>
    //     <Route path="/" element={<AdminDashboard />} />
    //     <Route path="/menu" element={<EditMenu />} />
    //     <Route path="/ban" element={<Management_table />} />
    //     <Route path="/employees" element={<Employees />} />
    //   </Routes>
    // </Router>
    <Employees />
  );
}

export default App;