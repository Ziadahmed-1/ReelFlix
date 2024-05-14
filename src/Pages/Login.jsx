import coverBg from "../assets/login-bg.jpg";
import reelFlix from "../assets/logo-no-background.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink, useNavigate } from "react-router-dom";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { useState, useRef } from "react";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { auth } from "../FireBase/FireBase";
import { signInWithEmailAndPassword } from "firebase/auth";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [authErr, setAuthErr] = useState(null);
  const [disable, setDisable] = useState(true);

  const navigate = useNavigate();

  const coverStyle = {
    backgroundImage: `url(${coverBg})`,
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    height: "100vh",
  };
  const emailInput = useRef();
  const passwordInput = useRef();
  function handleLoginBtn() {
    if (emailInput.current.value && passwordInput.current.value) {
      setDisable(false);
    } else {
      setDisable(true);
    }
  }
  async function handleLogIn(e) {
    e.preventDefault();
    const email = emailInput.current.value;
    const password = passwordInput.current.value;
    if (email && password)
      try {
        await signInWithEmailAndPassword(auth, email, password);
        navigate("/");
        window.location.reload();
      } catch (err) {
        if (err.message === "Firebase: Error (auth/invalid-credential).") {
          setAuthErr("Invalid Email or Password!");
        } else {
          setAuthErr("There's somthing wrong ,Try again later!");
        }
      }
  }
  return (
    <div style={coverStyle} className="flex items-center justify-center">
      <div className="bg-[#2A2A2A] shadow-slate-950 shadow-2xl flex flex-col items-center rounded-3xl py-10 px-20 gap-10">
        <img src={reelFlix} alt="reelFlix logo" className="w-48 h-14" />
        <h1 className="text-3xl font-semibold text-white">Welcome Back</h1>

        <form className="flex flex-col gap-4 text-center">
          <p className="text-xl font-semibold text-white">Enter Your Details</p>
          <input
            onChange={handleLoginBtn}
            ref={emailInput}
            type="email"
            required
            placeholder="Enter Your Email"
            className="text-xl rounded-lg px-4 py-2 outline-none"
          />
          <div className="text-xl rounded-lg relative bg-white">
            <input
              onChange={handleLoginBtn}
              ref={passwordInput}
              type={showPassword ? "text" : "password"}
              required
              placeholder="Enter Your Password"
              className="text-xl rounded-lg px-4 py-2 outline-none "
            />
            {showPassword ? (
              <FontAwesomeIcon
                className="cursor-pointer absolute right-2 top-3"
                icon={faEye}
                onClick={() => setShowPassword((prev) => !prev)}
              />
            ) : (
              <FontAwesomeIcon
                className="absolute right-2 top-3 cursor-pointer"
                icon={faEyeSlash}
                onClick={() => setShowPassword((prev) => !prev)}
              />
            )}
          </div>
          <button
            disabled={disable}
            onClick={handleLogIn}
            type="submit"
            className={`text-2xl rounded-lg px-4 py-2 outline-none bg-primary text-white font-semibold duration-300 ${
              disable
                ? "cursor-not-allowed opacity-70"
                : "cursor-pointer hover:bg-slate-700 "
            } `}
          >
            Login
          </button>
          {authErr && (
            <p
              className="text-rose-500 max-w-64
              text-md font-semibold"
            >
              {authErr}
            </p>
          )}
        </form>
        <div className="w-full relative">
          <hr className=" border-neutral-200 w-full" />
          <div className="text-neutral-200 w-10 h-10 absolute  top-1/2 left-1/2 bg-[#2A2A2A] -translate-x-1/2 -translate-y-1/2 "></div>
        </div>
        <div className="text-stone-300">
          Don&apos;t have account?{" "}
          <NavLink to="/register" className="text-rose-900  hover:opacity-95">
            Sign Up
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default Login;
