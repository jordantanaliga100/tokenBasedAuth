import { Outlet } from "react-router";

const HomeLayout = () => {
  return (
    <div className="flex min-h-screen w-full ">
      {/* <Link className="w-1/4 bg-zinc-100 p-4" to="/">
        <h2 className="font-bold text-2xl">SBA</h2>
      </Link> */}

      {/* 👉 Right Side */}
      <div className="w-full p-4">
        <Outlet /> {/* ✨ Main Content ✨ */}
      </div>
    </div>
  );
};

export default HomeLayout;
