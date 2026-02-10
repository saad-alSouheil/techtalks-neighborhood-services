// Login page

import Link from "next/link";

const Login = () => {
  return (
    <div className="min-h-screen bg-orange-500 flex items-center justify-center">

      <div className="bg-white p-10 rounded-2xl shadow-xl w-96">

        {/* Title */}
        <h1 className="text-4xl font-bold text-orange-600 mb-2">
          Welcome <br /> Back
        </h1>

        <p className="text-gray-600 mb-6">
          Hey! Good to see you again
        </p>

        <form className="flex flex-col gap-4">

          <input
            type="text"
            placeholder="Username"
            className="p-3 rounded-full bg-gray-200 text-gray-900 placeholder-gray-500 outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            className="p-3 rounded-full bg-gray-200 text-gray-900 placeholder-gray-500 outline-none"
          />

          <button className="bg-orange-600 text-white p-3 rounded-full font-semibold hover:bg-orange-700 transition">
            Login
          </button>

          <p className="text-sm text-center text-gray-700">
            Don’t have an account?{" "}
            <Link href="/auth/signup" className="text-orange-600 font-semibold">
              Sign up
            </Link>
          </p>

        </form>

      </div>
    </div>
  );
};

export default Login;

