import React, { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import { manual_register } from "../../../api/Api";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import imagesignup from "../../../assets/signup-img.webp"

const SignUp = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogIn = () => {
    navigate("/");
  };

  const handleSignUp = async (e) => {
    e.preventDefault()
    if (!email || !password || !phone || !firstName || !lastName) {
      setError("*All fields are required.");
      return;
    }

    if (phone.length !== 10) {
      setError('*Please enter a valid Phone Number.');
      return false;
    }
    const nepaliPhonePattern = /^(98|97)\d{8}$/;
    if (!nepaliPhonePattern.test(phone)) {
      setError('*Please enter a valid Phone Number.');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError('*Please enter a valid email address.');
      return false;
    }



    const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

    if (!passwordPattern.test(password)) {
      setError("Password must be at least 8 characters long, include one uppercase letter, one number, and one special character.");
      return false;
    }



    setError("");
    setIsLoading(true);
    try {
      const response = await fetch(manual_register, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, fullName: firstName + " " + lastName, phone, role: "customer" }),
      });
      const data = await response.json();
      if (response.ok) {
        setIsLoading(false);
        alert("Account Created successfully!")
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
        className="h-[55vh] m-10"
        src={imagesignup}
        alt="picture"
      />
      <div className=" w-[55vh] flex flex-col gap-8 ">
        <h1 className="text-3xl font-normal text-gray-500">
          Create an account
        </h1>
        {/* <h3>Enter your details below</h3> */}
        <form onSubmit={handleSignUp} className="flex flex-col">
        <div className="flex flex-col gap-10  ">
          {error && <div className="w-full text-red-400 text-sm">{error}</div>}

          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            type="text"
            placeholder="First Name"
            className="border-b-2 h-10 outline-none"
          />
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            type="text"
            placeholder="Last Name"
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
          {/* <div className="flex flex-col justify-around">
            
            <input type="text"
            placeholder="text-onlyyy"
            className="border-b-2 text-right outline-none flex justify-end" />
<button className="border-b-2 h-10 mx-auto w-[50%] text-xl flex justify-center text-green-700 mt-2 font-semibold outline-none bg-red-700">hello</button>
<button className="border-b-2 h-10 text-xl text-white w-full mt-2 font-semibold outline-none bg-red-700">hello</button>
          </div> */}

          <div className="w-full relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className='border-b-2 h-10 w-full outline-none'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              onClick={togglePasswordVisibility}
              className="absolute w-4 right-4 top-4 cursor-pointer text-xl"
            >
              {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
            </span>          
          </div>
        </div>
        <button
          className="text-xl mt-4 text-white border rounded-md px-2 py-2 bg-[#FFAD33]"
           type="submmit"
        >
          Sign up
        </button>
        </form>
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
