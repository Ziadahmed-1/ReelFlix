import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import src from "../assets/1_jT56BD_aMPdOjZgXPyCijw.jpg";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
FontAwesomeIcon;
faMagnifyingGlass;
const Hero = function ({ userName, langCode }) {
  const [query, setQuery] = useState(null);
  const search = useRef(null);
  const { t } = useTranslation();
  const coverStyle = {
    backgroundImage: `url(${src})`,
    height: "30rem",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  };

  return (
    <div className="px-2 md:px-4 lg:px-30 xl:px-40 2xl:px-60">
      <div style={coverStyle}></div>
      <div
        className={`text-stone-100 text-lg lg:text-xl 2xl:text-2xl p-4 md:pl-20 pt-20 space-y-2 absolute top-32`}
      >
        <p
          className={`font-extrabold 2xl:text-4xl sepia-0 ${
            langCode === "ar" ? "text-right" : ""
          }`}
        >
          {t("welcome")} <span className="">{userName}</span>
        </p>
        <p className={`font-bold ${langCode === "ar" ? "text-right" : ""}`}>
          {t("heroDescription")}
        </p>
        <form
          id="search"
          className="bg-stone-100 rounded-full flex items-center md:justify-between w-fit text-xs md:text-xl   "
        >
          <div className="ml-4 md:min-w-[30rem]">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="text-stone-600 mr-2"
            />
            <input
              required
              ref={search}
              onChange={() => setQuery(search.current.value)}
              className="bg-stone-100 outline-none text-stone-900  md:min-w-[27rem]"
              type="text"
              placeholder={t("searchPlaceHolder")}
            />
          </div>
          <NavLink to={query ? `/search/${query}` : ""}>
            <button
              type="submit"
              value="submit"
              className="bg-primary text-lime-500 rounded-full px-4 py-2 "
            >
              {t("search")}
            </button>
          </NavLink>
        </form>
      </div>
      <hr className="my-6" />
    </div>
  );
};

export default Hero;
