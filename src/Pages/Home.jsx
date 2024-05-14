import NavBar from "../components/NavBar";
import Hero from "../components/Hero";
import Trending from "../components/Trending";
import NowPlaying from "../components/NowPlaying";
import TopRated from "../components/TopRated";
import Footer from "../components/Footer";
import { useMemo, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const Home = function ({ langCode, userName, idsInList, userUID }) {
  const activeStyle = useMemo(() => {
    return `text-lime-500 bg-primary rounded-full py-1 transition duration-600 ease-in-out`;
  }, []);
  useEffect(() => {
    AOS.init();
  }, []);
  return (
    <>
      <NavBar userName={userName} userUID={userUID} />
      <Hero userName={userName} langCode={langCode} />
      <Trending langCode={langCode} activeStyle={activeStyle} />
      <NowPlaying langCode={langCode} activeStyle={activeStyle} />
      <TopRated langCode={langCode} activeStyle={activeStyle} />
      <Footer />
    </>
  );
};

export default Home;
