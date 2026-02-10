import { Link } from "react-router";
import { Button } from "../components/ui/button";

export default function Home() {
  return (
    <div className="text-xl p-4 rounded-md flex flex-col items-start gap-4">
      <h1 className="text-2xl font-bold flex justify-center items-center ">
        <pre>SBA-</pre>
        <span className="font-normal text-sm  text-black">
          Session Based Auth
        </span>
      </h1>
      <pre className="text-sm">a session based auth with redis </pre>
      <Link to="a">
        <Button>Proceed</Button>
      </Link>
    </div>
  );
}
