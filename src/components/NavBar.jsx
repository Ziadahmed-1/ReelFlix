import logo from "../assets/logo-no-background.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { NavLink, useNavigate } from "react-router-dom";
import saFlag from "../assets/saudi-arabia.svg";
import usFlag from "../assets/united-states.svg";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import useFetchWachList from "../hooks/useFetchWachList";
import { getAuth, signOut } from "firebase/auth";

const NavBar = function ({ userName, userUID, trigger }) {
  const [watchList, idsInList, setWatchList, setIdsInList] = useFetchWachList({
    userUID,
    trigger,
  });
  const { i18n, t } = useTranslation();
  const [dropOpen, setDropOpen] = useState(false);
  const [signOutDrop, setSignOutDrop] = useState(false);
  const [openLoginMsg, setOpenLoginMsg] = useState(false);
  const [navBarOpen, setNavBarOpen] = useState(false);
  //const navigate = useNavigate();
  const langCode = i18n.language;
  const navigate = useNavigate();

  function handleWatchList() {
    if (userUID) {
      navigate(`/watchlist/${userName}`);
    } else {
      setOpenLoginMsg(true);
      setTimeout(() => {
        setOpenLoginMsg(false);
      }, [3000]);
    }
  }

  function toggleNavBar() {
    setNavBarOpen((prev) => !prev);
    setDropOpen(false);
  }

  function handleLanguage(code) {
    if (code !== i18n.language) {
      i18n.changeLanguage(code);
      localStorage.setItem("code", JSON.stringify(code));
      setDropOpen(false);
      window.location.reload();
    }
  }
  function handleDrop(name) {
    if (name === "signOut") {
      setSignOutDrop((prev) => !prev);
      setDropOpen(false);
      setNavBarOpen(false);
    } else {
      setDropOpen((prev) => !prev);
      setSignOutDrop(false);
      setNavBarOpen(false);
    }
  }

  function handleSignOut() {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        navigate("/");
        window.location.reload();
      })
      .catch((error) => {
        console.log(error.message);
        // An error happened.
      });
  }
  return (
    <nav className="bg-primary w-full ">
      <div className="max-w-screen-xl relative flex flex-wrap items-center justify-between mx-auto p-4">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <NavLink to="/">
            <img
              src={logo}
              alt="reelflix logo"
              className="h-8 w-22 md:h-14 md:w-48 mr-4"
            />
          </NavLink>
        </div>
        <div className={`flex gap-4  `}>
          <button
            onClick={toggleNavBar}
            data-collapse-toggle="navbar-default"
            type="button"
            className={`inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-white rounded-lg md:hidden hover:bg-slate-900   ${
              navBarOpen ? "bg-slate-900" : ""
            }   `}
            aria-controls="navbar-default"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>

          <div className="relative flex md:hidden items-center  ">
            <FontAwesomeIcon
              onClick={() => handleDrop("lang")}
              icon={faGlobe}
              id="dropdownDefaultButton"
              data-dropdown-toggle="dropdown"
              className={`cursor-pointer size-6 md:size-8 text-stone-200 hover:text-stone-100 px-2 py-1 rounded-md hover:bg-slate-900 transition-all duration-200 space-x-2 ${
                dropOpen ? "bg-slate-900 " : ""
              }`}
              type="button"
            >
              Dropdown button{" "}
            </FontAwesomeIcon>

            {dropOpen && (
              <div
                id="dropdown"
                className="z-10 top-12 -left-32 absolute block bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
              >
                <ul
                  className="py-2 text-sm text-gray-700 dark:text-gray-200"
                  aria-labelledby="dropdownDefaultButton"
                >
                  <li
                    onClick={() => handleLanguage("ar")}
                    className={`flex items-center justify-center hover:bg-gray-600 cursor-pointer ${
                      i18n.language === "ar" ? "bg-gray-600" : ""
                    }`}
                  >
                    <img
                      src={saFlag}
                      alt="saudi flag"
                      className="size-8 inline-block mr-2 "
                    />
                    <button className="block px-4 py-2 text-center text-lg">
                      Arabic
                    </button>
                  </li>
                  <li
                    onClick={() => handleLanguage("en")}
                    className={`flex items-center justify-center hover:bg-gray-600 cursor-pointer ${
                      i18n.language === "en" ? "bg-gray-600" : ""
                    }`}
                  >
                    <img
                      src={usFlag}
                      alt="saudi flag"
                      className="size-8 inline-block mr-2 "
                    />
                    <button className="block px-4 py-2 text-center text-lg">
                      English
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {navBarOpen && (
          <div
            id="dropdown"
            className="z-10 top-16 right-20  absolute block bg-gray-700 divide-y divide-gray-100 rounded-lg shadow w-44 md:hidden "
          >
            <ul
              className="py-2  text-gray-700 dark:text-gray-200 "
              aria-labelledby="dropdownDefaultButton"
            >
              <li
                className={`flex items-center justify-center hover:bg-gray-600 cursor-pointer w-full mx-auto `}
              >
                <div
                  onClick={handleWatchList}
                  className={`text-stone-200 cursor-pointer hover:text-stone-100 px-2 py-1 rounded-md relative  transition-all items-center duration-200 flex gap-2  ${
                    langCode === "ar" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div>{t("myWatchlist")}</div>
                  <FontAwesomeIcon icon={faBookmark} />
                  {userName && (
                    <p
                      className={`bg-stone-900 px-1 text-center rounded-full text-sm absolute  top-0 ${
                        langCode === "ar" ? "left-0" : "right-0"
                      }`}
                    >
                      {idsInList?.length}
                    </p>
                  )}
                  {openLoginMsg && (
                    <div
                      data-aos="zoom-in"
                      className="absolute text-center w-40 -bottom-8 right-2 bg-amber-400 text-sm p-1 text-black font-semibold rounded-lg "
                    >
                      You have to login first!
                    </div>
                  )}
                </div>
              </li>
              <li
                className={`flex items-center justify-center hover:bg-gray-600 cursor-pointer mx-auto `}
              >
                {userName ? (
                  <div
                    className="relative cursor-pointer "
                    onClick={() => handleDrop("signOut")}
                  >
                    <div
                      className={`text-stone-200 hover:text-stone-100 px-2 py-1 rounded-md hover:bg-slate-900 transition-all duration-200 flex  gap-2 ${
                        langCode === "ar" ? "flex-row-reverse" : ""
                      }`}
                    >
                      {userName}
                    </div>
                    {signOutDrop && (
                      <div
                        id="signout"
                        className="z-10 top-12 -right-10 absolute block bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
                      >
                        <ul
                          className="py-2 text-sm text-gray-700 dark:text-gray-200"
                          aria-labelledby="dropdownDefaultButton"
                        >
                          <li
                            onClick={handleSignOut}
                            className={`flex items-center justify-center hover:bg-gray-600 cursor-pointer`}
                          >
                            <FontAwesomeIcon
                              icon={faRightToBracket}
                              className="size-6 inline-block mr-2 "
                            />
                            <button className="block px-4 py-2 text-center text-lg">
                              Sign Out
                            </button>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <NavLink
                    to="/login"
                    className={` text-stone-200 hover:text-stone-100 px-2 py-1 rounded-md items-center  transition-all duration-200 flex  gap-2  ${
                      langCode === "ar" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div>{t("login")}</div>
                    <FontAwesomeIcon icon={faRightToBracket} />
                  </NavLink>
                )}
              </li>
            </ul>
          </div>
        )}
        <div
          className={` hidden w-full md:block md:w-auto `}
          id="navbar-default"
        >
          <ul className="text-2xl flex flex-col p-4 md:p-0 mt-4 border  rounded-lg  md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0   ">
            <li>
              <div
                onClick={handleWatchList}
                className={`text-stone-200 cursor-pointer hover:text-stone-100 px-2 py-1 rounded-md relative hover:bg-slate-900 transition-all items-center duration-200 flex gap-2 ${
                  langCode === "ar" ? "flex-row-reverse" : ""
                }`}
              >
                <div>{t("myWatchlist")}</div>
                <FontAwesomeIcon icon={faBookmark} />
                {userName && (
                  <p
                    className={`bg-stone-900 px-1 text-center rounded-full text-sm absolute  top-0 ${
                      langCode === "ar" ? "left-0" : "right-0"
                    }`}
                  >
                    {idsInList?.length}
                  </p>
                )}
                {openLoginMsg && (
                  <div
                    data-aos="zoom-in"
                    className="absolute text-center w-40 -bottom-8 right-2 bg-amber-400 text-sm p-1 text-black font-semibold rounded-lg "
                  >
                    You have to login first!
                  </div>
                )}
              </div>
            </li>
            <li>
              {userName ? (
                <div
                  className="relative cursor-pointer"
                  onClick={() => handleDrop("signOut")}
                >
                  <div
                    className={`text-stone-200 hover:text-stone-100 px-2 py-1 rounded-md hover:bg-slate-900 transition-all duration-200 flex  gap-2 ${
                      langCode === "ar" ? "flex-row-reverse" : ""
                    }`}
                  >
                    {userName}
                  </div>
                  {signOutDrop && (
                    <div
                      id="signout"
                      className="z-10 top-12 -right-10 absolute block bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
                    >
                      <ul
                        className="py-2 text-sm text-gray-700 dark:text-gray-200"
                        aria-labelledby="dropdownDefaultButton"
                      >
                        <li
                          onClick={handleSignOut}
                          className={`flex items-center justify-center hover:bg-gray-600 cursor-pointer`}
                        >
                          <FontAwesomeIcon
                            icon={faRightToBracket}
                            className="size-6 inline-block mr-2 "
                          />
                          <button className="block px-4 py-2 text-center text-lg">
                            Sign Out
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <NavLink
                  to="/login"
                  className={`text-stone-200 hover:text-stone-100 px-2 py-1 rounded-md items-center hover:bg-slate-900 transition-all duration-200 flex  gap-2 ${
                    langCode === "ar" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div>{t("login")}</div>
                  <FontAwesomeIcon icon={faRightToBracket} />
                </NavLink>
              )}
            </li>
            <li>
              <div className="relative flex items-center ">
                <FontAwesomeIcon
                  onClick={() => handleDrop("lang")}
                  icon={faGlobe}
                  id="dropdownDefaultButton"
                  data-dropdown-toggle="dropdown"
                  className={`cursor-pointer size-6 md:size-8 text-stone-200 hover:text-stone-100 px-2 py-1 rounded-md hover:bg-slate-900 transition-all duration-200 space-x-2 ${
                    dropOpen ? "bg-slate-900 " : ""
                  }`}
                  type="button"
                >
                  Dropdown button{" "}
                </FontAwesomeIcon>

                {dropOpen && (
                  <div
                    id="dropdown"
                    className="z-10 top-12 -left-32 2xl:left-0 absolute block bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
                  >
                    <ul
                      className="py-2 text-sm text-gray-700 dark:text-gray-200"
                      aria-labelledby="dropdownDefaultButton"
                    >
                      <li
                        onClick={() => handleLanguage("ar")}
                        className={`flex items-center justify-center hover:bg-gray-600 cursor-pointer ${
                          i18n.language === "ar" ? "bg-gray-600" : ""
                        }`}
                      >
                        <img
                          src={saFlag}
                          alt="saudi flag"
                          className="size-8 inline-block mr-2 "
                        />
                        <button className="block px-4 py-2 text-center text-lg">
                          Arabic
                        </button>
                      </li>
                      <li
                        onClick={() => handleLanguage("en")}
                        className={`flex items-center justify-center hover:bg-gray-600 cursor-pointer ${
                          i18n.language === "en" ? "bg-gray-600" : ""
                        }`}
                      >
                        <img
                          src={usFlag}
                          alt="saudi flag"
                          className="size-8 inline-block mr-2 "
                        />
                        <button className="block px-4 py-2 text-center text-lg">
                          English
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
