import { useQuery } from "@tanstack/react-query";
import { userFetch } from "../(server)/actions/user/userFetch";

const fetchSession = async () => {
  try {
    const session = await userFetch();
    return session ?session: false ; 
  } catch (error) {
    console.error("Error fetching session:", error);
    return false; 
  }
};

export const useSession = () => {
  return useQuery({
    queryKey: ["session"],
    queryFn: fetchSession,
    staleTime: 1000 * 60 * 5, 
  });
};
