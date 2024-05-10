import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

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
      console.log(data.results);
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
      console.log(data.results);
      setShows(data.results);
      setIsLoaded(true);
    };
    fetchShows();
  }, [langCode, options, trending]);

  return (
    <div className="px-2 md:px-6 lg:px-32 xl:px-44 2xl:px-64 mt-6">
      <div className="flex gap-4 items-center">
        <h2 className="text-4xl">{t("trending")}</h2>
        <div className="border flex gap-1 rounded-full border-primary ">
          <button
            onClick={() => hadleTrending("Today")}
            className={`px-4 text-lg  ${
              trending === "Today" ? activeStyle : `text-primary`
            } `}
          >
            {t("today")}
          </button>
          <button
            onClick={() => hadleTrending("This Week")}
            className={`px-4 text-lg  ${
              trending === "This Week" ? activeStyle : `text-primary`
            } `}
          >
            {t("thisWeek")}
          </button>
        </div>
      </div>
      <div className="felx flex-col gap-2 ">
        <h3 className="text-3xl mt-6">{t("movies")}</h3>
        <motion.div
          initial
          animate={{ y: 50 }}
          transition={{ delay: 1 }}
          whileInView={{ y: 0 }}
          className="flex gap-3 overflow-auto scroll-smooth"
        >
          {movies.map((movie) => (
            <Card key={movie.id} movie={movie} loaded={isLoaded} />
          ))}
        </motion.div>
      </div>
      <div className="felx flex-col gap-2 ">
        <h3 className="text-3xl mt-6">{t("tvShows")}</h3>
        <motion.div
          initial
          animate={{ y: 50 }}
          whileInView={{ y: 0 }}
          className="flex gap-3 overflow-auto scroll-smooth"
        >
          {shows.map((show) => (
            <Card key={show.id} movie={show} loaded={isLoaded} />
          ))}
        </motion.div>
      </div>
      <hr className="my-6" />
    </div>
  );
};

export default Trending;
