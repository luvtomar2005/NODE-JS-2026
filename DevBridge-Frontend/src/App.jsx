import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Body from "./components/Body";
import Login from "./components/Login";
import Profile from "./components/Profile"
import Settings from "./components/Settings";

import { Provider } from "react-redux";
import { useSelector } from "react-redux";
import appStore from "./utils/appStore";
import Feed from "./components/Feed";

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
          <Route path="feed" element={<Feed />}></Route>
          <Route
            path="login"
            element={user ? <Navigate to="/feed" replace /> : <Login />}
          ></Route>
          <Route path="profile" element={<Profile />}></Route>
          <Route path="settings" element={<Settings />}></Route>
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
