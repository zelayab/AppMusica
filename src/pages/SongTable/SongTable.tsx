import { useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import TableSongs from "../../components/TableSongs/TableSongs";
import { getSongs } from "../../services/api";

const SongTable = () => {
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await getSongs();

        console.log(response);
      } catch (error) {
        console.error("Error fetching songs:", error);
      } finally {
        console.log("Fetching songs completed");
      }
    };

    fetchSongs();
  }, []);

  return (
    <div>
      <TableSongs />
    </div>
  );
};

export default SongTable;
