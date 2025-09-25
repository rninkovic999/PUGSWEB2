const API_URL = process.env.REACT_APP_BACKEND_API_URL;

export const createQuiz = async (quizRequest) => {
  const token = localStorage.getItem("access_token");

  return await fetch(`${API_URL}/quiz/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(quizRequest),
  });
};

export const getAllQuizzes = async (filters = {}) => {
  const token = localStorage.getItem("access_token");
  const params = new URLSearchParams();

  if (filters.keyword) params.append("keyword", filters.keyword);
  if (filters.category) params.append("category", filters.category);
  if (filters.difficulty) params.append("difficulty", filters.difficulty);

  return await fetch(`${API_URL}/quiz/get-all?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getAllCategories = async () => {
  const token = localStorage.getItem("access_token");
  return await fetch(`${API_URL}/quiz/get-all-categories`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getAdminQuizzes = async () => {
  const token = localStorage.getItem("access_token");

  return await fetch(`${API_URL}/quiz/get-all-quizzes-by-created-by-id/admin`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteQuiz = async (quizId) => {
  const token = localStorage.getItem("access_token");
  return await fetch(`${API_URL}/quiz/delete/${quizId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getQuizByIdWithAnswers = async (quizId) => {
  const token = localStorage.getItem("access_token");
  const response = await fetch(
    `${API_URL}/quiz/get-by-id-questions/answers/${quizId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  let data;
  try {
    data = await response.json();
  } catch {
    data = { detail: await response.text() };
  }

  return { ok: response.ok, data };
};

export const updateQuiz = async (quizId, requestBody) => {
  const token = localStorage.getItem("access_token");

  const response = await fetch(`${API_URL}/quiz/update/${quizId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(requestBody),
  });

  let data;
  try {
    data = await response.json();
  } catch {
    data = { detail: await response.text() };
  }

  return { ok: response.ok, data };
};

export const getQuizByIdWithQuestions = async (id) => {
  const token = localStorage.getItem("access_token");
  return await fetch(`${API_URL}/quiz/get-by-id-questions/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const submitQuizResult = async (
  quizId,
  userId,
  timeElapsedSeconds,
  userAnswers
) => {
  const token = localStorage.getItem("access_token");

  const payload = {
    quizId,
    userId,
    timeElapsedSeconds,
    answers: Object.entries(userAnswers).map(([questionId, answer]) => ({
      questionId,
      answer,
    })),
  };

  const response = await fetch(`${API_URL}/quiz-result/create`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Failed to submit quiz result.");
  }

  return await response.json();
};
