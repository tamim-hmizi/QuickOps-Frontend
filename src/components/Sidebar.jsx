import { Link } from "react-router-dom";
import { FaBars, FaPlus } from "react-icons/fa";
import ProjectList from "./ProjectList";

const Sidebar = ({
  projects,
  loading,
  handleAddProject,
  variant = "compact",
}) => {
  return (
    <div className="menu p-4 w-80 h-full bg-base-100 text-base-content border-r border-base-300">
      <div className="p-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <span className="text-xl font-bold text-white">QO</span>
          </div>
          <h1 className="text-xl font-semibold">
            <span className="text-primary">Quick</span>Ops
          </h1>
        </Link>
      </div>

      <div className="p-4">
        <Link to="/form" className="btn btn-primary w-full gap-2">
          <FaPlus />
          Add Project
        </Link>
      </div>

      <div className="px-4 py-3 border-t border-b border-base-300">
        <h2 className="font-semibold text-sm uppercase tracking-wider">
          Projects
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        <ProjectList
          projects={projects}
          loading={loading}
          variant={variant}
          handleAddProject={handleAddProject}
        />
      </div>

      <div className="p-4 border-t border-base-300 text-xs text-base-content/70">
        © {new Date().getFullYear()} QuickOps. All rights reserved.
      </div>
    </div>
  );
};

export default Sidebar;
