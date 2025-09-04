import { useEffect } from "react";
import { useDispatch } from "react-redux";
import AppRoutes from "./routes/route";
import { rehydrateUserFromToken } from "./Redux/features/auth/authSlice";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(rehydrateUserFromToken());
  }, [dispatch]);

  return <AppRoutes />;
};

export default App;
