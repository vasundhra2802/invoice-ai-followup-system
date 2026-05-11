import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

function LoginSignup({ setPage }) {
  const [signup, setSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const inputStyle =
    "w-full border border-[#E8E1EA] bg-[#F7F4F8] p-3.5 rounded-2xl outline-none focus:border-[#836D82] focus:ring-4 focus:ring-[#836D82]/20 text-slate-800";

  const validateForm = () => {
    const newErrors = {};
    const firstName = document.getElementById("firstName")?.value || "";
    const lastName = document.getElementById("lastName")?.value || "";
    const email = document.getElementById("email")?.value || "";
    const password = document.getElementById("password")?.value || "";

    if (signup && !firstName.trim()) newErrors.firstName = "Please enter first name";
    if (signup && !lastName.trim()) newErrors.lastName = "Please enter last name";
    if (!email.trim()) newErrors.email = "Please enter email address";
    if (!password.trim()) newErrors.password = "Please enter password";
    if (signup && password && password.length < 8)
      newErrors.password = "Password must be at least 8 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    setPage(signup ? "onboarding" : "dashboard");
  };

  return (
    <div className="h-screen overflow-hidden flex items-center justify-center p-5 bg-[#F7F4F8]">
      <div className="bg-white rounded-[32px] shadow-2xl overflow-hidden max-w-6xl w-full h-[90vh] grid md:grid-cols-2">
        <div className="text-white p-10 flex flex-col justify-center bg-gradient-to-br from-[#836D82] to-[#B6A5B5]">
          <h1 className="text-6xl font-bold">InvoiceAI</h1>
          <p className="mt-5 text-lg opacity-90 leading-relaxed">
            AI-powered finance recovery platform for invoice tracking, automated follow-ups, and recovery analytics.
          </p>

          <div className="space-y-4 mt-10">
            <div className="bg-white/10 border border-white/20 p-4 rounded-2xl">AI Follow-Up Emails</div>
            <div className="bg-white/10 border border-white/20 p-4 rounded-2xl">Recovery Risk Analysis</div>
            <div className="bg-white/10 border border-white/20 p-4 rounded-2xl">Smart Invoice Dashboard</div>
          </div>
        </div>

        <div className="p-9 md:p-11 flex flex-col justify-center">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-5xl font-bold text-slate-800">
                {signup ? "Create Account" : "Welcome Back"}
              </h2>
              <p className="text-slate-500 mt-3">
                {signup ? "Create your workspace" : "Login to continue"}
              </p>
            </div>

            <button
              onClick={() => {
                setSignup(!signup);
                setErrors({});
              }}
              className="font-semibold mt-2 text-[#836D82]"
            >
              {signup ? "Login" : "Signup"}
            </button>
          </div>

          <div className="space-y-4 mt-8">
            {signup && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input id="firstName" placeholder="First Name" className={inputStyle} />
                  {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                </div>

                <div>
                  <input id="lastName" placeholder="Last Name" className={inputStyle} />
                  {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                </div>
              </div>
            )}

            <div>
              <input id="email" type="email" placeholder="Email Address" className={inputStyle} />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className={`${inputStyle} pr-14`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#836D82]"
                >
                  {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>

              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              {!signup && (
  <button
    type="button"
    onClick={() => alert("Password reset link feature can be added later.")}
    className="text-sm text-[#836D82] font-semibold hover:underline text-right w-full"
  >
    Forgot Password?
  </button>
)}
            </div>

            {signup && (
              <div className="bg-[#F7F4F8] border border-[#E8E1EA] p-4 rounded-2xl text-slate-600 text-sm">
                Password should contain minimum 8 characters.
              </div>
            )}

            <button
              onClick={handleSubmit}
              className="w-full text-white py-4 rounded-2xl text-lg font-semibold shadow-lg bg-gradient-to-br from-[#836D82] to-[#B6A5B5]"
            >
              {signup ? "Create Account" : "Login"}
            </button>

            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-slate-300"></div>
              <p className="text-slate-400 text-sm">OR</p>
              <div className="flex-1 h-px bg-slate-300"></div>
            </div>

            <button
              onClick={() => setPage("onboarding")}
              className="w-full border border-[#E8E1EA] bg-white py-3.5 rounded-2xl flex justify-center items-center gap-3 hover:bg-[#F7F4F8]"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="google"
                className="w-6 h-6"
              />
              <span className="font-medium text-slate-700">Continue with Google</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginSignup;