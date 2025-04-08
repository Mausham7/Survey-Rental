import React, { useState, useEffect } from "react";
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom'
import { manual_login } from "../../../api/Api";
import CircularProgress from "@material-ui/core/CircularProgress";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = () => {
    navigate("/signup")
  }
  const handleLogIn = () => {
    navigate("/home")
  }

  // Prevent back navigation
  useEffect(() => {
    // Clear all local storage items

    // Prevent back navigation
    const handleBackNavigation = (event) => {
      event.preventDefault();
      navigate("/"); // Redirect to home or any other route
    };

    window.history.pushState(null, null, window.location.href);
    window.addEventListener("popstate", handleBackNavigation);

    return () => {
      window.removeEventListener("popstate", handleBackNavigation);
    };
  }, [navigate]);

  // useEffect(() => {
  //   if (localStorage.getItem("token") !== null && localStorage.getItem("role") !== null) {
  //     navigate(`/${localStorage.getItem("role")}`, { replace: true });
  //   }
  // }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("*Email and password required.");
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      const response = await fetch(manual_login, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setIsLoading(false);

        localStorage.setItem("token", data.token);
        localStorage.setItem("fullname", data.user.firstName);
        localStorage.setItem("role", data.user.role);
        if (data.user.role === "customer") {
          navigate(`/home`, { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }


      } else {
        setIsLoading(false);
        setError(`*${data.error}` || "Login failed. Please try again.");
      }
    } catch (error) {
      setIsLoading(false);
      setError("An error occurred. Please try again later.");
    }
    setIsLoading(false);
  };



  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className=' h-screen  flex items-center justify-evenly'>
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-60 backdrop-blur-sm z-50">
          <CircularProgress />
        </div>
      )}
      <img className='hidden  showPicture:block h-[71%] m-10' src="https://media.istockphoto.com/id/1341716354/photo/construction-worker-working-in-construction-site.jpg?s=2048x2048&w=is&k=20&c=ruiGdpgCEo-ehs6TlLqp7L1dwM86QbMVYwPNlIgdKnc=" alt="picture" />
      <div className=' w-[55vh] flex flex-col gap-5 '>
        <center className='text-3xl font-normal text-[#ffad33]'>Log in</center>
        <center className='text-3xl font-normal text-[#ffad33]'>Survey Equipment Rental</center>
        {/* <h3>Enter your details below</h3> */}
        <div className='flex flex-col gap-10  '>
          {error && <div className="w-full text-red-400 text-sm">{error}</div>}
          <input
            type="email"
            placeholder='E-mail or Phone Number'
            className='border-b-2 h-10 outline-none'
            value={email}
            onChange={(e) => setEmail(e.target.value)} />
          <div className="w-full relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className='border-b-2 h-10 w-full outline-none'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            // className="w-full px-4 py-3 bg-gray-100 rounded-md outline-none shadow-sm"
            />
            <span
              onClick={togglePasswordVisibility}
              className="absolute w-4 right-4 top-4 cursor-pointer text-xl"
            >
              {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
            </span>
          </div>
          <button className='text-xl text-white border rounded-md p-2 px-4 bg-[#FFAD33]' onClick={handleLogin}>Log In</button>
        </div>
        <div className=''>

          <button className='text-[#FFAD33] text-base'> Forget Password?</button>
        </div>
        <button onClick={handleSignUp}> Didn't have an account? <span className=' text-[#FFAD33] underline' >
          Sign up

        </span>
        </button>

      </div>
    </div>
  )
}

export default Login