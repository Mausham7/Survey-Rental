import React, { useState, useEffect } from "react";
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom'
import { manual_login, resend_verification } from "../../../api/Api";
import CircularProgress from "@material-ui/core/CircularProgress";
import loginimg from "../../../assets/login-img.jpeg"

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showVerificationResend, setShowVerificationResend] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

useEffect(() => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (token && role === "admin") {
    navigate("/dashboard");
  } else if (token && role === "customer") {
    navigate("/home");
  }
}, [navigate]);


  const handleSignUp = () => {
    navigate("/signup")
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

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      setError("*Email and password required.");
      return;
    }
    setError("");
    setIsLoading(true);
    setShowVerificationResend(false);
    setResendMessage("");

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
        } else if(data.user.role === "admin") {
          navigate('/dashboard', { replace: true });
        }else {
          navigate("/");
        }
      } else {
        setIsLoading(false);
        console.log("verification check: ", data.verified);

        // Check if the error is related to email verification
        if (data.error?.toLowerCase().includes("verify") ||
          data.error?.toLowerCase().includes("verification") ||
          data.verified === false) {
          setShowVerificationResend(true);
        }

        setError(`*${data.error}` || "Login failed. Please try again.");
      }
    } catch (error) {
      setIsLoading(false);
      setError("An error occurred. Please try again later.");
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      setError("*Email is required to resend verification.");
      return;
    }

    setResendLoading(true);
    setResendMessage("");

    try {
      // Assuming you have a resend verification endpoint
      const response = await fetch(resend_verification, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setResendMessage("Verification email sent successfully!");
      } else {
        setResendMessage(`Failed to resend: ${data.error}`);
      }
    } catch (error) {
      setResendMessage("Failed to resend verification email.");
    }

    setResendLoading(false);
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
      <img className='hidden  showPicture:block h-[71%] m-10' src={loginimg} alt="picture" />
      <div className=' w-[55vh] flex flex-col gap-5  -mt-14 '>
        <center className='text-2xl font-semibold text-[#ffad33]'>Log in</center>
        <center className='text-2xl font-semibold text-[#ffad33]'>Survey Equipment Rental</center>
        {/* <h3>Enter your details below</h3> */}
        <form onSubmit={handleLogin} className='flex flex-col  '>
          
          {error && <div className="w-full text-red-400 text-sm">{error}</div>}
          {resendMessage && <div className="w-full text-green-500 text-sm">{resendMessage}</div>}

          <div className="flex flex-col gap-10 mb-12">

          <input
            type="email"
            placeholder=' Enter your email'
            className='border-b-2 h-10 outline-none mt-5'
            value={email}
            onChange={(e) => setEmail(e.target.value)} />
  
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
          
          <button type="submmit" className='text-xl text-white border rounded-md p-2 px-4 bg-[#FFAD33]' >Log In</button>
        </form>

        <div className='flex justify-between items-center'>
          {/* <button className='text-[#FFAD33] text-base'>Forget Password?</button> */}
          <Link to="/forgotpassword" className="text-[#FFAD33] text-base">Forgot Password?</Link>

          {showVerificationResend && (
            <button
              className='text-[#FFAD33] text-base flex items-center'
              onClick={handleResendVerification}
              disabled={resendLoading}
            >
              {resendLoading ? (
                <>
                  <span className="mr-2">Sending</span>
                  <div className="w-4 h-4"><CircularProgress size={16} /></div>
                </>
              ) : (
                "Resend Verification Email"
              )}
            </button>
          )}
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