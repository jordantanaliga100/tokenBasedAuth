// import { Navigate, Route, Routes } from "react-router";
// import PublicRoute from "./guards/Public";
// import Auth from "./layout/Auth";
// import Home from "./layout/Home";
// import SignIn from "./pages/SignIn";
// import SignUp from "./pages/SignUp";

// function App() {
//   return (
//     <Routes>
//       <Route path="/" element={<Home />} />
//       <Route element={<PublicRoute />}>
//         <Route path="a" element={<Auth />}>
//           <Route index element={<SignIn />} />
//           <Route path="r" element={<SignUp />} />
//         </Route>
//       </Route>
//       <Route path="*" element={<Navigate to="/" replace />} />
//     </Routes>
//   );
// }

// export default App;

import { Navigate, Route, Routes } from "react-router";
import PrivateRoute from "./guards/Private"; // Siguraduhin mong meron nito
import PublicRoute from "./guards/Public";
import AuthLayout from "./layout/Auth"; // Yung split-screen na layout
import HomeLayout from "./layout/Home"; // Yung dashboard layout
import Dashboard from "./pages/Dashbaord";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

function App() {
  return (
    <Routes>
      {/* 🏠 PROTECTED ROUTES (Home) */}
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<HomeLayout />}>
          <Route index element={<Dashboard />} />
        </Route>
      </Route>

      {/* 🔐 AUTH ROUTES (Public) */}
      <Route element={<PublicRoute />}>
        <Route path="a" element={<AuthLayout />}>
          {/* Default view ng /a ay SignIn */}
          <Route index element={<SignIn />} />
          {/* View ng /a/r ay SignUp */}
          <Route path="r" element={<SignUp />} />
        </Route>
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
      </Route>

      {/* 404 Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
