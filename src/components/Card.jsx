import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import placeHolder from "../assets/brocken-img.png";
import { NavLink } from "react-router-dom";

const Cart = function ({ movie, loaded, type }) {
  const posterUrlBase = `https://image.tmdb.org/t/p/original`;
  // const options = useMemo(() => {
  //   return {
  //     method: "GET",
  //     headers: {
  //       accept: "application/json",
  //       Authorization:
  //         "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZWJiZTM1MDRhY2MwMzgyM2ZkNTA0YzIwMzI1NzFiMSIsInN1YiI6IjY2MjhlMGQ5MzQ0YThlMDE2NmFmMGUyZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.t0kntx9eQ3WaV9lZTYF90GOGI2-HJaY3GIDoBGIBAgo",
  //     },
  //   };
  // }, []);

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

  const media = type || movie.media_type;
  const route =
    media === "movie" ? `/movies/${movie?.id}` : `/shows/${movie?.id}`;

  // useEffect(() => {
  //   const fetching = async function () {
  //     const res = await fetch(
  //       "https://api.themoviedb.org/3/tv/top_rated?language=en-US&page=1",
  //       options
  //     );
  //     const data = await res.json();
  //     console.log(data);
  //     setItem(() => data.results[18]);
  //   };
  //   fetching();
  // }, [options]);

  const progress = movie?.vote_average * 10;
  const ratingColor =
    progress >= 75 ? "#20C172" : progress >= 50 ? "#CDD030" : "#7C0F32";

  return (
    <div className="space-y-3  min-h-32  rounded-lg relative ">
      {loaded ? (
        <NavLink to={route}>
          <img
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
          src={placeHolder}
          alt="The movie / show poster"
          className="min-w-44 min-h-64 rounded-lg cursor-pointer hover:opacity-95"
        />
      )}
      <div className="ml-2 pt-2">
        <NavLink to={route}>
          <span className="font-bold text-lg text-pretty hover:cursor-pointer hover:text-primary transition-all duration-200">
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

export default Cart;
