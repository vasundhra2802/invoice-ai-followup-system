function Onboarding({ setPage }) {
  const inputStyle =
    "w-full border border-[#E8E1EA] bg-[#F7F4F8] p-4 rounded-2xl outline-none focus:border-[#836D82] focus:ring-4 focus:ring-[#836D82]/20 text-slate-800";

  return (
    <div className="min-h-screen bg-[#F7F4F8] flex items-center justify-center p-6">
      <div className="bg-white shadow-2xl rounded-[32px] max-w-5xl w-full grid md:grid-cols-2 overflow-hidden">
        <div className="bg-gradient-to-br from-[#836D82] to-[#B6A5B5] text-white p-12 flex flex-col justify-center">
          <h1 className="text-5xl font-bold">Welcome to InvoiceAI</h1>

          <p className="mt-6 text-lg leading-relaxed opacity-90">
            Let’s quickly set up your finance recovery workspace before entering the dashboard.
          </p>

          <div className="mt-10 space-y-4">
            <div className="bg-white/10 border border-white/20 p-4 rounded-2xl">
              Configure invoice workflow
            </div>
            <div className="bg-white/10 border border-white/20 p-4 rounded-2xl">
              Enable AI follow-up automation
            </div>
            <div className="bg-white/10 border border-white/20 p-4 rounded-2xl">
              Set up recovery analytics
            </div>
          </div>
        </div>

        <div className="p-10 flex flex-col justify-center">
          <h2 className="text-4xl font-bold text-slate-800">
            Workspace Setup
          </h2>

          <p className="text-slate-500 mt-3">
            Complete your onboarding details
          </p>

          <div className="space-y-5 mt-8">
            <input type="text" placeholder="Company Name" className={inputStyle} />
            <input type="text" placeholder="Business Type" className={inputStyle} />
            <input type="email" placeholder="Recovery Team Email" className={inputStyle} />

            <select className={inputStyle}>
              <option>Select Company Size</option>
              <option>1-10 Employees</option>
              <option>10-50 Employees</option>
              <option>50-200 Employees</option>
              <option>200+ Employees</option>
            </select>

            <button
              onClick={() => setPage("dashboard")}
              className="w-full text-white py-4 rounded-2xl text-lg font-semibold shadow-lg bg-gradient-to-br from-[#836D82] to-[#B6A5B5] hover:scale-[1.01] transition"
            >
              Continue to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Onboarding;