import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const API = "http://127.0.0.1:8000";
const COLORS = ["#22c55e", "#ef4444"];

export default function Dashboard() {
  const [invoices, setInvoices] = useState([]);
  const [emailPreview, setEmailPreview] = useState(null);
  const [activity, setActivity] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [backendConnected, setBackendConnected] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [riskFilter, setRiskFilter] = useState("All");

  const [formData, setFormData] = useState({
    client_name: "",
    client_email: "",
    invoice_number: "",
    amount: "",
    due_date: "",
    status: "Unpaid",
    followup_count: 0,
    payment_link: "",
  });

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const res = await axios.get(`${API}/invoices`);
      setInvoices(res.data);
      setBackendConnected(true);
    } catch {
      setBackendConnected(false);
      toast.error("Backend not connected");
    }
  };

  const addActivity = (text) => {
    setActivity((prev) => [
      { text, time: new Date().toLocaleTimeString() },
      ...prev.slice(0, 5),
    ]);
  };

  const addInvoice = async () => {
    try {
      await axios.post(`${API}/invoices`, formData);
      toast.success("Invoice created");
      addActivity(`${formData.client_name} invoice added`);
      fetchInvoices();

      setFormData({
        client_name: "",
        client_email: "",
        invoice_number: "",
        amount: "",
        due_date: "",
        status: "Unpaid",
        followup_count: 0,
        payment_link: "",
      });
    } catch {
      toast.error("Failed to create invoice");
    }
  };

  const generateEmail = async (invoice) => {
    try {
      const res = await axios.get(`${API}/generate-email/${invoice.id}`);
      setEmailPreview({ ...res.data, invoice });
      toast.success("AI email generated");
      addActivity(`AI email generated for ${invoice.client_name}`);
    } catch {
      toast.error("Failed to generate email");
    }
  };

  const mockSend = async (invoice) => {
    try {
      await axios.post(`${API}/mock-send/${invoice.id}`);
      toast.success("Mock email sent");
      addActivity(`Mock email sent to ${invoice.client_name}`);
    } catch {
      toast.error("Mock send failed");
    }
  };

  const getDaysOverdue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const days = Math.floor((today - due) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const getRiskLevel = (invoice) => {
    const days = getDaysOverdue(invoice.due_date);

    if (days <= 7) {
      return {
        level: "Low",
        probability: "85%",
        color: "bg-green-100 text-green-700",
        tone: "Warm & Friendly",
        action: "Send friendly reminder",
      };
    }

    if (days <= 21) {
      return {
        level: "Medium",
        probability: "62%",
        color: "bg-yellow-100 text-yellow-700",
        tone: "Polite but Firm",
        action: "Send polite follow-up today",
      };
    }

    return {
      level: "High",
      probability: "35%",
      color: "bg-red-100 text-red-700",
      tone: "Formal & Serious",
      action: "Escalate follow-up",
    };
  };

  const paidInvoices = invoices.filter(
    (i) => i.status?.toLowerCase() === "paid"
  ).length;

  const unpaidInvoices = invoices.filter(
    (i) => i.status?.toLowerCase() !== "paid"
  ).length;

  const totalOutstanding = invoices
    .filter((i) => i.status?.toLowerCase() !== "paid")
    .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      const risk = getRiskLevel(invoice);
      const q = search.toLowerCase();

      const matchesSearch =
        invoice.client_name?.toLowerCase().includes(q) ||
        invoice.client_email?.toLowerCase().includes(q) ||
        invoice.invoice_number?.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "All" ||
        invoice.status?.toLowerCase() === statusFilter.toLowerCase();

      const matchesRisk = riskFilter === "All" || risk.level === riskFilter;

      return matchesSearch && matchesStatus && matchesRisk;
    });
  }, [invoices, search, statusFilter, riskFilter]);

  const pieData = [
    { name: "Paid", value: paidInvoices },
    { name: "Unpaid", value: unpaidInvoices },
  ];

  const riskData = [
    {
      name: "Low",
      risk: invoices.filter((i) => getRiskLevel(i).level === "Low").length,
    },
    {
      name: "Medium",
      risk: invoices.filter((i) => getRiskLevel(i).level === "Medium").length,
    },
    {
      name: "High",
      risk: invoices.filter((i) => getRiskLevel(i).level === "High").length,
    },
  ];

  const cardClass = darkMode ? "bg-[#2D2630]" : "bg-white";
  const pageBg = darkMode ? "bg-[#241F26] text-white" : "bg-[#F7F4F8] text-slate-800";
  const inputClass =
    "w-full p-4 rounded-2xl border border-[#E8E1EA] bg-[#F7F4F8] text-slate-800 outline-none focus:border-[#836D82] focus:ring-4 focus:ring-[#836D82]/20";

  return (
    <div className={`min-h-screen flex ${pageBg}`}>
      <Toaster position="top-right" />

      <aside
        className={`w-64 min-h-screen p-6 border-r ${
          darkMode ? "bg-[#2D2630] border-[#3A3340]" : "bg-white border-[#E8E1EA]"
        }`}
      >
        <h1 className="text-3xl font-bold text-[#836D82]">InvoiceAI</h1>
        <p className="text-sm mt-1 text-gray-500">Finance Automation</p>

        <div className="mt-10 space-y-3">
          {["Dashboard", "Invoices", "Analytics", "Email Generator", "Audit Logs", "Settings"].map(
            (item) => (
              <button
                key={item}
                className="w-full text-left px-4 py-3 rounded-xl bg-[#836D82] text-white hover:bg-[#745F73] transition"
              >
                {item}
              </button>
            )
          )}
        </div>

        <button className="mt-16 w-full py-3 rounded-xl bg-red-100 text-red-600 font-semibold">
          Logout
        </button>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <div className={`rounded-3xl p-6 shadow-md flex justify-between items-center ${cardClass}`}>
          <div>
            <h1 className="text-5xl font-bold">Dashboard</h1>
            <p className="mt-2 text-gray-500">AI-Powered Invoice Dashboard</p>
          </div>

          <div className="flex items-center gap-4">
            <></>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="bg-[#836D82] hover:bg-[#745F73] text-white px-5 py-2 rounded-xl"
            >
              {darkMode ? "Light" : "Dark"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6 mt-8">
          {[
            ["Total Invoices", invoices.length],
            ["Unpaid", unpaidInvoices],
            ["Outstanding", `₹${totalOutstanding}`],
            [
              "Recovery Rate",
              invoices.length
                ? `${Math.round((paidInvoices / invoices.length) * 100)}%`
                : "0%",
            ],
          ].map(([title, value]) => (
            <motion.div
              key={title}
              whileHover={{ y: -5 }}
              className={`rounded-3xl p-6 shadow-md ${cardClass}`}
            >
              <p className="text-gray-500">{title}</p>
              <h1 className="text-4xl font-bold mt-3 text-[#836D82]">
                {value}
              </h1>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-8 mt-8">
          <div className={`rounded-3xl p-6 shadow-md ${cardClass}`}>
            <h2 className="text-2xl font-bold mb-5">Invoice Status Overview</h2>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieData} dataKey="value" outerRadius={100} label>
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className={`rounded-3xl p-6 shadow-md ${cardClass}`}>
            <h2 className="text-2xl font-bold mb-5">AI Recovery Risk Analysis</h2>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={riskData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="risk" fill="#836D82" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8 mt-8">
          <div className={`rounded-3xl p-6 shadow-md ${cardClass}`}>
            <h2 className="text-3xl font-bold mb-6">Add Invoice</h2>

            <div className="space-y-4">
              {[
                ["Client Name", "client_name"],
                ["Client Email", "client_email"],
                ["Invoice Number", "invoice_number"],
                ["Amount", "amount"],
                ["Payment Link", "payment_link"],
              ].map(([placeholder, key]) => (
                <input
                  key={key}
                  placeholder={placeholder}
                  className={inputClass}
                  value={formData[key]}
                  onChange={(e) =>
                    setFormData({ ...formData, [key]: e.target.value })
                  }
                />
              ))}

              <input
                type="date"
                className={inputClass}
                value={formData.due_date}
                onChange={(e) =>
                  setFormData({ ...formData, due_date: e.target.value })
                }
              />

              <select
                className={inputClass}
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <option value="Unpaid">Unpaid</option>
                <option value="Paid">Paid</option>
              </select>

              <button
                onClick={addInvoice}
                className="w-full bg-[#836D82] hover:bg-[#745F73] text-white py-4 rounded-2xl font-semibold text-lg"
              >
                Create Invoice
              </button>
            </div>
          </div>

          <div className={`col-span-2 rounded-3xl p-6 shadow-md ${cardClass}`}>
            <h2 className="text-3xl font-bold mb-6">Invoice Records</h2>

            <div className="flex flex-col md:flex-row gap-3 mb-6">
              <input
                type="text"
                placeholder="Search by client, email, or invoice number..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 border border-[#E8E1EA] bg-[#F7F4F8] px-4 py-3 rounded-2xl outline-none text-slate-800"
              />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-[#E8E1EA] bg-[#F7F4F8] px-4 py-3 rounded-2xl outline-none text-slate-800"
              >
                <option>All</option>
                <option>Paid</option>
                <option>Unpaid</option>
              </select>

              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="border border-[#E8E1EA] bg-[#F7F4F8] px-4 py-3 rounded-2xl outline-none text-slate-800"
              >
                <option>All</option>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>

            <div className="space-y-5">
              {filteredInvoices.map((invoice) => {
                const risk = getRiskLevel(invoice);

                return (
                  <div
                    key={invoice.id}
                    className="flex justify-between items-center border-b border-[#E8E1EA] pb-5 gap-3"
                  >
                    <div>
                      <h3 className="font-bold text-lg">{invoice.client_name}</h3>
                      <p className="text-gray-500 text-sm">{invoice.client_email}</p>
                    </div>

                    <div className="font-semibold">₹{invoice.amount}</div>
                    <div>{invoice.due_date}</div>

                    <div className="bg-orange-100 text-orange-600 px-4 py-1 rounded-full text-sm">
                      {invoice.status}
                    </div>

                    <div className={`${risk.color} px-4 py-1 rounded-full text-sm`}>
                      {risk.level}
                    </div>

                    <button
                      onClick={() => generateEmail(invoice)}
                      className="bg-[#836D82] hover:bg-[#745F73] text-white px-5 py-2 rounded-xl"
                    >
                      Generate
                    </button>

                    <button
                      onClick={() => mockSend(invoice)}
                      className="bg-green-500 text-white px-5 py-2 rounded-xl"
                    >
                      Mock Send
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mt-8">
          <div className={`rounded-3xl p-6 shadow-md ${cardClass}`}>
            <h2 className="text-3xl font-bold mb-6">AI Email Preview</h2>

            {emailPreview ? (
              <>
                <div className="space-y-3">
                  <p><strong>Client:</strong> {emailPreview.client_name}</p>
                  <p><strong>Days Overdue:</strong> {emailPreview.days_overdue}</p>
                  <p><strong>Stage:</strong> {emailPreview.stage}</p>
                  <p><strong>Tone:</strong> {emailPreview.tone}</p>
                </div>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      emailPreview.generated_email || emailPreview.email || ""
                    );
                    toast.success("Email copied");
                  }}
                  className="bg-[#836D82] hover:bg-[#745F73] text-white px-5 py-2 rounded-xl mt-4"
                >
                  Copy Email
                </button>

                <div className="bg-[#08112f] text-white mt-6 p-6 rounded-3xl whitespace-pre-wrap">
                  {emailPreview.generated_email || emailPreview.email}
                </div>

                <div className="mt-6">
                  <h3 className="text-xl font-bold mb-4">Invoice Timeline</h3>

                  {["Invoice Created", "AI Reminder Generated", "Mock Email Sent", "Payment Pending"].map(
                    (step, index) => (
                      <div key={step} className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-[#836D82] text-white flex items-center justify-center">
                          {index + 1}
                        </div>
                        <p>{step}</p>
                      </div>
                    )
                  )}
                </div>
              </>
            ) : (
              <p className="text-gray-500">Generate an AI email preview</p>
            )}
          </div>

          <div className={`rounded-3xl p-6 shadow-md ${cardClass}`}>
            <h2 className="text-3xl font-bold mb-6">AI Recovery Insights</h2>

            {emailPreview ? (
              <div className="space-y-4">
                {(() => {
                  const risk = getRiskLevel(emailPreview.invoice);

                  return (
                    <>
                      <div className="bg-[#F7F4F8] p-4 rounded-2xl text-slate-800">
                        <p className="text-gray-500">Recovery Probability</p>
                        <h3 className="text-3xl font-bold text-[#836D82]">
                          {risk.probability}
                        </h3>
                      </div>

                      <div className={`${risk.color} p-4 rounded-2xl font-semibold`}>
                        Risk Level: {risk.level}
                      </div>

                      <div className="bg-[#F7F4F8] p-4 rounded-2xl text-slate-800">
                        <p className="text-gray-500">Suggested Tone</p>
                        <h3 className="font-bold">{risk.tone}</h3>
                      </div>

                      <div className="bg-[#F7F4F8] p-4 rounded-2xl text-slate-800">
                        <p className="text-gray-500">Recommended Action</p>
                        <h3 className="font-bold">{risk.action}</h3>
                      </div>
                    </>
                  );
                })()}
              </div>
            ) : (
              <p className="text-gray-500">
                Generate an email to view AI recovery insights.
              </p>
            )}

            <h2 className="text-3xl font-bold mt-8 mb-6">Recent Activity</h2>

            <div className="space-y-5">
              {activity.map((item, index) => (
                <div key={index} className="border-l-4 border-[#836D82] pl-4">
                  <p className="font-semibold">{item.text}</p>
                  <p className="text-sm text-gray-500">{item.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}