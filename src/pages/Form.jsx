import { useState } from "react";
import { createProject } from "../services/projectService";
import { FaGithub, FaPlus, FaTrash, FaArrowLeft, FaLink } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

const Form = ({ handleAddProject }) => {
  const [name, setName] = useState("");
  const [frontendRepo, setFrontendRepo] = useState("");
  const [backendRepos, setBackendRepos] = useState([""]);
  const [githubToken, setGithubToken] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNameChange = (e) => setName(e.target.value);
  const handleFrontendRepoChange = (e) => setFrontendRepo(e.target.value);
  const handleBackendRepoChange = (index, e) => {
    const newBackendRepos = [...backendRepos];
    newBackendRepos[index] = e.target.value;
    setBackendRepos(newBackendRepos);
  };
  const handleAddBackendRepo = () => setBackendRepos([...backendRepos, ""]);
  const handleRemoveBackendRepo = (index) => {
    if (backendRepos.length <= 1) return;
    const newBackendRepos = backendRepos.filter((_, i) => i !== index);
    setBackendRepos(newBackendRepos);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const projectData = { name, frontendRepo, backendRepos, githubToken };

    try {
      const createdProject = await createProject(projectData);
      handleAddProject(createdProject.project);
      toast.success("Project created successfully!", {
        position: "top-center",
        duration: 3000,
      });
      // Reset form on success
      setName("");
      setFrontendRepo("");
      setBackendRepos([""]);
      setGithubToken("");
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error(error.response?.data?.message || "Error creating project", {
        position: "top-center",
        duration: 4000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/" className="btn btn-ghost gap-2">
          <FaArrowLeft /> Back to Projects
        </Link>
      </div>

      <div className="flex flex-col items-center">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-2xl bg-base-100 rounded-box shadow-lg p-6 md:p-8"
        >
          <h1 className="text-3xl font-bold text-center mb-8 text-primary">
            Create New Project
          </h1>

          <div className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text text-lg font-semibold">
                  Project Name
                </span>
              </label>
              <input
                type="text"
                value={name}
                onChange={handleNameChange}
                className="input input-bordered input-primary w-full"
                required
                placeholder="My Awesome Project"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-lg font-semibold">
                  GitHub Access Token
                </span>
              </label>
              <input
                type="password"
                value={githubToken}
                onChange={(e) => setGithubToken(e.target.value)}
                className="input input-bordered input-primary w-full"
                required
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxx"
              />
              <label className="label">
                <span className="label-text-alt text-gray-500">
                  Ensure this token has{" "}
                  <strong>read-only contents permission</strong>
                </span>
              </label>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-lg font-semibold">
                  Frontend Repository URL
                </span>
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={frontendRepo}
                  onChange={handleFrontendRepoChange}
                  className="input input-bordered input-primary w-full pl-10"
                  required
                  placeholder="https://github.com/username/frontend-repo"
                  pattern="https://.*"
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <FaLink />
                </span>
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text text-lg font-semibold">
                  Backend Repository URLs
                </span>
              </label>
              <div className="space-y-3">
                {backendRepos.map((repo, index) => (
                  <div key={index} className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="url"
                        value={repo}
                        onChange={(e) => handleBackendRepoChange(index, e)}
                        className="input input-bordered input-primary w-full pl-10"
                        required={index === 0}
                        placeholder="https://github.com/username/backend-repo"
                        pattern="https://.*"
                      />
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <FaLink />
                      </span>
                    </div>
                    {backendRepos.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveBackendRepo(index)}
                        className="btn btn-square btn-error"
                        aria-label="Remove repository"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddBackendRepo}
                  className="btn btn-outline btn-primary w-full mt-2 gap-2"
                >
                  <FaPlus />
                  Add Another Backend Repository
                </button>
              </div>
            </div>

            <div className="form-control mt-8">
              <button
                type="submit"
                className={`btn btn-primary ${isSubmitting ? "loading" : ""}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Project"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;
