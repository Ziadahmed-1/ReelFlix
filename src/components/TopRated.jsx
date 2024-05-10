import { useMemo, useState, useEffect } from "react";
import Card from "../components/Card";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const TopRated = function ({ activeStyle, langCode }) {
  const [topRated, setTopRated] = useState("movie");
  const [data, setData] = useState([]);
  const [isloaded, setIsLoaded] = useState(false);
  const { t } = useTranslation();
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

  function handleTopRated(buttonName) {
    setTopRated(buttonName);
  }

  useEffect(() => {
    setIsLoaded(false);
    const URL =
      topRated === "movie"
        ? `https://api.themoviedb.org/3/movie/top_rated?language=${langCode}&page=1`
        : `https://api.themoviedb.org/3/tv/top_rated?language=${langCode}&page=1`;
    const fetchTopRated = async function () {
      const res = await fetch(URL, options);
      const data = await res.json();
      setData(data.results);
      setIsLoaded(true);
    };
    fetchTopRated();
  }, [langCode, topRated, options]);
  return (
    <div className="px-2 md:px-6 lg:px-32 xl:px-44 2xl:px-64 mt-6 space-y-2">
      <div className="flex gap-4 items-center">
        <h2 className="text-4xl">{t("topRated")}</h2>
        <div className="border flex gap-1 rounded-full border-primary ">
          <button
            onClick={() => handleTopRated("movie")}
            className={`px-4 text-lg  ${
              topRated === "movie" ? activeStyle : `text-primary`
            } `}
          >
            {t("movies")}
          </button>
          <button
            onClick={() => handleTopRated("show")}
            className={`px-4 text-lg  ${
              topRated === "show" ? activeStyle : `text-primary`
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
          <Card key={item.id} movie={item} loaded={isloaded} type={topRated} />
        ))}
      </motion.div>
    </div>
  );
};

export default TopRated;
