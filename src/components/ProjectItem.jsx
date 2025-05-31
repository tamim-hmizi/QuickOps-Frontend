import { Link } from "react-router-dom";
import { useState } from "react";
import { deleteProject } from "../services/projectService";
import {
  FaTrash,
  FaRocket,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaChevronRight,
} from "react-icons/fa";
import { toast } from "react-hot-toast";

const ProjectItem = ({ project, variant = "full", onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const isCompact = variant === "compact";

  const getStatusBadge = () => {
    if (isCompact) {
      return (
        <span
          className={`badge badge-xs ${
            project.status === "deployed"
              ? "badge-success"
              : project.status === "deploying"
              ? "badge-warning"
              : "badge-error"
          }`}
        >
          {project.status === "deployed" ? (
            <FaCheckCircle />
          ) : project.status === "deploying" ? (
            <FaSpinner className="animate-spin" />
          ) : (
            <FaTimesCircle />
          )}
        </span>
      );
    }

    switch (project.status) {
      case "deployed":
        return (
          <span className="badge badge-success gap-2">
            <FaCheckCircle /> Deployed
          </span>
        );
      case "deploying":
        return (
          <span className="badge badge-warning gap-2">
            <FaSpinner className="animate-spin" /> Deploying
          </span>
        );
      default:
        return (
          <span className="badge badge-error gap-2">
            <FaTimesCircle /> Not Deployed
          </span>
        );
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (project.status === "deployed") {
      toast.error("Deployed projects cannot be deleted");
      return;
    }

    if (!window.confirm(`Are you sure you want to delete "${project.name}"?`)) {
      return;
    }

    try {
      setIsDeleting(true);
      await deleteProject(project._id);
      toast.success("Project deleted successfully!");
      onDelete && onDelete(project._id); // Notify parent to update UI
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isCompact) {
    return (
      <Link
        to={`/project/${project._id}`}
        className="flex items-center justify-between p-2 hover:bg-base-200 rounded transition-colors"
      >
        <div className="flex items-center gap-2 min-w-0">
          {getStatusBadge()}
          <span className="truncate">{project.name}</span>
        </div>
        <FaChevronRight className="text-gray-400 flex-shrink-0" />
      </Link>
    );
  }

  return (
    <div className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow h-full group">
      <div className="card-body p-4">
        <div className="flex justify-between items-start">
          <div className="min-w-0">
            <Link
              to={`/project/${project._id}`}
              className="card-title link link-hover truncate block"
              title={project.name}
            >
              {project.name}
            </Link>
            <div className="mt-2 flex flex-wrap gap-1">
              {getStatusBadge()}
              {project.deploymentChoice && (
                <span className="badge badge-outline">
                  <FaRocket className="mr-1" /> {project.deploymentChoice}
                </span>
              )}
            </div>
          </div>

          {project.status === "not deployed" && (
            <button
              onClick={handleDelete}
              className={`btn btn-ghost btn-sm opacity-0 group-hover:opacity-100 transition-opacity ${
                isDeleting ? "loading" : ""
              }`}
              disabled={isDeleting}
              aria-label="Delete project"
            >
              {!isDeleting && <FaTrash className="text-error" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectItem;
