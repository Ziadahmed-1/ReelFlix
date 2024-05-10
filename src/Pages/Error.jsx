import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
const Error = function ({ error }) {
  return (
    <div className="relative">
      <NavBar />
      <div className="flex flex-col items-center mt-56 gap-8">
        <FontAwesomeIcon icon={faCircleExclamation} className="size-20" />
        <p className="text-4xl text-center text-balance xl:mx-52 font-semibold">
          {error}
        </p>
        <NavLink
          to="/"
          className="bg-primary text-2xl text-stone-300 rounded-lg py-3 px-6 hover:text-stone-100  hover:bg-slate-800 uppercase duration-200"
        >
          Go back home
        </NavLink>
      </div>
      <Footer fixed={true} />
    </div>
  );
};

export default Error;
