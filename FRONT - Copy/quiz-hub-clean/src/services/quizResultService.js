const API_URL = process.env.REACT_APP_BACKEND_API_URL;

export const getQuizResultsByQuizId = async (quizId) => {
  const token = localStorage.getItem("access_token");

  const response = await fetch(`${API_URL}/quiz-result/admin/${quizId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Failed to fetch quiz results");
  }

  return await response.json();
};

export const getAdminResultDetails = async (Id) => {
  const token = localStorage.getItem("access_token");

  const response = await fetch(`${API_URL}/quiz-result/admin/details/${Id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Failed to fetch result details");
  }

  return await response.json();
};
