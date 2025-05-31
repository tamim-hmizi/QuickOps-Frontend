import { useState, useEffect } from "react";
import { getLogs } from "../services/deployService";

const stageColor = (status) => {
  switch (status) {
    case "SUCCESS":
      return "bg-green-500";
    case "FAILED":
      return "bg-red-500";
    case "ABORTED":
      return "bg-gray-400";
    case "IN_PROGRESS":
      return "bg-yellow-400";
    default:
      return "bg-gray-300";
  }
};

const BuildStatusModal = ({
  stages = [],
  status = "Loading...",
  onClose,
  jobName,
  buildId,
}) => {
  const [showError, setShowError] = useState(false);
  const [errorLog, setErrorLog] = useState("");

  const failedStage = stages.find((s) => s.status === "FAILED");

  useEffect(() => {
    const fetchErrorLog = async () => {
      try {
        const res = await getLogs(jobName, buildId);
        setErrorLog(res.log || "No logs found.");
      } catch (err) {
        setErrorLog("⚠️ Failed to fetch error logs.", err);
      }
    };

    if (showError && failedStage) {
      fetchErrorLog();
    }
  }, [showError, failedStage, jobName, buildId]);

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Deployment Status</h3>

        {stages.length === 0 ? (
          <p className="text-gray-600">Loading stages...</p>
        ) : (
          <div className="flex gap-4 mb-4">
            {stages.map((stage) => (
              <div key={stage.id} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full ${stageColor(
                    stage.status
                  )}`}
                  title={stage.name}
                ></div>
                <p className="text-sm mt-1">{stage.name}</p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-2">
          {status === "SUCCESS" ? (
            <p className="text-green-600">✅ Deployment successful</p>
          ) : status === "FAILED" ? (
            <>
              <p className="text-red-600 mb-2">❌ Deployment failed</p>
              <div className="collapse collapse-arrow bg-red-50">
                <input
                  type="checkbox"
                  onChange={() => setShowError((prev) => !prev)}
                />
                <div className="collapse-title text-red-700 font-semibold">
                  Show error details for: {failedStage?.name || "Unknown stage"}
                </div>
                <div className="collapse-content">
                  <pre className="text-sm text-red-800 whitespace-pre-wrap">
                    {errorLog}
                  </pre>
                </div>
              </div>
            </>
          ) : status === "ABORTED" ? (
            <p className="text-gray-600">⚠️ Deployment aborted</p>
          ) : (
            <p>{status}</p>
          )}
        </div>

        <div className="modal-action mt-6">
          <button className="btn btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuildStatusModal;
