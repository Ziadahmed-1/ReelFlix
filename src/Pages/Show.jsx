import { useParams } from "react-router-dom";
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
FontAwesomeIcon;
faLink;
import addToListImg from "../assets/bookmark.png";
import { useTranslation } from "react-i18next";

const Show = function ({ langCode }) {
  const { showId } = useParams();
  const [show, setShow] = useState({});
  const [showLocal, setShowLocal] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [trailer, setTrailer] = useState("");
  const [cast, setCast] = useState([]);
  const [crew, setCrew] = useState([]);
  const [similars, setSilmilars] = useState([]);
  const [err, setErr] = useState(null);
  const { t } = useTranslation();

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

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

  const genres = showLocal.genres ? showLocal.genres : show.genres;
  const textDirection = langCode === "ar" ? "text-right" : "text-left";
  const tagLine = showLocal.tagline || show.tagline;

  useEffect(() => {
    if (langCode === "ar") {
      const URL = `https://api.themoviedb.org/3/tv/${showId}?language=${langCode}`;
      const fetchMovie = async function () {
        try {
          const res = await fetch(URL, options);

          if (!res.ok) {
            throw new Error(
              "Sorry, we couldn't find the media you're looking for. It's possible that the ID is incorrect or there's an issue with our server. Please try again later"
            );
          } else {
            const data = await res.json();
            setShowLocal(data);
            console.log(data);
          }
        } catch (e) {
          //setErr(true); // Set the actual error message received from the API
          const errorMsg =
            e.message ||
            "Sorry, we couldn't find the media you're looking for. It's possible that the ID is incorrect or there's an issue with our server. Please try again later";
          setErr(errorMsg);
        }
      };
      fetchMovie();
    }
  }, [langCode, showId, options]);

  useEffect(() => {
    const URL = `https://api.themoviedb.org/3/tv/${showId}?language=en-US`;
    const fetchMovie = async function () {
      try {
        const res = await fetch(URL, options);

        if (!res.ok) {
          throw new Error(
            "Sorry, we couldn't find the media you're looking for. It's possible that the ID is incorrect or there's an issue with our server. Please try again later"
          );
        } else {
          const data = await res.json();
          setShow(data);
          console.log(data);
        }
      } catch (e) {
        //setErr(true); // Set the actual error message received from the API
        const errorMsg =
          e.message ||
          "Sorry, we couldn't find the media you're looking for. It's possible that the ID is incorrect or there's an issue with our server. Please try again later";
        setErr(errorMsg);
      }
    };
    fetchMovie();
  }, [showId, options]);

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
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const array = String(Number(minutes) / 60).split("");
    const hours = array[0];
    const mins = Math.floor((Number(array?.slice(2, 4).join("")) / 100) * 60);
    return `${hours}h ${mins !== 0 ? `${mins}m` : ""}`;
  }

  const posterUrlBase = `https://image.tmdb.org/t/p/original`;
  const progress = show?.vote_average * 10;
  const ratingColor =
    progress >= 75 ? "#20C172" : progress >= 50 ? "#CDD030" : "#7C0F32";

  useEffect(() => {
    if (!err) {
      const URL = `https://api.themoviedb.org/3/tv/${showId}/videos?language=en-US`;
      const fetchTrailer = async function () {
        const res = await fetch(URL, options);
        const data = await res.json();
        const name = data?.results.filter((obj) =>
          [
            "Official Trailer",
            "Official Trailer [Subtitled]",
            "Trailer",
            show.title,
          ].includes(obj?.name)
        );
        const type = data?.results.filter((obj) =>
          [
            "Official Trailer",
            "Official Trailer [Subtitled]",
            "Trailer",
            show.title,
          ].includes(obj?.type)
        );
        const trailer = [...name, ...type];
        setTrailer(trailer[0]?.key);
      };
      fetchTrailer();
    }
  }, [show.title, showId, options, err]);

  useEffect(() => {
    if (!err) {
      const URL = `https://api.themoviedb.org/3/tv/${showId}/credits?language=en-US`;
      const fetchCast = async function () {
        const res = await fetch(URL, options);
        const data = await res.json();
        setCrew(data.crew);
        const topBilled = data.cast.slice(0, 15);
        setCast(topBilled);
      };
      fetchCast();
    }
  }, [showId, options, err]);

  useEffect(() => {
    if (!err) {
      const URL = `https://api.themoviedb.org/3/tv/${showId}/similar?language=en-US&page=1`;
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
  }, [showId, options, err]);

  return (
    <>
      {err ? (
        <Error error={err} />
      ) : (
        <>
          <NavBar />
          <div
            className={`px-2 md:px-6 lg:px-32 xl:px-44 2xl:px-64 mt-6 ${textDirection}`}
          >
            <div
              className={`flex gap-12 ${
                langCode === "ar" ? "flex-row-reverse" : ""
              }`}
            >
              <img
                src={`${posterUrlBase}${
                  showLocal?.poster_path || show?.poster_path
                }`}
                alt="movie poster"
                className="w-64 min-w-64 rounded-lg  hover:opacity-95 "
              />
              <div className="flex flex-col gap-6">
                <div
                  className={`flex justify-between ${
                    langCode === "ar" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div className="flex flex-col">
                    <h1
                      className={`text-4xl font-semibold ${
                        langCode === "ar" ? "flex-row-reverse" : ""
                      }`}
                    >
                      {showLocal.name || show.original_title}{" "}
                      <span className="text-stone-500">
                        ({show?.first_air_date?.slice(0, 4)})
                      </span>
                    </h1>
                    <div className="text-md">
                      <h3 className="flex gap-2 ">
                        <span>
                          {`${dateFormatter(show?.first_air_date)} (${
                            show?.origin_country
                          }) - ${genres?.map(
                            (genre) => `${genre?.name} `
                          )}`}{" "}
                        </span>
                        {show.episode_run_time?.length > 0 && (
                          <span>({timeFormatter(show.episode_run_time)})</span>
                        )}
                      </h3>
                    </div>
                  </div>
                  <img
                    src={addToListImg}
                    alt="Add to watchList"
                    className="size-16 p-2 rounded-lg hover:bg-stone-100 hover:cursor-pointer duration-200 ease-in"
                  />
                </div>
                <div
                  className={`flex gap-16 items-center ${
                    langCode === "ar" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`flex gap-2 items-center text-center ${
                      langCode === "ar" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div className="size-16 text-5xl left-2 top-[13.8rem]  ">
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
                    <span className="text-xl">
                      {show.vote_count} <br />
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
                      showLocal.tagline ? "text-right" : "text-left"
                    }`}
                  >
                    {tagLine}
                  </p>
                  <h3 className="font-semibold text-xl">{t("overview")}</h3>
                  <p className="text-lg">
                    {showLocal.overview || show.overview}
                  </p>
                </div>
                <div className="flex justify-between flex-wrap">
                  <div>
                    <h4 className="text-xl font-semibold">{t("director")}</h4>
                    <span className="text-lg">
                      {
                        crew?.find(
                          (person) =>
                            person.job === "Director" ||
                            person.known_for_department === "Directing"
                        )?.name
                      }
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold">{t("producer")}</h4>
                    <span className="text-lg">
                      {
                        crew?.find(
                          (person) =>
                            person.job === "Producer" || "Executive Producer"
                        )?.name
                      }
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold ">
                      {t("productionCompanies")}
                    </h4>
                    <ul className="text-lg  gap-2 max-w-64">
                      {/* {show.production_companies
                        ? show.production_companies
                            .slice(0, 3)
                            .map((company) => company.name)
                            .join(" - ")
                        : "(Failed to load for now !)"} */}
                      {show.production_companies
                        ? show.production_companies.map((company) => (
                            <li key={company.id}>{company.name}</li>
                          ))
                        : "(Failed to load for now !)"}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <hr className="my-4" />
            {cast.length !== 0 && (
              <>
                <div>
                  <h3 className="text-2xl font-semibold mb-2">
                    {t("topBilledCast")}
                  </h3>
                  <div
                    className={`flex gap-2 overflow-x-scroll ${
                      langCode === "ar" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    {cast.map((actor) => (
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
              <div className="grid grid-cols-3 gap-6 ">
                <div>
                  <h4 className="text-xl font-semibold">{t("language")}</h4>
                  <span className="text-lg">
                    {show.spoken_languages
                      ? `${
                          show.spoken_languages.filter(
                            (lang) => lang.iso_639_1 === show.original_language
                          )[0].english_name
                        } (${show.origin_country})`
                      : "(Language can't be found!)"}
                  </span>
                </div>
                <div>
                  <h4 className="text-xl font-semibold">{t("tagline")}</h4>
                  <span className="text-lg">
                    {tagLine ? tagLine : "(Tagline can't be found!)"}
                  </span>
                </div>
                <div>
                  <h4 className="text-xl font-semibold">{t("status")}</h4>
                  <span className="text-lg">
                    {show.status ? show.status : "(status can't be found!)"}
                  </span>
                </div>

                <div>
                  <h4 className="text-xl font-semibold">{t("seasons")}</h4>
                  <span className="text-lg">
                    {show.seasons
                      ? show.number_of_seasons
                      : "(Seasons count can't be found!)"}
                  </span>
                </div>
                <div>
                  <h4 className="text-xl font-semibold">{t("episodes")}</h4>
                  <span className="text-lg">
                    {show.seasons
                      ? show.number_of_episodes
                      : "(Episodes count can't be found!)"}
                  </span>
                </div>
                <div>
                  <h4 className="text-xl font-semibold">{t("genres")}</h4>
                  <span className="text-lg">
                    {genres
                      ? genres.map((genre) => genre.name).join(" - ")
                      : "(Genres can't be found!)"}
                  </span>
                </div>

                <div>
                  <h4 className="text-xl font-semibold">{t("webSite")}</h4>
                  <a
                    className="text-lg hover:text-stone-500 hover:underline"
                    href={show.homepage}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <FontAwesomeIcon icon={faLink} />
                    {show.homepage
                      ? " Movie home page"
                      : "(Website can't be found!)"}
                  </a>
                </div>
                <div>
                  <h4 className="text-xl font-semibold">{t("showType")}</h4>
                  <span className="text-lg">
                    {show.type ? show.type : "(Show type can't be found!)"}
                  </span>
                </div>
                <div>
                  <h4 className="text-xl font-semibold">{t("audiance")}</h4>
                  <span className="text-lg ">
                    {show.popularity
                      ? `${show.popularity} ${t("fan")}`
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
              {similars.length > 0 ? (
                <div
                  className={`flex gap-3 overflow-auto scroll-smooth min-h-80 ${
                    langCode === "ar" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {similars?.map((movie) => (
                    <Cart key={movie?.id} movie={movie} loaded type="movie" />
                  ))}
                </div>
              ) : (
                <div className=" gap-3 overflow-auto scroll-smooth min-h-80 text-center flex justify-center font-semibold  text-xl">
                  <p className="pt-20">
                    We're currently working on improving this feature for this
                    show. To provide the best experience, we'll need some
                    additional data. Please check back soon!
                  </p>
                </div>
              )}
            </div>
          </div>

          <Footer />
        </>
      )}
    </>
  );
};

export default Show;
