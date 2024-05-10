import { useState, useEffect, useMemo } from "react";
import Card from "../components/Card";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
const NowPlaying = function ({ activeStyle, langCode }) {
  const [nowPlaying, setNowPlaying] = useState("movie");
  const [data, setData] = useState([]);
  const [isloaded, setIsLoaded] = useState(false);
  const { t } = useTranslation();

  function handleNowPlaying(buttonName) {
    setNowPlaying(buttonName);
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
    const URL =
      nowPlaying === "movie"
        ? `https://api.themoviedb.org/3/movie/now_playing?language=${langCode}&page=1`
        : `https://api.themoviedb.org/3/tv/on_the_air?language=${langCode}&page=1`;
    const fetchNowPlaying = async function () {
      const res = await fetch(URL, options);
      const data = await res.json();
      setData(data.results);
      console.log(data.results);
      setIsLoaded(true);
    };
    fetchNowPlaying();
  }, [langCode, nowPlaying, options]);

  return (
    <div className="px-2 md:px-6 lg:px-32 xl:px-44 2xl:px-64 mt-6 space-y-2">
      <div className="flex gap-4 items-center">
        <h2 className="text-4xl">{t("nowPlaying")}</h2>
        <div className="border flex gap-1 rounded-full border-primary ">
          <button
            onClick={() => handleNowPlaying("movie")}
            className={`px-4 text-lg  ${
              nowPlaying === "movie" ? activeStyle : `text-primary`
            } `}
          >
            {t("movies")}
          </button>
          <button
            onClick={() => handleNowPlaying("show")}
            className={`px-4 text-lg  ${
              nowPlaying === "show" ? activeStyle : `text-primary`
            } `}
          >
            {t("tvShows")}
          </button>
        </div>
      </div>
      <motion.div
        initial
        animate={{ y: 50 }}
        whileInView={{ y: 0 }}
        className="flex gap-3 overflow-auto scroll-smooth min-h-80"
      >
        {data.map((item) => (
          <Card
            key={item.id}
            movie={item}
            loaded={isloaded}
            type={nowPlaying}
          />
        ))}
      </motion.div>
      <hr className="mb-8 mt-14" />
    </div>
  );
};

export default NowPlaying;
