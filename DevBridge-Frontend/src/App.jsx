import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Body from "./components/Body";
import Login from "./components/Login";
import Profile from "./components/Profile"

import { Provider } from "react-redux";
import { useSelector } from "react-redux";
import appStore from "./utils/appStore";
import Feed from "./components/Feed";
import Chat from "./components/Chat";
import Requests from "./components/Requests";

function AppRoutes() {
  const user = useSelector((store) => store.user);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Body />}>
          <Route
            index
            element={
              user ? <Navigate to="/feed" replace /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="feed"
            element={user ? <Feed /> : <Navigate to="/login" replace />}
          ></Route>
          <Route
            path="connections"
            element={user ? <Chat /> : <Navigate to="/login" replace />}
          ></Route>
          <Route
            path="requests"
            element={user ? <Requests /> : <Navigate to="/login" replace />}
          ></Route>
          <Route
            path="login"
            element={user ? <Navigate to="/feed" replace /> : <Login />}
          ></Route>
          <Route
            path="profile"
            element={user ? <Profile /> : <Navigate to="/login" replace />}
          ></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}


function App() {
  return (
    <div>
      <Provider store = {appStore}>
        <AppRoutes />
      </Provider>
    </div>
  );
}

export default App;
