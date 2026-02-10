import { Navigate, Route, Routes } from "react-router";
import Auth from "./layout/Auth";
import Home from "./layout/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

function App() {
  // return <pre>Session Based Auth</pre>;
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="a" element={<Auth />}>
        <Route index element={<SignIn />} />
        <Route path="register" element={<SignUp />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
