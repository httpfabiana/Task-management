const API = "http://localhost:5000/api/projects";

export const createProject = async(data) => {
  const res = await fetch(API, {
   method: "POST",
   headers: {
    "Content-Type": "application/json"
   },
   body: JSON.stringify(data)
  });

  const body = await res.json();

  if(!res.ok) {
    console.log("Backend error", body)
    throw new Error("Erro ao criar projetos")
  }

  return res.json();
}