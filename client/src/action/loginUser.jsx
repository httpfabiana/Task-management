import { useUser } from '@clerk/react'
import { useEffect } from 'react'


function SyncUser(){
  const { user, isLoaded} = useUser();

  useEffect(() => {
   if(!isLoaded || !user ) return;

   const sync = async () => {
    const key = `synced_${user.id}`
    const alreadySynced = sessionStorage.getItem(key);

    if(alreadySynced) return;

    await fetch("http://localhost:5000/api/users/sync", {
     method: "POST",
     headers: {
      "Content-Type": "application/json"
     },
     body: JSON.stringify({
      id: user.id,
      name: user.fullName,
      email: user.primaryEmailAddress.emailAddress,
      image: user.imageUrl
     })
    })
     sessionStorage.setItem(key, "true");
   };

   sync()
  }, [user, isLoaded])

  return null;
}

export default SyncUser;