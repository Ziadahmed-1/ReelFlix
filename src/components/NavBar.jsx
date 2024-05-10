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

const NavBar = function () {
  const { i18n, t } = useTranslation();
  const [dropOpen, setDropOpen] = useState(false);
  //const navigate = useNavigate();

  function handleLanguage(code) {
    i18n.changeLanguage(code);
    localStorage.setItem("code", JSON.stringify(code));
    setDropOpen(false);
    if (i18n.language !== code) {
      window.location.reload();
    }
  }

  return (
    <div className="bg-primary w-full flex flex-col md:flex-row gap-4 md:justify-between items-center text-stone-200 text-sm lg:text-xl px-2 md:px-4 lg:px-30 xl:px-40 2xl:px-60 2xl:text-2xl  py-2   ">
      <div className="flex gap-2 items-center 2xl:gap-6">
        <NavLink to="/">
          <img
            src={logo}
            alt="reelflix logo"
            className="h-4 w-18 md:h-14 md:w-48 mr-4"
          />
        </NavLink>
      </div>
      <div className=" flex gap-2 2xl:gap-6">
        <div className="text-stone-200 hover:text-stone-100 px-2 py-1 rounded-md hover:bg-slate-900 transition-all duration-200 space-x-2">
          <a href="">{t("myWatchlist")}</a>
          <FontAwesomeIcon icon={faBookmark} />
        </div>

        <div className="text-stone-200 hover:text-stone-100 px-2 py-1 rounded-md hover:bg-slate-900 transition-all duration-200 space-x-2">
          <a href="">{t("login")}</a>
          <FontAwesomeIcon icon={faRightToBracket} />
        </div>

        <div className="relative flex items-center ">
          <FontAwesomeIcon
            onClick={() => setDropOpen((prev) => !prev)}
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
              className="z-10 top-12 absolute block bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
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
        {/* <FontAwesomeIcon
          icon={faGlobe}
          className="size-6 2xl:size-7 hover:text-stone-100 px-2 py-1 rounded-md hover:bg-slate-900 hover:cursor-pointer transition-all duration-200"
        /> */}
      </div>
    </div>
  );
};

export default NavBar;
