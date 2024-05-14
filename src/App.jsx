import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./Pages/Home";
import Movie from "./Pages/Movie";
import Show from "./Pages/Show";
import Search from "./Pages/Search";
import { useTranslation } from "react-i18next";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import WatchList from "./Pages/WatchList";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
function App() {
  const { i18n } = useTranslation();
  const [name, setName] = useState("");
  const [userUID, setuserUID] = useState("");
  const [idsInList, setIdsInList] = useState([]);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setName(user.displayName);
        setuserUID(user.uid);
        // ...
      }
    });
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              userUID={userUID}
              userName={name}
              idsInList={idsInList}
              langCode={i18n.language}
            />
          }
        />
        <Route
          path="/movies/:movieId"
          element={
            <Movie userName={name} userUID={userUID} langCode={i18n.language} />
          }
        />
        <Route
          path="/shows/:showId"
          element={
            <Show userName={name} userUID={userUID} langCode={i18n.language} />
          }
        />
        <Route
          path="/search/:query"
          element={
            <Search
              userUID={userUID}
              userName={name}
              idsInList={idsInList}
              langCode={i18n.language}
            />
          }
        />
        <Route path="/login" element={<Login langCode={i18n.language} />} />
        <Route
          path="/register"
          element={<Register langCode={i18n.language} />}
        />
        <Route
          path="/watchlist/:id"
          element={
            <WatchList
              idsInList={idsInList}
              setIdsInList={setIdsInList}
              userName={name}
              userUID={userUID}
              langCode={i18n.language}
            />
          }
        />
        <Route
          path="*"
          element={
            <Home
              userUID={userUID}
              userName={name}
              idsInList={idsInList}
              langCode={i18n.language}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
