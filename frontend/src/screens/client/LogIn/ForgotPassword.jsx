import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import CircularProgress from "@material-ui/core/CircularProgress";
import { forgot_password, verify_opt, password_reset } from "../../../api/Api";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(120);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const otpInputRefs = useRef([]);

  useEffect(() => {
    if (step === 2 && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [step, timer]);

  // Focus first OTP input when step changes to 2
  useEffect(() => {
    if (step === 2 && otpInputRefs.current[0]) {
      otpInputRefs.current[0].focus();
    }
  }, [step]);

  const handleNext = async () => {
    if (!email) {
      setError('*Email is required');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(forgot_password, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsLoading(false);
        setSuccessMessage('OTP sent successfully to your email');
        setTimeout(() => setSuccessMessage(''), 3000);
        setStep(2);
      } else {
        setIsLoading(false);
        setError(`*${data.message || 'Failed to send OTP. Please try again.'}`);
      }
    } catch (error) {
      setIsLoading(false);
      setError('*An error occurred. Please try again later.');
    }
  };

  const handleVerifyOTP = async () => {
    const otpString = otp.join('');
    if (!otpString || otpString.length !== 5) {
      setError('*Please enter the complete OTP');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(verify_opt, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp: otpString }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsLoading(false);
        setSuccessMessage('OTP verified successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
        setStep(3);
      } else {
        setIsLoading(false);
        setError(`*${data.message || 'Invalid OTP. Please try again.'}`);
      }
    } catch (error) {
      setIsLoading(false);
      setError('*An error occurred. Please try again later.');
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      setError('*Both password fields are required');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('*Passwords do not match');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const otpString = otp.join('');

      const response = await fetch(password_reset, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          otp: otpString,
          newPassword
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsLoading(false);
        setSuccessMessage('Password reset successfully');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setIsLoading(false);
        setError(`*${data.message || 'Failed to reset password. Please try again.'}`);
      }
    } catch (error) {
      setIsLoading(false);
      setError('*An error occurred. Please try again later.');
    }
  };

  const handleResendOTP = async () => {
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(forgot_password, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsLoading(false);
        setSuccessMessage('OTP resent successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
        setTimer(120);
      } else {
        setIsLoading(false);
        setError(`*${data.message || 'Failed to resend OTP. Please try again.'}`);
      }
    } catch (error) {
      setIsLoading(false);
      setError('*An error occurred. Please try again later.');
    }
  };

  const handleOtpChange = (text, index) => {
    // Only allow numbers
    if (!/^\d*$/.test(text)) return;

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto-focus to next input
    if (text.length === 1 && index < 4) {
      otpInputRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    // Handle backspace
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        otpInputRefs.current[index - 1].focus();
      }
    }
  };

  const formatTime = () => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className='h-screen flex items-center justify-evenly'>
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-60 backdrop-blur-sm z-50">
          <CircularProgress />
        </div>
      )}

      <img
        className='hidden showPicture:block h-[71%] m-10'
        src="https://media.istockphoto.com/id/1341716354/photo/construction-worker-working-in-construction-site.jpg?s=2048x2048&w=is&k=20&c=ruiGdpgCEo-ehs6TlLqp7L1dwM86QbMVYwPNlIgdKnc="
        alt="picture"
      />

      <div className='w-[55vh] flex flex-col gap-5'>
        <center className='text-3xl font-normal text-[#ffad33]'>
          {step === 1 ? 'Forgot Password' : step === 2 ? 'Enter OTP' : 'Reset Password'}
        </center>
        <center className='text-3xl font-normal text-[#ffad33]'>Survey Equipment Rental</center>

        <div className='flex flex-col gap-10'>
          {error && <div className="w-full text-red-400 text-sm">{error}</div>}
          {successMessage && <div className="w-full text-green-500 text-sm">{successMessage}</div>}

          {/* Step 1: Email Input */}
          {step === 1 && (
            <>
              <input
                type="email"
                placeholder='Email'
                className='border-b-2 h-10 outline-none'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            
              <button
                className='text-xl text-white border rounded-md p-2 px-4 bg-[#FFAD33]'
                onClick={handleNext}
              >
                Send OTP
              </button>
            </>
          )}

          {/* Step 2: OTP Input */}
          {step === 2 && (
            <>
              <div className="flex justify-between gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={ref => (otpInputRefs.current[index] = ref)}
                    className="w-12 h-12 border-b-2 text-center outline-none text-lg"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, index)}
                    onKeyDown={(e) => handleOtpKeyDown(e, index)}
                  />
                ))}
              </div>

              <div className="flex justify-center">
                {timer > 0 ? (
                  <p className="text-gray-500 text-sm">
                    Resend OTP in {formatTime()}
                  </p>
                ) : (
                  <button
                    className="text-[#FFAD33] text-base"
                    onClick={handleResendOTP}
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              <button
                className='text-xl text-white border rounded-md p-2 px-4 bg-[#FFAD33]'
                onClick={handleVerifyOTP}
              >
                Verify OTP
              </button>
            </>
          )}

          {/* Step 3: New Password Input */}
          {step === 3 && (
            <>
              <div className="w-full relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                  className='border-b-2 h-10 w-full outline-none'
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <span
                  onClick={togglePasswordVisibility}
                  className="absolute w-4 right-4 top-4 cursor-pointer text-xl"
                >
                  {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                </span>
              </div>

              <div className="w-full relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  className='border-b-2 h-10 w-full outline-none'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <span
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute w-4 right-4 top-4 cursor-pointer text-xl"
                >
                  {showConfirmPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                </span>
              </div>

              <button
                className='text-xl text-white border rounded-md p-2 px-4 bg-[#FFAD33]'
                onClick={handleResetPassword}
              >
                Reset Password
              </button>
            </>
          )}
        </div>

        <div className='flex justify-center items-center mt-2'>
          <button
            className="text-[#FFAD33] text-base"
            onClick={() => navigate('/')}
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;