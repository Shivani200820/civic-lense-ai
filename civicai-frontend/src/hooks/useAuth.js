import { useSelector } from "react-redux";

const useAuth = () => {
  const auth = useSelector((state) => state.auth);
  const user = useSelector((state) => state.user.profile);

  return {
    isAuthenticated: auth.isAuthenticated,
    token: auth.token,
    role: auth.role,
    user,
  };
};

export default useAuth;