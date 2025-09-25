const API_URL = process.env.REACT_APP_BACKEND_API_URL;

export const getResultDetails = async (resultId) => {
  const token = localStorage.getItem("access_token");

  const res = await fetch(`${API_URL}/quiz-result/details/${resultId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Failed to fetch result details");
  }

  return await res.json();
};

export const getTopResultsForQuiz = async (quizId, period) => {
  const token = localStorage.getItem("access_token");

  const res = await fetch(
    `${API_URL}/quiz-result/top?quizId=${quizId}&period=${period}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Failed to fetch leaderboard");
  }

  return await res.json();
};
