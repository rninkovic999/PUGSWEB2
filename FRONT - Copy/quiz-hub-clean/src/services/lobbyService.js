const API_URL = process.env.REACT_APP_BACKEND_API_URL;

export const createLobby = async (lobbyRequest) => {
  const token = localStorage.getItem("access_token");

  const response = await fetch(`${API_URL}/lobby/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(lobbyRequest),
  });

  let data;
  try {
    data = await response.json();
  } catch {
    data = { detail: await response.text() };
  }

  return { ok: response.ok, data };
};

export const getQuizTitles = async () => {
  const token = localStorage.getItem("access_token");

  const response = await fetch(`${API_URL}/quiz/get-all-titles`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  let data;
  try {
    data = await response.json();
    console.log("Quiz Titles Response", data);
  } catch {
    data = { detail: await response.text() };
  }

  return { ok: response.ok, data };
};

export const getActiveLobbies = async () => {
  const token = localStorage.getItem("access_token");

  const response = await fetch(`${API_URL}/lobby/active`, {
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

export const joinLobby = async (lobbyId) => {
  const token = localStorage.getItem("access_token");

  const response = await fetch(`${API_URL}/lobby/${lobbyId}/join`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  let dataText = await response.text(); // pročitaj kao tekst (samo jednom)
  let data;

  try {
    data = JSON.parse(dataText); // pokušaj da parsiraš kao JSON
  } catch {
    data = { detail: dataText }; // ako nije JSON, stavi plain text
  }

  return { ok: response.ok, data };
};

export const getParticipantsForLobby = async (lobbyId) => {
  const token = localStorage.getItem("access_token");

  const response = await fetch(`${API_URL}/lobby/participants/${lobbyId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text);
  }

  const data = await response.json();
  return {
    usernames: data.usernames || [],
    startAt: data.startAt,
  };
};
