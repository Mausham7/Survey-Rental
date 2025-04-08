import React, { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import { manual_register } from "../../../api/Api";

const SignUp = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogIn = () => {
    navigate("/");
  };

const handleSignUp = async () => {
    if (!email || !password || !phone || !fullName) {
      setError("*All fields are required.");
      return;
    }

    if (phone.length !== 10) {
      setError('*Please enter a valid Phone Number.');
      return false;
    }
  
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError('*Please enter a valid email address.');
      return false;
    }

    setError("");
    setIsLoading(true);
    try {
      const response = await fetch(manual_register, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, fullName, phone, role : "customer" }),
      });
      const data = await response.json();
      if (response.ok) {
        setIsLoading(false);
        navigate("/");
      } else {
        setIsLoading(false);
        setError(`*${data.error}` || "Signup failed. Please try again.");
      }
    } catch (error) {
      setIsLoading(false);
      setError("An error occurred. Please try again later.");
    }
    setIsLoading(false);
  };


  return (
    <div className=" h-screen  flex items-center gap-40">
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-60 backdrop-blur-sm z-50">
          <CircularProgress />
        </div>
      )}
      <img
        className="h-[80vh] m-10"
        src="https://i.pinimg.com/736x/9b/6e/de/9b6ededcfdea6d42e2838be4a19c40ae.jpg"
        alt="picture"
      />
      <div className=" w-[55vh] flex flex-col gap-8 ">
        <h1 className="text-3xl font-normal text-gray-500">
          Create an account
        </h1>
        {/* <h3>Enter your details below</h3> */}
        <div className="flex flex-col gap-10  ">
        {error && <div className="w-full text-red-400 text-sm">{error}</div>}

          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            type="text"
            placeholder="Name"
            className="border-b-2 h-10 outline-none"
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="E-mail"
            className="border-b-2 h-10 outline-none"
          />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            type="tel"
            placeholder="Phone Number"
            className="border-b-2 h-10 outline-none"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="border-b-2 h-10 outline-none"
          />
        </div>
        <button
          className="text-xl text-white border rounded-md py-2 bg-[#FFAD33]"
          onClick={handleSignUp}
        >
          Sign up
        </button>
        <div className="text-xl border border-neutral-950 rounded-md py-2 flex items-center gap-2 justify-center">
          <div>
            {" "}
            <FcGoogle />
          </div>
          <button className=""> Sign up with Google</button>
        </div>
        <div className="py-2 flex items-center gap-2 justify-center">
          <h1>Already have account?</h1>
          <button className="underline text-[#ffad33]" onClick={handleLogIn}>
            Log in
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
