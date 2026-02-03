import {
  FaFlag,
  FaHeart,
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { userLogout } from "../../store/slices/userSlice";

const BottomNav = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);

  const handleLogout = () => {
    dispatch(userLogout());
    navigate("/");
  };

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-[#0f0f0f] border-t border-[#2f2f2f] flex justify-around py-3 z-50 text-white">
      <button
        onClick={() => navigate("/countries")}
        className="flex flex-col items-center"
      >
        <FaFlag className="text-[#06C167] text-xl" />
        <span className="text-xs mt-1">Countries</span>
      </button>

      <button
        onClick={() => navigate("/favorites")}
        className="flex flex-col items-center"
      >
        <FaHeart className="text-[#06C167] text-xl" />
        <span className="text-xs mt-1">Favorites</span>
      </button>

      {!currentUser ? (
        <>
          <button
            onClick={() => navigate("/login")}
            className="flex flex-col items-center"
          >
            <FaSignInAlt className="text-[#06C167] text-xl" />
            <span className="text-xs mt-1">Login</span>
          </button>
          <button
            onClick={() => navigate("/register")}
            className="flex flex-col items-center"
          >
            <FaUserPlus className="text-[#06C167] text-xl" />
            <span className="text-xs mt-1">Register</span>
          </button>
        </>
      ) : (
        <button onClick={handleLogout} className="flex flex-col items-center">
          <FaSignOutAlt className="text-red-500 text-xl" />
          <span className="text-xs mt-1">Logout</span>
        </button>
      )}
    </div>
  );
};

export default BottomNav;
