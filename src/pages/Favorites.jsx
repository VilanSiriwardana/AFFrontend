import { useSelector } from "react-redux";
import CountryCard from "../components/CountryCard";

const Favorites = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const favorites = useSelector(
    (state) => state.favorites[currentUser?._id] || []
  );

  if (favorites.length === 0)
    return <p className="text-white p-4">No favorite countries yet.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
      {favorites.map((country) => (
        <CountryCard key={country.cca3} country={country} />
      ))}
    </div>
  );
};

export default Favorites;
