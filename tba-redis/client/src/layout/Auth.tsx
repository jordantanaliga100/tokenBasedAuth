import { ArrowBigLeftDash } from "lucide-react";
import { Link, Outlet } from "react-router";

function Auth() {
  return (
    <main className="scale-75 md:scale-100">
      <header className="pt-10 flex flex-col items-center justify-center w-full">
        <h1 className=" ">
          SBA - <span className="font-normal text-md ">Session Based Auth</span>
        </h1>
        <pre className="text-sm pt-2 pb-2">
          a session based auth with redis{" "}
        </pre>
      </header>

      <section className="pt-10 md:pt-5 md:scale-75 m-auto md:grid grid-cols-12 justify-center sm:w-full md:w-[50dvw] md:h-[60vh]">
        <span className="col-start-1 col-end-1 cursor-pointer">
          <Link to="/">
            <ArrowBigLeftDash />
          </Link>
        </span>
        <span
          className="
        col-start-2 col-end-12
        "
        >
          <Outlet />
        </span>
      </section>
    </main>
  );
}

export default Auth;
