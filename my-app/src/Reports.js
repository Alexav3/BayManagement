import React, { useEffect, useState } from "react";
import "./Reports.css";

function Reports() {
  // ---- Manual New Units state (Operator + Serial) ----
  const [manualUnits, setManualUnits] = useState(() => {
    const saved = localStorage.getItem("manualNewUnits");
    return saved ? JSON.parse(saved) : [];
  });
  const [operator, setOperator] = useState("");
  const [serial, setSerial] = useState("");

  useEffect(() => {
    localStorage.setItem("manualNewUnits", JSON.stringify(manualUnits));
  }, [manualUnits]);

  const addManualUnit = () => {
    const op = operator.trim();
    const sn = serial.trim();
    if (!op || !sn) return;
    setManualUnits((prev) => [...prev, { operator: op, serial: sn }]);
    setOperator("");
    setSerial("");
  };

  const deleteManualUnit = (idx) => {
    setManualUnits((prev) => prev.filter((_, i) => i !== idx));
  };

  const clearManualUnits = () => setManualUnits([]);

  // ---------------- CSV helpers ----------------
  const escapeCSV = (value) => {
    const str = value == null ? "" : String(value);
    if (/[",\n\r]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
    return str;
  };

  const todayStamp = () => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const downloadManualNewUnitsCSV = () => {
    if (manualUnits.length === 0) return;

    const title = "L11 Daily Test Report: New Units Testing";
    const headers = ["#", "Operator", "Serial Number"];
    const pad = "   ";

    const rows = manualUnits.map((row, i) => [
      i + 1,
      escapeCSV((row.operator ?? "") + pad),
      escapeCSV((row.serial ?? "") + pad),
    ]);

    const csvLines = [
      title,
      headers.map((h) => escapeCSV(h + pad)).join(","),
      ...rows.map((r) => r.join(",")),
    ];

    const csvContent = "\uFEFF" + csvLines.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `L11-New-Units-Report-${todayStamp()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") addManualUnit();
  };

  return (
    <div className="reports-container">
      <div className="reports-card">
        <div className="topbar">
          <h2>Reports</h2>
          <a className="btn btn-primary" href="/" rel="noopener noreferrer">
            Back to Bay Manager
          </a>
        </div>

        {/* -------- New Units Report ONLY -------- */}
        <section className="section">
          <h3>New Units report</h3>
          <p className="muted">
            Create <em>L11 Daily Test Report: New Units Testing</em>. Enter
            <strong> Operator</strong> and <strong>Serial Number</strong> below.
            The export includes a counter (<strong>#</strong>), Operator, and
            Serial Number.
          </p>

          {/* Manual entry form */}
          <div className="manual-form">
            <input
              value={operator}
              onChange={(e) => setOperator(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Operator"
            />
            <input
              value={serial}
              onChange={(e) => setSerial(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Serial Number"
            />
            <button className="btn btn-primary" onClick={addManualUnit}>
              Add
            </button>
          </div>

          {/* Manual table */}
          {manualUnits.length === 0 ? (
            <p className="hint">No manual entries yet.</p>
          ) : (
            <>
              <div className="table-wrapper">
                <table className="simple-table">
                  <thead>
                    <tr>
                      <th style={{ width: 60 }}>#</th>
                      <th>Operator</th>
                      <th>Serial Number</th>
                      <th style={{ width: 1 }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {manualUnits.map((row, i) => (
                      <tr key={`${row.serial}-${i}`}>
                        <td>{i + 1}</td>
                        <td>{row.operator}</td>
                        <td>{row.serial}</td>
                        <td>
                          <button
                            className="btn btn-ghost-danger"
                            onClick={() => deleteManualUnit(i)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="row-actions">
                <button
                  className="btn btn-secondary"
                  onClick={clearManualUnits}
                >
                  Clear all
                </button>
                <button
                  className="btn btn-primary"
                  onClick={downloadManualNewUnitsCSV}
                >
                  Download New Units CSV
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export default Reports;
