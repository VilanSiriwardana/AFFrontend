import {
  FaFlag,
  FaCity,
  FaSearchLocation,
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { userLogout } from "../../store/slices/userSlice";

const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);

  const handleLogout = () => {
    dispatch(userLogout());
    navigate("/");
  };

  return (
    <div className="w-64 min-h-screen bg-[#0f0f0f] text-white flex flex-col p-6 shadow-lg justify-between">
      <div>
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-[#06C167]">Countries</h1>
          <p className="text-gray-400 text-sm">Country Search App</p>
        </div>

        <div className="flex flex-col gap-6">
          <button
            onClick={() => navigate("/countries")}
            className="flex items-center gap-3 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white font-semibold py-3 px-5 rounded-md transition"
          >
            <FaFlag className="text-[#06C167] text-xl" />
            Countries
          </button>
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-4">
        {!currentUser ? (
          <>
            <button
              onClick={() => navigate("/register")}
              className="flex items-center gap-3 w-full bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white font-semibold py-3 px-5 rounded-md transition justify-center"
            >
              <FaUserPlus className="text-[#06C167] text-xl" />
              Register
            </button>
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-3 w-full bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white font-semibold py-3 px-5 rounded-md transition justify-center"
            >
              <FaSignInAlt className="text-[#06C167] text-xl" />
              Login
            </button>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-5 rounded-md transition justify-center"
          >
            <FaSignOutAlt className="text-white text-xl" />
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
