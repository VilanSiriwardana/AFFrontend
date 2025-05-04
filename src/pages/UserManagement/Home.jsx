import { useState } from "react";
import Sidebar from "../../components/UserManagement/Sidebar";
import LoginForm from "../../components/UserManagement/LoginForm";

const Home = () => {
  const [activeRole, setActiveRole] = useState("Login");

  const renderSignupForm = () => {
    switch (activeRole) {
      case "User":
        return <LoginForm />;

      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-darkBg text-white">
      <Sidebar onSelectRole={setActiveRole} />
      <div className="flex-1 overflow-y-auto">{renderSignupForm()}</div>
    </div>
  );
};

export default Home;
