import { useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function Leads() {
  const [leads, setLeads] = useState([
    {
      name: "Rahul Sharma",
      company: "Infosys",
      score: 95,
      status: "Hot"
    },
    {
      name: "Aman Verma",
      company: "TCS",
      score: 82,
      status: "Warm"
    }
  ]);

  const [form, setForm] = useState({
    name: "",
    company: "",
    score: "",
    status: "Warm"
  });

  const [error, setError] = useState("");

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddLead = (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.company.trim() || !form.score.trim()) {
      setError("Please complete all required fields.");
      return;
    }

    const newLead = {
      name: form.name.trim(),
      company: form.company.trim(),
      score: Number(form.score),
      status: form.status
    };

    setLeads((current) => [newLead, ...current]);
    setForm({ name: "", company: "", score: "", status: "Warm" });
    setError("");
  };

  const totalLeads = useMemo(() => leads.length, [leads]);

  return (
    <div className="main-container">
      <Sidebar />

      <div className="dashboard">
        <Navbar />

        <div className="page-inner">

          <div className="page-header">
            <div>
              <h1 className="page-title">Leads</h1>
              <p className="page-subtitle">Manage your pipeline and add new lead information instantly.</p>
            </div>
            <div className="summary-pill">Total Leads: {totalLeads}</div>
          </div>

          <form className="add-lead-form" onSubmit={handleAddLead}>
            <div className="form-row">
              <label>
                Name
                <input
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  placeholder="Lead name"
                />
              </label>
              <label>
                Company
                <input
                  name="company"
                  value={form.company}
                  onChange={handleInputChange}
                  placeholder="Company name"
                />
              </label>
            </div>
            <div className="form-row">
              <label>
                Score
                <input
                  name="score"
                  type="number"
                  value={form.score}
                  onChange={handleInputChange}
                  placeholder="AI score"
                />
              </label>
              <label>
                Status
                <select name="status" value={form.status} onChange={handleInputChange}>
                  <option value="Hot">Hot</option>
                  <option value="Warm">Warm</option>
                  <option value="Cold">Cold</option>
                </select>
              </label>
            </div>
            {error && <div className="form-error">{error}</div>}
            <button type="submit" className="btn-primary add-lead-button">
              Add Lead
            </button>
          </form>

          <div className="table-card">

            <table className="w-full">

              <thead className="bg-violet-600 text-white">
                <tr>
                  <th className="p-4">Name</th>
                  <th>Company</th>
                  <th>AI Score</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>

                {leads.map((lead,index)=>(
                  <tr
                    key={index}
                    className="
                    hover:bg-violet-50
                    transition
                    "
                  >
                    <td className="p-4">
                      {lead.name}
                    </td>

                    <td>
                      {lead.company}
                    </td>

                    <td>
                      🔥 {lead.score}
                    </td>

                    <td>
                      {lead.status}
                    </td>
                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>
    </div>
  );
}