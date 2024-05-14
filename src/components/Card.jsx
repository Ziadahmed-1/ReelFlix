import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import placeHolder from "../assets/brocken-img.png";
import { NavLink } from "react-router-dom";

const Card = function ({ movie, loaded, type }) {
  const posterUrlBase = `https://image.tmdb.org/t/p/original`;

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

  const date = movie?.first_air_date
    ? movie?.first_air_date
    : movie?.release_date;

  const mediaChecked = movie.last_air_date ? "shows" : "movie";
  const media = type || mediaChecked;

  const route =
    media === "movie" ? `/movies/${movie?.id}` : `/shows/${movie?.id}`;

  const progress = movie?.vote_average * 10;
  const ratingColor =
    progress >= 75 ? "#20C172" : progress >= 50 ? "#CDD030" : "#7C0F32";

  return (
    <div className="space-y-3  min-h-32  rounded-lg relative ">
      {loaded ? (
        <NavLink to={route}>
          <img
            loading="lazy"
            src={
              movie?.poster_path
                ? posterUrlBase + movie?.poster_path
                : placeHolder
            }
            alt="The movie / show poster"
            className="min-w-44 w-44 min-h-[16.5rem] h-[16.5rem] rounded-lg cursor-pointer hover:opacity-95"
          />
        </NavLink>
      ) : (
        <img
          loading="lazy"
          src={placeHolder}
          alt="The movie / show poster"
          className="min-w-44 min-h-64 rounded-lg cursor-pointer hover:opacity-95"
        />
      )}
      <div className="ml-2 pt-2 min-w-44 w-44 ">
        <NavLink to={route}>
          <span className="font-bold text-lg text-pretty hover:cursor-pointer hover:text-lime-500 transition-all duration-200">
            {movie?.original_name || movie?.title}
          </span>
        </NavLink>
        <p>{date ? dateFormatter(date) : ""}</p>
      </div>
      <div className="size-12 text-5xl absolute left-2 top-[13.8rem] ">
        <CircularProgressbar
          background={true}
          value={progress}
          text={`${String(progress).slice(0, 2)}%`}
          styles={buildStyles({
            textSize: "36px",
            pathColor: ratingColor,
            backgroundColor: "#111",
            textColor: "white",
          })}
        />
      </div>
    </div>
  );
};

export default Card;
