import ProjectItem from "./ProjectItem";
import { FaFolderOpen, FaSpinner } from "react-icons/fa";

const ProjectList = ({ projects, loading, variant = "full", onDelete }) => {
  const isCompact = variant === "compact";

  if (loading) {
    return (
      <div
        className={`flex ${
          isCompact ? "justify-start px-2 py-3" : "justify-center py-12"
        } items-center gap-2 text-primary`}
      >
        <FaSpinner className="animate-spin" />
        <span>{isCompact ? "Loading..." : "Loading projects..."}</span>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div
        className={`${
          isCompact
            ? "px-2 py-3 text-sm"
            : "py-12 text-center flex flex-col items-center"
        } text-gray-500`}
      >
        <FaFolderOpen className={isCompact ? "inline mr-2" : "text-2xl mb-2"} />
        <span>{isCompact ? "No projects" : "No projects found"}</span>
        {!isCompact && (
          <p className="text-gray-400 mt-1 text-sm">
            Create your first project to get started
          </p>
        )}
      </div>
    );
  }

  return (
    <div
      className={
        isCompact
          ? "space-y-1"
          : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      }
    >
      {projects.map((project) => (
        <ProjectItem
          key={project._id}
          project={project}
          variant={variant}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ProjectList;
