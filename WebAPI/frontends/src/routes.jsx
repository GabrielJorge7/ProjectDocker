import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home/home";

const AppRoutes = () => {
    return(
        <Router>
            <Routes>
                <Route path="/" element ={<Login />} />
                <Route path='/inicio' element={<Home />} />
            </Routes>
        </Router>
    )
}
export default AppRoutes