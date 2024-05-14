import { collection, doc, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "../FireBase/FireBase";
import NavBar from "../components/NavBar";
import Card from "../components/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import useFetchWachList from "../hooks/useFetchWachList";
import { useTranslation } from "react-i18next";

function WatchList({ userUID, userName, langCode }) {
  const { t } = useTranslation();
  const [watchList, idsInList, setWatchList, setIdsInList] = useFetchWachList({
    userUID,
  });

  async function hanleRemoveMedia(id) {
    await deleteDoc(doc(db, userUID, String(id)));
    async function handleFetchWachList() {
      const docRef = collection(db, userUID);
      const docSnap = await getDocs(docRef);
      const ids = docSnap.docs.map((snap) => snap.id);
      const media = docSnap.docs.map((snap) => snap.data());
      setIdsInList(ids);
      setWatchList(media);
    }
    handleFetchWachList();
  }
  return (
    <div className="relativ ">
      <NavBar idsInList={idsInList} userUID={userUID} userName={userName} />
      <div className="px-2 md:px-6 lg:px-32 xl:px-44 2xl:px-80 mt-6">
        <h1
          className={`text-3xl  font-semibold
      my-4 mx-4 ${langCode === "ar" ? "text-right" : ""}`}
        >{`${userName} ${t("watchList")}`}</h1>
        <div
          className={`flex gap-6 flex-wrap ${
            langCode === "ar" ? "flex-row-reverse" : ""
          }`}
        >
          {watchList?.map((media) => (
            <div
              key={media.id}
              className="group relative flex flex-col items-center"
            >
              <Card movie={media} loaded />
              <FontAwesomeIcon
                onClick={() => hanleRemoveMedia(media?.id)}
                icon={faTrash}
                className="size-8 cursor-pointer hidden absolute bottom-20 right-5 group-hover:block hover:text-rose-800 bg-stone-100 rounded-full p-2"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WatchList;
