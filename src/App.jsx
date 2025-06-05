import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Form from "./pages/Form";
import ProjectList from "./components/ProjectList";
import ProjectDetail from "./pages/ProjectDetail";
import { useState, useEffect } from "react";
import { getAllProjects } from "./services/projectService";
import { Toaster } from "react-hot-toast";

function App() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const projectsData = await getAllProjects();
      setProjects(projectsData.projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleAddProject = (newProject) => {
    setProjects((prevProjects) => [...prevProjects, newProject]);
  };

  const handleDeleteProject = (deletedId) => {
    setProjects((prevProjects) =>
      prevProjects.filter((p) => p._id !== deletedId)
    );
  };

  return (
    <Router>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200">
        <div className="drawer lg:drawer-open">
          <input id="my-drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content flex flex-col">
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
                    ></path>
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

            <main className="flex-1 p-4 md:p-6 lg:p-8">
              <div className="max-w-7xl mx-auto">
                <Routes>
                  <Route
                    path="/"
                    element={
                      <div className="max-w-7xl mx-auto">
                        <div className="flex justify-between items-center mb-6">
                          <h1 className="text-2xl md:text-3xl font-bold">
                            My Projects
                          </h1>
                          <Link
                            to="/form"
                            className="btn btn-primary btn-sm md:btn-md"
                          >
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
                </Routes>
              </div>
            </main>
          </div>

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
    </Router>
  );
}

export default App;
