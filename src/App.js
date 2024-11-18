import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Login from "./components/assesmentOne/LoginPage";
import Register from "./components/assesmentOne/Register";
import AssesmentThree from "./components/assesmentThree/Demo";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "./components/reduxAuth/slice/AuthSlice";

const App = () => {
  const dispatch = useDispatch();
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const [register, setRegister] = useState(false);

  const checkTokenExpiration = () => {
    const token = user?.token;
    if (token) {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        dispatch(logout());
      }
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      const intervalId = setInterval(checkTokenExpiration, 24 * 60 * 60 * 1000);

      checkTokenExpiration();

      return () => clearInterval(intervalId);
    }
  }, [isLoggedIn, user, dispatch]);

  return (
    <div>
      {isLoggedIn ? (
        <AssesmentThree />
      ) : !register ? (
        <Login setRegister={setRegister} isLoggedIn={isLoggedIn} />
      ) : (
        <Register setRegister={setRegister} isLoggedIn={isLoggedIn} />
      )}
    </div>
  );
};

export default App;
