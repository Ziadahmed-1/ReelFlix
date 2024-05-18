import { useEffect, useMemo, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useLocation } from "react-router-dom";

import Card from "../components/Card";
import { useTranslation } from "react-i18next";

const Trending = function ({ activeStyle, langCode }) {
  const [trending, setTrending] = useState("Today");
  const [movies, setMovies] = useState([]);
  const [shows, setShows] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { t } = useTranslation();

  function hadleTrending(buttonName) {
    setTrending(buttonName);
  }

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

  useEffect(() => {
    setIsLoaded(false);
    const URL = `https://api.themoviedb.org/3/trending/movie/${
      trending === "Today" ? "day" : "week"
    }?language=${langCode}`;
    const fetchMovies = async function () {
      const res = await fetch(URL, options);
      const data = await res.json();
      setMovies(data.results);
      setIsLoaded(true);
    };
    fetchMovies();
  }, [langCode, options, trending]);

  useEffect(() => {
    const URL = `https://api.themoviedb.org/3/trending/tv/${
      trending === "Today" ? "day" : "week"
    }?language=${langCode}`;
    const fetchShows = async function () {
      setIsLoaded(false);
      const res = await fetch(URL, options);
      const data = await res.json();
      setShows(data.results);
      setIsLoaded(true);
    };
    fetchShows();
  }, [langCode, options, trending]);

  const location = useLocation();
  useEffect(() => {
    AOS.init();
  }, [location.pathname]);

  return (
    <div className="px-2 md:px-6 lg:px-32 xl:px-44 2xl:px-64 mt-6">
      <div className="flex gap-4 items-center">
        <h2 className=" text-2xl md:text-4xl">{t("trending")}</h2>
        <div className="border flex gap-1 rounded-full border-primary ">
          <button
            onClick={() => hadleTrending("Today")}
            className={`px-4 text-sm md:text-lg  ${
              trending === "Today" ? activeStyle : `text-primary`
            } `}
          >
            {t("today")}
          </button>
          <button
            onClick={() => hadleTrending("This Week")}
            className={`px-4 text-sm md:text-lg  ${
              trending === "This Week" ? activeStyle : `text-primary`
            } `}
          >
            {t("thisWeek")}
          </button>
        </div>
      </div>
      <div className="felx flex-col gap-2 ">
        <h3 className="text-2xl md:text-3xl mt-6">{t("movies")}</h3>
        <div
          data-aos="zoom-in-up"
          data-aos-delay="500"
          data-aos-duration="300"
          className="flex gap-3 overflow-auto scroll-smooth"
        >
          {movies.map((movie) => (
            <Card key={movie.id} movie={movie} type="movie" loaded={isLoaded} />
          ))}
        </div>
      </div>
      <div className="felx flex-col gap-2 ">
        <h3 className="text-2xl md:text-3xl mt-6">{t("tvShows")}</h3>
        <div
          data-aos="zoom-in-up"
          data-aos-delay="500"
          data-aos-duration="300"
          className="flex gap-3 overflow-auto scroll-smooth"
        >
          {shows.map((show) => (
            <Card key={show.id} movie={show} type="show" loaded={isLoaded} />
          ))}
        </div>
      </div>
      <hr className="my-6" />
    </div>
  );
};

export default Trending;
