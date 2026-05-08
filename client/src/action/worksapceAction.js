const API = "http://localhost:5000/api/workspaces";

export const createWorkspace = async(name) => {
  const res = await fetch(API, {
   method: "POST",
   headers: {
    "Content-Type": "application/json"
   },
   body: JSON.stringify({name})
  });

  if(!res.ok) throw new Error("Error ao criar workspace")

  return res.json()
};

export const getWorksapce = async() => {
  const res = await fetch(API);

  if(!res.ok) throw new Error("Erro ao buscar worksapces");

  return res.json()
}