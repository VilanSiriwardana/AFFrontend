import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-gray-100">
      <div className="text-center">
        <div className="flex items-center justify-center w-40 h-40 mx-auto mb-6 bg-gray-200 rounded-full">
          <span className="text-6xl">&#128565;</span>
        </div>
        <h1 className="mb-4 text-4xl font-bold text-gray-800">500</h1>
        <p className="mb-4 text-xl text-gray-600">
          OOPS! INTERNAL SERVER ERROR
        </p>
        <p className="mb-6 text-sm text-gray-500">
          Sorry but something went wrong on our end. Please try again later.
        </p>
        <Link
          to="/"
          className="text-lg font-medium text-blue-500 hover:underline"
        >
          Back to homepage
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
