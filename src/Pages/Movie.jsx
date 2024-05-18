import { useLocation, useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useMemo, useState, useEffect } from "react";
import styles from "../Pages/Movies.module.css";
import Error from "../Pages/Error";
import Cart from "../components/Card";
import brockenImg from "../assets/brocken-profile.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import addToListImg from "../assets/bookmark.png";
import addedToList from "../assets/star.png";
import { useTranslation } from "react-i18next";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../FireBase/FireBase";
import useFetchWachList from "../hooks/useFetchWachList";
import AOS from "aos";
import "aos/dist/aos.css";

const Movie = function ({ langCode, userName, userUID }) {
  const { movieId } = useParams();
  const [movie, setMovie] = useState({});
  const [movieLocal, setMovieLocal] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [trailer, setTrailer] = useState("");
  const [cast, setCast] = useState([]);
  const [crew, setCrew] = useState([]);
  const [similars, setSilmilars] = useState([]);
  const [err, setErr] = useState(null);
  const [inList, setInList] = useState(false);
  const { t } = useTranslation();
  const [trigger, setTrigger] = useState(false);
  const [openLoginMsg, setOpenLoginMsg] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };
  const [watchList, idsInList, setWatchList, setIdsInList] = useFetchWachList({
    userUID,
    trigger,
  });

  const location = useLocation();
  useEffect(() => {
    AOS.init();
  }, [location.pathname]);

  useEffect(() => {
    if (idsInList?.includes(String(movieId))) {
      setInList(true);
    } else {
      setInList(false);
    }
  }, [idsInList, movieId]);
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

  const genres = movieLocal.genres ? movieLocal.genres : movie.genres;
  const textDirection = langCode === "ar" ? "text-right" : "text-left";
  const tagLine = movieLocal.tagline ? movieLocal.tagline : movie.tagline;

  async function handleAddToWatchList() {
    if (userUID) {
      await setDoc(doc(db, userUID, movieId), movie);
      setInList(true);
      setTrigger((prev) => !prev);
    } else {
      setOpenLoginMsg(true);
      setTimeout(() => {
        setOpenLoginMsg(false);
      }, 3000);
    }
  }

  useEffect(() => {
    if (langCode === "ar") {
      const URL = `https://api.themoviedb.org/3/movie/${movieId}?language=${langCode}`;
      const fetchMovie = async function () {
        try {
          const res = await fetch(URL, options);

          if (!res.ok) {
            throw new Error(
              "Sorry, we couldn't find the media you're looking for. It's possible that the ID is incorrect or there's an issue with our server. Please try again later"
            );
          } else {
            const data = await res.json();
            setMovieLocal(data);
          }
        } catch (e) {
          const errorMsg =
            e.message ||
            "Sorry, we couldn't find the media you're looking for. It's possible that the ID is incorrect or there's an issue with our server. Please try again later";
          setErr(errorMsg);
        }
      };
      fetchMovie();
    }
  }, [langCode, movieId, options]);

  useEffect(() => {
    const URL = `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`;
    const fetchMovie = async function () {
      try {
        const res = await fetch(URL, options);

        if (!res.ok) {
          throw new Error(
            "Sorry, we couldn't find the media you're looking for. It's possible that the ID is incorrect or there's an issue with our server. Please try again later"
          );
        } else {
          const data = await res.json();
          setMovie(data);
        }
      } catch (e) {
        const errorMsg =
          e.message ||
          "Sorry, we couldn't find the media you're looking for. It's possible that the ID is incorrect or there's an issue with our server. Please try again later";
        setErr(errorMsg);
      }
    };
    fetchMovie();
  }, [langCode, movieId, options]);

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
    const year = date?.slice(0, 4);
    const month = Number(date?.slice(5, 7));
    const day = date?.slice(8, 10);
    return `${months[month - 1]} ${day}, ${year}`;
  }

  function timeFormatter(minutes) {
    const array = String(Number(minutes) / 60).split("");
    const hours = array[0];
    const mins = Math.floor((Number(array?.slice(2, 4).join("")) / 100) * 60);
    return `${hours}h ${mins !== 0 ? `${mins}m` : ""}`;
  }

  function cashFormatter(cash) {
    const arr = String(cash).split("");
    const length = arr?.length;
    const result = [];
    for (let i = 0; i < length; i++) {
      let cur = i + 1;
      if (cur % 3 === 0 && cur < length) {
        if (length - cur >= 3) {
          result.push(arr[i]);
          result.push(",");
        } else {
          result.push(arr[i]);
          result.push(".");
        }
      } else {
        result.push(arr[i]);
      }
    }
    return `$${result.join("")}`;
  }
  const posterUrlBase = `https://image.tmdb.org/t/p/original`;
  const progress = movie?.vote_average * 10;
  const ratingColor =
    progress >= 75 ? "#20C172" : progress >= 50 ? "#CDD030" : "#7C0F32";

  useEffect(() => {
    if (!err) {
      const URL = `https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US`;
      const fetchTrailer = async function () {
        const res = await fetch(URL, options);
        const data = await res.json();
        const name = data?.results.filter((obj) =>
          [
            "Official Trailer",
            "Official Trailer [Subtitled]",
            "Trailer",
            movie.title,
          ].includes(obj?.name)
        );
        const type = data?.results.filter((obj) =>
          [
            "Official Trailer",
            "Official Trailer [Subtitled]",
            "Trailer",
            movie.title,
          ].includes(obj?.type)
        );
        const trailer = [...name, ...type];
        setTrailer(trailer[0]?.key);
      };
      fetchTrailer();
    }
  }, [langCode, movie.title, movieId, options, err]);

  useEffect(() => {
    if (!err) {
      const URL = `https://api.themoviedb.org/3/movie/${movieId}/credits?language=${langCode}`;
      const fetchCast = async function () {
        const res = await fetch(URL, options);
        const data = await res.json();
        setCrew(data.crew);
        const topBilled = data.cast.slice(0, 15);
        setCast(topBilled);
      };
      fetchCast();
    }
  }, [langCode, movieId, options, err]);

  useEffect(() => {
    if (!err) {
      const URL = `https://api.themoviedb.org/3/movie/${movieId}/similar?language=en-US&page=1`;
      const fetchSimilars = async function () {
        const res = await fetch(URL, options);
        const data = await res.json();
        const similars = data.results.filter(
          (media) => media.overview && media.poster_path
        );
        setSilmilars(similars);
      };
      fetchSimilars();
    }
  }, [langCode, movieId, options, err]);

  return (
    <>
      {err ? (
        <Error error={err} />
      ) : (
        <>
          <NavBar userName={userName} trigger={trigger} userUID={userUID} />
          <div
            className={`px-2 md:px-6 lg:px-32 xl:px-44 2xl:px-64 mt-6 ${textDirection} `}
          >
            <div
              className={`flex flex-col gap-8 items-center md:flex-row ${
                langCode === "ar" ? "justify-between " : "gap-12"
              } `}
            >
              <img
                src={`${posterUrlBase}${
                  movieLocal?.poster_path || movie?.poster_path
                }`}
                alt="movie poster"
                className="min-w-64 w-64 rounded-lg  hover:opacity-95 "
              />
              <div className="flex flex-col gap-6 ">
                <div
                  className={`flex justify-between ${
                    langCode === "ar" ? "flex-row-reverse" : ""
                  } `}
                >
                  <div className="flex flex-col">
                    <h1
                      className={`text-xl md:text-4xl flex gap-2 font-semibold ${
                        langCode === "ar"
                          ? "flex-row-reverse text-right"
                          : "text-left"
                      } `}
                    >
                      {movieLocal.title ||
                        movieLocal.original_title ||
                        movie.original_title}{" "}
                      <span className="text-stone-500 ">
                        ({movie?.release_date?.slice(0, 4)})
                      </span>
                    </h1>
                    <div className="text-xs md:text-md">
                      <h3 className="flex gap-2">
                        <span>
                          {`${dateFormatter(movie?.release_date)} (${
                            movie?.origin_country
                          }) - ${genres?.map(
                            (genre) => `${genre?.name} `
                          )}`}{" "}
                        </span>

                        {movie.runtime && (
                          <span>({timeFormatter(movie.runtime)})</span>
                        )}
                      </h3>
                    </div>
                  </div>

                  {inList ? (
                    <img
                      src={addedToList}
                      alt="Already in the list"
                      className="md:w-16 md:min-w-16 w-12 min-w-12 p-2 rounded-lg hover:bg-stone-100 duration-200 ease-in"
                    />
                  ) : (
                    <div className="relative">
                      {" "}
                      <img
                        onClick={handleAddToWatchList}
                        src={addToListImg}
                        alt="Add to watchList"
                        className=" md:w-16 md:min-w-16 w-12 min-w-12  p-2 rounded-lg hover:bg-stone-100 hover:cursor-pointer duration-200 ease-in"
                      />
                      {openLoginMsg && (
                        <div
                          data-aos="zoom-in"
                          className="absolute text-center w-40 -bottom-8 -right-12 bg-amber-400 text-sm p-1 font-semibold rounded-lg "
                        >
                          You have to login first!
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div
                  className={`flex gap-16 items-center ${
                    langCode === "ar" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`flex gap-2 items-center ${
                      langCode === "ar" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div className="size-16 text-5xl left-2 top-[13.8rem] ">
                      <CircularProgressbar
                        background={true}
                        value={progress}
                        text={`${String(progress)?.slice(0, 2)}%`}
                        styles={buildStyles({
                          textSize: "36px",
                          pathColor: ratingColor,
                          backgroundColor: "#111",
                          textColor: "white",
                        })}
                      />
                    </div>
                    <span className="text-xl text-center">
                      {movie.vote_count} <br />
                      {t("votes")}
                    </span>
                  </div>
                  <div className="items-center">
                    <button onClick={openModal}>▶️Play Trailer</button>
                    {isOpen && (
                      <>
                        <div className="overlay" onClick={closeModal}></div>
                        <div className={`modal`}>
                          <div className={`modal-content ${styles.overlay}`}>
                            <span
                              className="text-6xl cursor-pointer absolute left-32 top-8"
                              onClick={closeModal}
                            >
                              &times;
                            </span>
                            <iframe
                              className="absolute left-36 top-20"
                              title="Trailer"
                              width="1600"
                              height="720"
                              src={`https://www.youtube.com/embed/${trailer}`}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowfullscreen
                            ></iframe>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <p
                    className={`mb-2 text-lg italic text-stone-500 ${
                      movieLocal.tagline === "ar" ? "text-right" : "text-left"
                    }`}
                  >
                    {tagLine}
                  </p>
                  <h3 className="font-semibold text-xl">{t("overview")}</h3>
                  <p className="md:text-lg ">
                    {movieLocal.overview || movie.overview}
                  </p>
                </div>
                <div className="flex flex-col md:flex-row gap-4 md:justify-between flex-wrap">
                  <div>
                    <h4 className="text-xl font-semibold">{t("director")}</h4>
                    <span className="text-lg">
                      {crew?.find(
                        (person) =>
                          person.job === "Director" ||
                          person.known_for_department === "Directing"
                      )?.name || "(Can't be found!)"}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold">{t("producer")}</h4>
                    <span className="text-lg">
                      {crew?.find((person) => person.job === "Producer")
                        ?.name || "(Can't be found!)"}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold">{t("editor")}</h4>
                    <span className="text-lg">
                      {crew?.find((person) => person.job === "Editor")?.name ||
                        "(Can't be found!)"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <hr className="my-4" />
            {cast && (
              <>
                <div>
                  <h3 className="text-2xl font-semibold mb-2">
                    {t("topBilledCast")}
                  </h3>
                  <div
                    className={`flex gap-2 overflow-x-auto ${
                      langCode === "ar" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    {cast?.map((actor) => (
                      <div
                        key={actor.cast_id}
                        className="min-w-44 rounded-lg overflow-hidden shadow-lg"
                      >
                        <img
                          src={
                            actor.profile_path
                              ? posterUrlBase + actor.profile_path
                              : brockenImg
                          }
                          alt="actor image"
                          className="min-w-44 w-44 aspect-[2/3]"
                        />
                        <h3 className="font-semibold px-2">
                          {actor.original_name}
                        </h3>
                        <h4 className="px-2 text-neutral-600 text-pretty">
                          {actor.character}
                        </h4>
                      </div>
                    ))}
                  </div>
                </div>

                <hr className="my-4" />
              </>
            )}
            <div>
              <h3 className="text-2xl font-semibold mb-4">{t("stats")}</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 ">
                <div>
                  <h4 className="text-xl font-semibold">{t("language")}</h4>
                  <span className="text-lg">
                    {movie.spoken_languages
                      ? `${
                          movie.spoken_languages.filter(
                            (lang) => lang.iso_639_1 === movie.original_language
                          )[0].english_name
                        } (${movie.origin_country})`
                      : "(Language can't be found!)"}
                  </span>
                </div>
                <div>
                  <h4 className="text-xl font-semibold">{t("tagline")}</h4>
                  <span className="text-lg">
                    {movie.tagline
                      ? movie.tagline
                      : "(Tagline can't be found!)"}
                  </span>
                </div>
                <div>
                  <h4 className="text-xl font-semibold">{t("status")}</h4>
                  <span className="text-lg">
                    {movie.status ? movie.status : "(status can't be found!)"}
                  </span>
                </div>

                <div>
                  <h4 className="text-xl font-semibold">{t("budget")}</h4>
                  <span className="text-lg">
                    {movie.budget > 0 ? cashFormatter(movie.budget) : "(TBD)"}
                  </span>
                </div>
                <div>
                  <h4 className="text-xl font-semibold">{t("revenue")}</h4>
                  <span className="text-lg">
                    {movie.revenue > 0 ? cashFormatter(movie.revenue) : "(TBD)"}
                  </span>
                </div>
                <div>
                  <h4 className="text-xl font-semibold">{t("genres")}</h4>
                  <span className="text-lg">
                    {genres
                      ? genres?.map((genre) => genre.name).join(" - ")
                      : "(Genres can't be found!)"}
                  </span>
                </div>

                <div>
                  <h4 className="text-xl font-semibold">{t("webSite")}</h4>
                  <a
                    className="text-lg hover:text-stone-500 hover:underline"
                    href={movie.homepage}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <FontAwesomeIcon icon={faLink} />
                    {movie.homepage
                      ? " Movie home page"
                      : "(Website can't be found!)"}
                  </a>
                </div>
                <div>
                  <h4 className="text-xl font-semibold">IMDB</h4>
                  <a
                    className="text-lg  hover:text-stone-500 hover:underline"
                    href={`https://www.imdb.com/title/${movie.imdb_id}/`}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <FontAwesomeIcon icon={faLink} />
                    {movie.imdb_id
                      ? " Movie IMDB page"
                      : "(IMDB page can't be found!)"}
                  </a>
                </div>
                <div>
                  <h4 className="text-xl font-semibold">{t("audiance")}</h4>
                  <span className="text-lg">
                    {movie.popularity
                      ? `${movie.popularity} ${t("fan")}`
                      : "(Audience count can't be found!)"}
                  </span>
                </div>
              </div>
            </div>
            <hr className="my-4" />
            <div>
              <h3 className="text-2xl font-semibold mb-2">
                {t("moreLikeThis")}
              </h3>
              <div data-aos="zoom-in-up" data-aos-delay="300">
                {similars?.length > 0 ? (
                  <div
                    className={`flex gap-3 overflow-auto scroll-smooth min-h-80 ${
                      langCode === "ar" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    {similars?.map((movie) => (
                      <Cart key={movie.id} movie={movie} loaded type="movie" />
                    ))}
                  </div>
                ) : (
                  <div className=" gap-3 overflow-auto scroll-smooth min-h-80 text-center flex justify-center font-semibold  text-xl">
                    <p className="pt-20">{t("similarErr")}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Footer />
        </>
      )}
    </>
  );
};

export default Movie;
