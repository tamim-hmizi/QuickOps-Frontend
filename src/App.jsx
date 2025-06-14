import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Form from "./pages/Form";
import ProjectList from "./components/ProjectList";
import ProjectDetail from "./pages/ProjectDetail";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { useState, useEffect } from "react";
import { getAllProjects } from "./services/projectService";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "./slices/authSlice";

function App() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const fetchProjects = async () => {
    try {
      const projectsData = await getAllProjects();
      setProjects(projectsData.projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      if (error.response?.status === 401) dispatch(logout());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchProjects();
  }, [user]);

  const handleAddProject = (newProject) =>
    setProjects((prev) => [...prev, newProject]);

  const handleDeleteProject = (deletedId) =>
    setProjects((prev) => prev.filter((p) => p._id !== deletedId));

  return (
    <Router>
      <Toaster position="top-center" />
      <Routes>
        {!user ? (
          <>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        ) : (
          <Route
            path="*"
            element={
              <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200">
                <div className="drawer lg:drawer-open">
                  <input id="my-drawer" type="checkbox" className="drawer-toggle" />
                  <div className="drawer-content flex flex-col">
                    {/* Mobile Navbar */}
                    <div className="lg:hidden navbar bg-base-100 shadow-sm">
                      <div className="flex-none">
                        <label htmlFor="my-drawer" className="btn btn-square btn-ghost">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="inline-block w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M4 6h16M4 12h16M4 18h16"
                            />
                          </svg>
                        </label>
                      </div>
                      <div className="flex-1">
                        <Link to="/" className="btn btn-ghost normal-case text-xl">
                          <span>
                            <span className="text-primary">Quick</span>Ops
                          </span>
                        </Link>
                      </div>
                    </div>

                    {/* Main Content */}
                    <main className="flex-1 p-4 md:p-6 lg:p-8">
                      <div className="max-w-7xl mx-auto">
                        <Routes>
                          <Route
                            path="/"
                            element={
                              <div className="max-w-7xl mx-auto">
                                <div className="flex justify-between items-center mb-6">
                                  <h1 className="text-2xl md:text-3xl font-bold">My Projects</h1>
                                  <Link to="/form" className="btn btn-primary btn-sm md:btn-md">
                                    + New Project
                                  </Link>
                                </div>
                                <ProjectList
                                  projects={projects}
                                  loading={loading}
                                  variant="full"
                                  onDelete={handleDeleteProject}
                                />
                              </div>
                            }
                          />
                          <Route
                            path="/form"
                            element={<Form handleAddProject={handleAddProject} />}
                          />
                          <Route
                            path="/project/:id"
                            element={
                              <ProjectDetail
                                onDelete={handleDeleteProject}
                                refreshProjects={fetchProjects}
                              />
                            }
                          />
                          <Route path="*" element={<Navigate to="/" />} />
                        </Routes>
                      </div>
                    </main>
                  </div>

                  {/* Sidebar */}
                  <div className="drawer-side z-20">
                    <label htmlFor="my-drawer" className="drawer-overlay"></label>
                    <Sidebar
                      projects={projects}
                      loading={loading}
                      handleAddProject={handleAddProject}
                      variant="compact"
                    />
                  </div>
                </div>
              </div>
            }
          />
        )}
      </Routes>
    </Router>
  );
}

export default App;
