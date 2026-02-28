// import { ArrowBigLeftDash } from "lucide-react";
// import { Link, Outlet } from "react-router";

// function Auth() {
//   return (
//     <main className="scale-75 md:scale-100">
//       <header className="pt-10 flex flex-col items-center justify-center w-full">
//         <h1 className=" ">
//           SBA - <span className="font-normal text-md ">Session Based Auth</span>
//         </h1>
//         <pre className="text-sm pt-2 pb-2">
//           a session based auth with redis{" "}
//         </pre>
//       </header>

//       <section className="pt-10 md:pt-5 md:scale-75 m-auto md:grid grid-cols-12 justify-center sm:w-full md:w-[50dvw] md:h-[60vh]">
//         <span className="col-start-1 col-end-1 cursor-pointer">
//           <Link to="/">
//             <ArrowBigLeftDash />
//           </Link>
//         </span>
//         <span
//           className="
//         col-start-2 col-end-12
//         "
//         >
//           <Outlet />
//         </span>
//       </section>
//     </main>
//   );
// }

// export default Auth;

// layout/Auth.tsx
import { UserLock } from "lucide-react";
import { Outlet } from "react-router";

const AuthLayout = () => {
  return (
    <div className="flex min-h-screen w-full justify-center scale-100">
      {/* 👈 Left Side: Pwedeng image, branding, o description */}
      <div className="hidden w-1/2 flex-col justify-between items-center  p-10 lg:flex scale-75">
        <div className="flex items-center gap-2 text-3xl  text-zinc-900 ">
          Session Based Authentication
        </div>
        <p className="font-thin ">using redis express-session and postgres</p>
        <div>
          <UserLock size={300} className="bg-zinc-50 text-zinc-900" />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-xl">
            "Secure your application with Redis-backed session management."
          </p>
          <p className="text-sm text-zinc-400">by: jordantanaliga100</p>
        </div>
      </div>

      {/* 👉 Right Side: Dito lalabas yung SignIn/SignUp */}
      <div className="flex w-full flex-col items-center justify-center p-6 lg:w-1/2">
        <div className="w-full max-w-sm">
          <Outlet /> {/* ✨ Dito magre-render ang SignIn o SignUp ✨ */}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
