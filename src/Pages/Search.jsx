import { NavLink, useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight, faCaretLeft } from "@fortawesome/free-solid-svg-icons";
import { useRef, useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
const Search = function ({ langCode }) {
  // const location = useLocation();
  // const { pathname } = location;
  // const searchQuery = pathname.slice(8);

  const [selected, setSelected] = useState("movies");
  const [results, setResults] = useState({});
  const { t } = useTranslation();
  // const [query, setQuery] = useState(window.location.hostname);
  const { query } = useParams();
  const navigate = useNavigate();

  const posterUrlBase = `https://image.tmdb.org/t/p/original`;
  const input = useRef();
  const options = useMemo(() => {
    return {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZWJiZTM1MDRhY2MwMzgyM2ZkNTA0YzIwMzI1NzFiMSIsInN1YiI6IjY2MjhlMGQ5MzQ0YThlMDE2NmFmMGUyZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.t0kntx9eQ3WaV9lZTYF90GOGI2-HJaY3GIDoBGIBAgo",
      },
    };
  }, []);
  const activeStyle = useMemo(() => {
    return `text-lime-500 bg-primary rounded-full py-1 transition duration-600 ease-in-out`;
  }, []);

  function hadleSelected(buttonName) {
    setSelected(buttonName);
  }

  function dateFormatter(date) {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const year = date.slice(0, 4);
    const month = Number(date.slice(5, 7));
    const day = date.slice(8, 10);
    return `${months[month - 1]} ${day}, ${year}`;
  }

  function handleSearch() {
    if (input.current.value) {
      navigate(`/search/${input.current.value}`);
    }
  }

  useEffect(() => {
    const URL = `https://api.themoviedb.org/3/search/tv?query=${query}&include_adult=false&language=en-US&page=1`;
    const fetchSearchResult = async function () {
      const res = await fetch(URL, options);
      const data = await res.json();
      const filtered = data.results.filter(
        (media) =>
          media.original_name &&
          media.overview &&
          media.poster_path &&
          media.vote_count
      );

      setResults((prev) => {
        return { ...prev, shows: filtered };
      });
      console.log(data.results);
    };

    fetchSearchResult();
  }, [query, options]);

  useEffect(() => {
    const URL = `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`;
    const fetchSearchResult = async function () {
      const res = await fetch(URL, options);
      const data = await res.json();
      const filtered = data.results.filter(
        (media) =>
          media.original_title &&
          media.overview &&
          media.poster_path &&
          media.vote_count
      );
      setResults((prev) => {
        return { ...prev, movies: filtered };
      });
    };
    fetchSearchResult();
  }, [query, options]);

  return (
    <>
      <NavBar />

      <div
        className={`px-2 md:px-4 lg:px-30 xl:px-40 2xl:px-60  flex ${
          langCode === "ar" ? "flex-row-reverse" : ""
        } `}
      >
        <div className={` h-fit shadow-lg flex flex-col gap-4 px-4 py-10 `}>
          <div className="flex gap-6 mb-6 ">
            <input
              type="text"
              className="px-2 py-2 text-xl outline-none bg-stone-100 rounded-lg"
              placeholder={t("searchPlaceHolder")}
              ref={input}
            />
            <button
              onClick={handleSearch}
              className="rounded-xl bg-primary px-4 text-xl text-stone-300 hover:text-stone-100 duration-100 "
            >
              {t("search")}
            </button>
          </div>
          <hr className="mb-2 text-primary" />
          <div className="border flex gap-1 rounded-full border-primary ">
            <button
              onClick={() => hadleSelected("movies")}
              className={`px-4 text-xl w-1/2  ${
                selected === "movies" ? activeStyle : `text-primary`
              } `}
            >
              {t("movies")}
            </button>
            <button
              onClick={() => hadleSelected("shows")}
              className={`px-4 text-xl w-1/2  ${
                selected === "shows" ? activeStyle : `text-primary`
              } `}
            >
              {t("tvShows")}
            </button>
          </div>
          <div
            className={`bg-primary text-stone-300 rounded-full pl-6 py-2 text-2xl cursor-pointer hover:text-stone-100 hover:translate-x-1 flex items-center justify-between pr-6 duration-300 ${
              langCode === "ar" ? "flex-row-reverse" : ""
            } `}
          >
            <span>
              {selected === "shows"
                ? `${t("airingToday")}`
                : `${t("nowPlaying")}`}{" "}
            </span>
            {langCode === "ar" ? (
              <FontAwesomeIcon icon={faCaretLeft} />
            ) : (
              <FontAwesomeIcon icon={faCaretRight} />
            )}
          </div>
          {selected === "movies" && (
            <div
              className={`bg-primary text-stone-300 rounded-full pl-6 py-2 text-2xl cursor-pointer hover:text-stone-100 hover:translate-x-1 flex items-center justify-between pr-6 duration-300 ${
                langCode === "ar" ? "flex-row-reverse" : ""
              } `}
            >
              <span>
                {selected === "shows"
                  ? `${t("airingToday")}`
                  : `${t("upComing")}`}{" "}
              </span>

              {langCode === "ar" ? (
                <FontAwesomeIcon icon={faCaretLeft} />
              ) : (
                <FontAwesomeIcon icon={faCaretRight} />
              )}
            </div>
          )}
          <div
            className={`bg-primary text-stone-300 rounded-full pl-6 py-2 text-2xl cursor-pointer hover:text-stone-100 hover:translate-x-1 flex items-center justify-between pr-6 duration-300 ${
              langCode === "ar" ? "flex-row-reverse" : ""
            } `}
          >
            <span>{t("popular")} </span>
            {langCode === "ar" ? (
              <FontAwesomeIcon icon={faCaretLeft} />
            ) : (
              <FontAwesomeIcon icon={faCaretRight} />
            )}
          </div>
          <div
            className={`bg-primary text-stone-300 rounded-full pl-6 py-2 text-2xl cursor-pointer hover:text-stone-100 hover:translate-x-1 flex items-center justify-between pr-6 duration-300 ${
              langCode === "ar" ? "flex-row-reverse" : ""
            } `}
          >
            <span>{t("topRated")} </span>
            {langCode === "ar" ? (
              <FontAwesomeIcon icon={faCaretLeft} />
            ) : (
              <FontAwesomeIcon icon={faCaretRight} />
            )}
          </div>
        </div>
        <div className="min-w-[40rem] flex flex-col gap-3 my-6 mx-6 ">
          {results.movies?.map((result) => (
            <div
              key={result.id + result.vote_count}
              className="rounded-xl overflow-hidden shadow-md flex "
            >
              <div>
                <NavLink to={`/movies/${result.id}`}>
                  <img
                    className="size-40 hover:opacity-95 "
                    src={posterUrlBase + result.poster_path}
                    alt="Media poster"
                  />
                </NavLink>
              </div>
              <div className="flex flex-col mx-2 my-2 text-xl">
                <NavLink to={`/movies/${result.id}`}>
                  <span className="font-bold">
                    {result.original_title || result.original_name}
                  </span>
                </NavLink>
                <span>{dateFormatter(result.release_date)}</span>
              </div>
            </div>
          ))}
          {results.shows?.map((result) => (
            <div
              key={result.id + result.vote_count}
              className="rounded-xl overflow-hidden shadow-md flex "
            >
              <div>
                <NavLink to={`/shows/${result.id}`}>
                  <img
                    className="size-40 hover:opacity-95 "
                    src={posterUrlBase + result.poster_path}
                    alt="Media poster"
                  />
                </NavLink>
              </div>
              <div className="flex flex-col mx-2 my-2 text-xl">
                <NavLink to={`/shows/${result.id}`}>
                  <span className="font-bold">
                    {result.original_title || result.original_name}
                  </span>
                </NavLink>
                <span>{dateFormatter(result?.first_air_date)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Search;
