import { NavLink, useNavigate } from "react-router-dom";
import coverBg from "../assets/login-bg.jpg";
import reelFlix from "../assets/logo-no-background.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { useRef, useState } from "react";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { auth } from "../FireBase/FireBase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [userNameErr, setUserNameErr] = useState(null);
  const [emailErr, setEmailErr] = useState(null);
  const [passErr, setPassErr] = useState(null);
  const [authErr, setAuthErr] = useState(null);
  const [disable, setDisable] = useState(true);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const userNameInput = useRef();
  const emailInput = useRef();
  const passwordInput = useRef();
  const coverStyle = {
    backgroundImage: `url(${coverBg})`,
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    height: "100vh",
  };

  async function handleRegister(e) {
    setAuthErr(null);
    e.preventDefault();
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    let userName = userNameInput.current.value;
    let password = passwordInput.current.value;
    let email = emailInput.current.value;

    let removedSpacesUserName = userName.split(" ").join("");
    let removedSpacesPass = password.split(" ").join("");

    if (removedSpacesUserName.length !== userName.length) {
      setUserNameErr("User name mustn't contain spaces!");
      userNameInput.current.value = "";
    } else if (removedSpacesPass.length !== password.length) {
      setPassErr("Password mustn't contain spaces!");
      passwordInput.current.value = "";
    } else if (userName.length < 4) {
      setUserNameErr("User name must contain 4 chars at least!");
      userNameInput.current.value = "";
    } else if (password.length < 6) {
      setPassErr("Password must contain 6 chars at least!");
      passwordInput.current.value = "";
    } else if (!emailRegex.test(email)) {
      setEmailErr("Invalid email!");
    } else {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(auth?.currentUser, {
          displayName: userName,
        });
        setSuccess("The registration has been completed successfully!");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } catch (err) {
        passwordInput.current.value = "";
        userNameInput.current.value = "";

        if (err.message === "Firebase: Error (auth/email-already-in-use).")
          setAuthErr("This E-mail is already in use!");
        else {
          setAuthErr(
            "There is an issue with creating your account ,Please Try again later!"
          );
        }
      }
    }
  }

  function handleInputChange(inputName) {
    if (
      emailInput.current.value &&
      passwordInput.current.value &&
      userNameInput
    ) {
      setDisable(false);
    } else {
      setDisable(true);
    }
    if (inputName === "userName") {
      setUserNameErr(null);
    } else if (inputName === "email") {
      setEmailErr(null);
    } else if (inputName === "password") {
      setPassErr(null);
    }
  }

  return (
    <div style={coverStyle} className="flex items-center justify-center">
      <div className="bg-[#2A2A2A] shadow-slate-950 shadow-2xl flex flex-col items-center rounded-3xl py-10 px-20 gap-10">
        <img src={reelFlix} alt="reelFlix logo" className="w-48 h-14" />
        <h1 className="text-3xl font-semibold text-white">Welcome </h1>
        <form className="flex flex-col gap-6 text-center">
          <p className="text-xl font-semibold text-white">Enter Your Details</p>
          <div>
            <input
              onChange={() => handleInputChange("userName")}
              ref={userNameInput}
              type="text"
              required
              placeholder="User name"
              className="text-xl rounded-lg px-4 py-2 outline-none"
            />
            {userNameErr && (
              <p className="text-rose-500 absolute text-sm">{userNameErr}</p>
            )}
          </div>
          <div>
            <input
              onChange={() => handleInputChange("email")}
              ref={emailInput}
              type="email"
              required
              placeholder="Enter Your Email"
              className="text-xl rounded-lg px-4 py-2 outline-none"
            />
            {emailErr && (
              <p className="text-rose-500 absolute text-sm">{emailErr}</p>
            )}
          </div>

          <div className="text-xl rounded-lg relative bg-white mb-2">
            <input
              onChange={() => handleInputChange("password")}
              ref={passwordInput}
              type={showPassword ? "text" : "password"}
              required
              placeholder="Enter Your Password"
              className="text-xl rounded-lg px-4 py-2 outline-none "
            />
            {passErr && (
              <p className="text-rose-500 absolute text-sm">{passErr}</p>
            )}
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
            onClick={handleRegister}
            type="submit"
            className={`text-2xl rounded-lg px-4 py-2 outline-none bg-primary text-white font-semibold duration-300 ${
              disable
                ? "cursor-not-allowed opacity-70"
                : "cursor-pointer hover:bg-slate-700 "
            } `}
          >
            Sign Up
          </button>
          {success && (
            <p
              className="text-lime-500 max-w-64
              text-md font-semibold "
            >
              {success}
            </p>
          )}
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
        </div>{" "}
        <div className="text-stone-300">
          Already have account?{" "}
          <NavLink
            to="/login"
            className="text-rose-900 cursor-pointer hover:text-rose-700"
          >
            Log in
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default Register;
