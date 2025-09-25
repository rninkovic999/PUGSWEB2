const API_URL = process.env.REACT_APP_BACKEND_API_URL;

export const createQuestion = async (questionRequest) => {
  const token = localStorage.getItem("access_token");

  return await fetch(`${API_URL}/question/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(questionRequest),
  });
};

export const deleteQuestion = async (questionId) => {
  const token = localStorage.getItem("access_token");
  const response = await fetch(`${API_URL}/question/delete/${questionId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  let data;
  try {
    data = await response.json();
  } catch {
    data = { detail: await response.text() };
  }

  return { ok: response.ok, data };
};
