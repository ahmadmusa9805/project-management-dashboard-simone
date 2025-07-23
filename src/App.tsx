import { useDispatch } from "react-redux";
import AppRoutes from "./routes/route";
import { useEffect } from "react";
import { loadFromStorage } from "./Redux/features/auth/authSlice";


const App = () => {

const dispatch = useDispatch();
 useEffect(() => {
    dispatch(loadFromStorage());
  }, [dispatch]);


  return (
    <>
      <AppRoutes />
      {/* add  */}
    </>
  );
}
export default App;