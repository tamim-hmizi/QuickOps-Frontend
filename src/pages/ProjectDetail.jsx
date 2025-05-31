import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  getProjectById,
  updateProject,
  deleteProject,
} from "../services/projectService";
import {
  FaGithub,
  FaSpinner,
  FaInfoCircle,
  FaRocket,
  FaCheckCircle,
  FaTimesCircle,
  FaArrowLeft,
  FaTrash,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import { deploy } from "../services/deployService";
import BuildStatusModal from "../components/BuildStatusModal";

const ProjectDetail = ({ onDelete }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDeployment, setSelectedDeployment] = useState("");

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const projectData = await getProjectById(id);
        setProject(projectData.project);
        setSelectedDeployment(projectData.project.deploymentChoice || "");
      } catch (error) {
        console.error("Error fetching project:", error);
        setError("Failed to load project details");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleDeploymentUpdate = async () => {
    if (!selectedDeployment || !project) return;

    setSubmitting(true);
    try {
      await updateProject(project._id, {
        deploymentChoice: selectedDeployment,
      });
      const result = await deploy(project._id);
      setModalData(result);
      setShowModal(true);
      toast.success("Deployment started successfully!");
    } catch (err) {
      console.error("Error during deployment:", err);
      toast.error("Failed to start deployment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
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
      onDelete && onDelete(project._id); // <- Notify App
      navigate("/");
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
    } finally {
      setIsDeleting(false);
    }
  };

  const renderRepositoryLink = (url) => {
    if (!url) return null;
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="link link-primary flex items-center gap-2 hover:underline"
      >
        <FaGithub />
        {url.replace(/^https?:\/\//, "")}
      </a>
    );
  };

  const getStatusBadge = () => {
    switch (project.status) {
      case "deployed":
        return (
          <span className="badge badge-success gap-2 text-sm">
            <FaCheckCircle /> Deployed
          </span>
        );
      case "deploying":
        return (
          <span className="badge badge-warning gap-2 text-sm">
            <FaSpinner className="animate-spin" /> Deploying
          </span>
        );
      default:
        return (
          <span className="badge badge-error gap-2 text-sm">
            <FaTimesCircle /> Not Deployed
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-primary mb-4 mx-auto" />
          <p className="text-xl font-semibold">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="alert alert-error max-w-2xl shadow-lg">
          <div className="flex items-center gap-2">
            <FaInfoCircle className="text-2xl" />
            <span>{error || "Project not found"}</span>
          </div>
          <Link to="/" className="btn btn-sm mt-4">
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/" className="btn btn-ghost gap-2">
          <FaArrowLeft /> Back to Projects
        </Link>
      </div>

      <div className="max-w-6xl mx-auto bg-base-100 rounded-box shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-primary text-primary-content p-6 relative">
          {/* Delete button */}
          {project.status === "not deployed" && (
            <button
              onClick={handleDelete}
              className={`btn btn-ghost btn-sm absolute top-4 right-4 ${
                isDeleting ? "loading" : "opacity-60 hover:opacity-100"
              }`}
              disabled={isDeleting}
              aria-label="Delete project"
            >
              {!isDeleting && <FaTrash className="text-error" />}
            </button>
          )}

          {/* Title & badges */}
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl md:text-4xl font-bold">{project.name}</h1>
            <div className="flex flex-wrap items-center gap-2">
              {getStatusBadge()}
              {project.deploymentChoice && (
                <span className="badge badge-outline gap-2 text-sm">
                  <FaRocket /> {project.deploymentChoice}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="card bg-base-200 shadow-sm">
              <div className="card-body">
                <h2 className="card-title text-xl flex items-center gap-2">
                  <FaGithub className="text-primary" />
                  Frontend Repository
                </h2>
                <div className="mt-2">
                  {renderRepositoryLink(project.frontendRepo) || (
                    <span className="text-gray-500">Not specified</span>
                  )}
                </div>
              </div>
            </div>

            <div className="card bg-base-200 shadow-sm">
              <div className="card-body">
                <h2 className="card-title text-xl flex items-center gap-2">
                  <FaRocket className="text-primary" />
                  Backend Repositories
                </h2>
                <ul className="mt-2 space-y-2">
                  {project.backendRepos.length > 0 ? (
                    project.backendRepos.map((repo, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="badge badge-neutral">{index + 1}</span>
                        {renderRepositoryLink(repo)}
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500">No backend repositories</li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="card bg-base-200 shadow-sm">
              <div className="card-body">
                <h2 className="card-title text-xl flex items-center gap-2">
                  <FaRocket className="text-primary" />
                  Deployment Choice
                </h2>

                <div className="mt-4 space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="deployment"
                      value="VM"
                      checked={selectedDeployment === "VM"}
                      onChange={(e) => setSelectedDeployment(e.target.value)}
                      className="radio radio-primary"
                    />
                    <span>VM</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="deployment"
                      value="Kubernetes"
                      checked={selectedDeployment === "Kubernetes"}
                      onChange={(e) => setSelectedDeployment(e.target.value)}
                      className="radio radio-primary"
                    />
                    <span>Kubernetes</span>
                  </label>

                  <button
                    className="btn btn-primary mt-4 w-full flex items-center justify-center"
                    onClick={handleDeploymentUpdate}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" />
                        Updating...
                      </>
                    ) : (
                      "Deploy"
                    )}
                  </button>
                  {showModal && modalData && (
                    <BuildStatusModal
                      stages={modalData.stages}
                      status={modalData.status}
                      jobName={project.name}
                      buildId={modalData.buildId}
                      onClose={() => setShowModal(false)}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
