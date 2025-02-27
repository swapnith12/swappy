import { useState , useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { userFetch } from "../(server)/actions/user/userFetch";

let session
const fetchSession = async () => {
  try {
    session = await userFetch()
    return session ?session: false ; 
  } catch (error) {
    console.error("Error fetching session:", error);
    return false; 
  }
};

export const useSession = () => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
    console.log("use Session triggered")
  }, []);
  return useQuery({
    queryKey: ["session"],
    queryFn: fetchSession,
    refetchOnWindowFocus:true,
    enabled: isClient,
    refetchOnMount:true                                
  });
};
