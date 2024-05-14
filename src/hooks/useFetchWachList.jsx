import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../FireBase/FireBase";

function useFetchWachList({ userUID, trigger }) {
  const [watchList, setWatchList] = useState([]);
  const [idsInList, setIdsInList] = useState([]);

  useEffect(() => {
    async function handleFetchWachList() {
      // Add a new document in collection "cities"
      const docRef = collection(db, userUID);
      const docSnap = await getDocs(docRef);
      const ids = docSnap.docs.map((snap) => snap.id);
      const media = docSnap.docs.map((snap) => snap.data());
      setIdsInList(ids);
      setWatchList(media);
    }
    handleFetchWachList();
  }, [userUID, trigger]);

  return [watchList, idsInList, setWatchList, setIdsInList];
}

export default useFetchWachList;
