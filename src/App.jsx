import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./Pages/Home";
import Movie from "./Pages/Movie";
import Show from "./Pages/Show";
import Search from "./Pages/Search";
import { useTranslation } from "react-i18next";
function App() {
  const { i18n } = useTranslation();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home langCode={i18n.language} />} />
        <Route
          path="/movies/:movieId"
          element={<Movie langCode={i18n.language} />}
        />
        <Route
          path="/shows/:showId"
          element={<Show langCode={i18n.language} />}
        />
        <Route
          path="/search/:query"
          element={<Search langCode={i18n.language} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
