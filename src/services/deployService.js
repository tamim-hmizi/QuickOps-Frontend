import api from "./api";

export const deploy = async (id) => {
  const res = await api.post("/deploy", { id });
  return res.data;
};

export const getLogs = async (jobName, buildId) => {
  const res = await api.get(`/logs/full/${jobName}/${buildId}`);
  return res.data;
};
