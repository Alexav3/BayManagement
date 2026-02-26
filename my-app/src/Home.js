import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  const skuOptions = [
    "7620045-28572",
    "7621446-30256",
    "7621526-32068",
    "7621526-33089",
    "7621588-32382",
    "7621595-30938",
    "7605844-29705",
    "7605855-29653",
    "7605056-31961",
    "7606607-24864",
    "7606906-29636",
    "7627588-30049",
    "7623642-28482",
    "7621603-29477",
    "7605855-30979",
    "7624457-30038",
    "7622245-27938",
    "7606782-25195",
    "7605056-31344",
    "7621526-31962",
    "7605855-29657",
    "7620045-28059",
    "7628755-32666",
    "7631434-33714",
    "7627557-31849",
    "7605844-33774",
    "7624457-32867",
    "7605855-24475",
    "7625150-29268",
    "7622744-31757",
    "7623568-33440",
  ];

  const [bayName, setBayName] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [sku, setSku] = useState("");

  const [bayList, setBayList] = useState(() => {
    const saved = localStorage.getItem("bayList");
    return saved ? JSON.parse(saved) : [];
  });

  const [completedList, setCompletedList] = useState(() => {
    const saved = localStorage.getItem("completedList");
    return saved ? JSON.parse(saved) : [];
  });

  const [editActiveIndex, setEditActiveIndex] = useState(null);
  const [editCompletedIndex, setEditCompletedIndex] = useState(null);
  const [editBayName, setEditBayName] = useState("");
  const [editSerialNumber, setEditSerialNumber] = useState("");
  const [editSku, setEditSku] = useState("");

  // ✅ custom confirm modal (same style as Reports)
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Close modal on ESC
  useEffect(() => {
    const onEsc = (e) => {
      if (e.key === "Escape") setShowClearConfirm(false);
    };
    if (showClearConfirm) window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [showClearConfirm]);

  const handleAdd = () => {
    const newEntry = { bayName, serialNumber, sku };
    const updatedList = [...bayList, newEntry];
    setBayList(updatedList);
    localStorage.setItem("bayList", JSON.stringify(updatedList));
    setBayName("");
    setSerialNumber("");
    setSku("");
  };

  const handleComplete = (index) => {
    const completedItem = bayList[index];
    const updatedBayList = bayList.filter((_, i) => i !== index);
    const updatedCompletedList = [...completedList, completedItem];
    setBayList(updatedBayList);
    setCompletedList(updatedCompletedList);
    localStorage.setItem("bayList", JSON.stringify(updatedBayList));
    localStorage.setItem("completedList", JSON.stringify(updatedCompletedList));
  };

  const handleDeleteActive = (index) => {
    const updatedList = bayList.filter((_, i) => i !== index);
    setBayList(updatedList);
    localStorage.setItem("bayList", JSON.stringify(updatedList));
  };

  const handleDeleteCompleted = (index) => {
    const updatedList = completedList.filter((_, i) => i !== index);
    setCompletedList(updatedList);
    localStorage.setItem("completedList", JSON.stringify(updatedList));
  };

  const handleEditActive = (index) => {
    const item = bayList[index];
    setEditActiveIndex(index);
    setEditCompletedIndex(null);
    setEditBayName(item.bayName || "");
    setEditSerialNumber(item.serialNumber || "");
    setEditSku(item.sku || "");
  };

  const handleEditCompleted = (index) => {
    const item = completedList[index];
    setEditCompletedIndex(index);
    setEditActiveIndex(null);
    setEditBayName(item.bayName || "");
    setEditSerialNumber(item.serialNumber || "");
    setEditSku(item.sku || "");
  };

  const handleSaveActiveEdit = () => {
    const updated = [...bayList];
    updated[editActiveIndex] = {
      bayName: editBayName,
      serialNumber: editSerialNumber,
      sku: editSku,
    };
    setBayList(updated);
    localStorage.setItem("bayList", JSON.stringify(updated));
    setEditActiveIndex(null);
    setEditBayName("");
    setEditSerialNumber("");
    setEditSku("");
  };

  const handleSaveCompletedEdit = () => {
    const updated = [...completedList];
    updated[editCompletedIndex] = {
      bayName: editBayName,
      serialNumber: editSerialNumber,
      sku: editSku,
    };
    setCompletedList(updated);
    localStorage.setItem("completedList", JSON.stringify(updated));
    setEditCompletedIndex(null);
    setEditBayName("");
    setEditSerialNumber("");
    setEditSku("");
  };

  // ✅ Open modal instead of clearing immediately
  const requestClearAll = () => {
    if (bayList.length === 0 && completedList.length === 0) return;
    setShowClearConfirm(true);
  };

  const confirmClearAll = () => {
    localStorage.removeItem("bayList");
    localStorage.removeItem("completedList");
    setBayList([]);
    setCompletedList([]);
    setShowClearConfirm(false);
  };

  const cancelClearAll = () => {
    setShowClearConfirm(false);
  };

  // ---------- CSV EXPORT ----------
  const escapeCSV = (value) => {
    const str = value == null ? "" : String(value);
    if (/[",\n\r]/.test(str)) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const exportCompletedToCSV = () => {
    if (completedList.length === 0) return;

    const title = "L11 Daily Test Report: Units sent to Packout";
    const headers = ["#", "Serial Number", "SKU"];
    const pad = "   ";

    const rows = completedList.map((row, i) => [
      i + 1,
      escapeCSV((row.serialNumber ?? "") + pad),
      escapeCSV((row.sku ?? "") + pad),
    ]);

    const csvLines = [
      title,
      headers.map((h) => escapeCSV(h + pad)).join(","),
      ...rows.map((r) => r.join(",")),
    ];

    const csvContent = "\uFEFF" + csvLines.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const date = new Date();
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");

    const link = document.createElement("a");
    link.href = url;
    link.download = `L11-Packout-Report-${yyyy}-${mm}-${dd}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  // --------------------------------

  const totalUnits = bayList.length + completedList.length;

  return (
    <div className="container">
      <h2>Bay Manager</h2>
      <Link
        className="reports-link"
        to="/reports"
        target="_blank"
        rel="noopener noreferrer"
      >
        Create Report
      </Link>

      <div className="form-group">
        <input
          placeholder="Enter Bay Number"
          value={bayName}
          onChange={(e) => setBayName(e.target.value)}
        />
        <input
          placeholder="Enter Serial Number"
          value={serialNumber}
          onChange={(e) => setSerialNumber(e.target.value)}
        />

        <select
          value=""
          onChange={(e) => setSku(e.target.value)}
          aria-label="Quick select SKU"
        >
          <option value="" disabled>
            — Quick select SKU —
          </option>
          {skuOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>

        <input
          placeholder="Enter SKU"
          value={sku}
          onChange={(e) => setSku(e.target.value)}
        />

        <button onClick={handleAdd}>Add Unit</button>
      </div>

      <h3>Dismounted Units.</h3>
      {bayList.length === 0 ? (
        <p>No dismounted units.</p>
      ) : (
        <ol className="active-list">
          {bayList.map((entry, index) => (
            <li key={index}>
              <div className="list-item-content">
                {editActiveIndex === index ? (
                  <div className="edit-group">
                    <input
                      value={editBayName}
                      onChange={(e) => setEditBayName(e.target.value)}
                      placeholder="Bay Name"
                    />
                    <input
                      value={editSerialNumber}
                      onChange={(e) => setEditSerialNumber(e.target.value)}
                      placeholder="Serial Number"
                    />

                    <select
                      value=""
                      onChange={(e) => setEditSku(e.target.value)}
                      aria-label="Quick select SKU"
                    >
                      <option value="" disabled>
                        — Quick select SKU —
                      </option>
                      {skuOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>

                    <input
                      value={editSku}
                      onChange={(e) => setEditSku(e.target.value)}
                      placeholder="SKU"
                    />

                    <button onClick={handleSaveActiveEdit}>Save</button>
                    <button onClick={() => setEditActiveIndex(null)}>
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    {entry.bayName} — {entry.serialNumber}
                    {entry.sku ? ` — ${entry.sku}` : ""}
                    <div className="button-group">
                      <button
                        className="complete-btn"
                        onClick={() => handleComplete(index)}
                      >
                        Complete
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteActive(index)}
                      >
                        Delete
                      </button>
                      <button
                        className="edit-btn"
                        onClick={() => handleEditActive(index)}
                      >
                        Edit
                      </button>
                    </div>
                  </>
                )}
              </div>
            </li>
          ))}
        </ol>
      )}

      <h3>Completed Dismounted Units.</h3>
      {completedList.length === 0 ? (
        <p>No mounted units.</p>
      ) : (
        <>
          <ol className="completed-list">
            {completedList.map((entry, index) => (
              <li key={index}>
                <div className="list-item-content">
                  {editCompletedIndex === index ? (
                    <div className="edit-group">
                      <input
                        value={editBayName}
                        onChange={(e) => setEditBayName(e.target.value)}
                        placeholder="Bay Name"
                      />
                      <input
                        value={editSerialNumber}
                        onChange={(e) => setEditSerialNumber(e.target.value)}
                        placeholder="Serial Number"
                      />

                      <select
                        value=""
                        onChange={(e) => setEditSku(e.target.value)}
                        aria-label="Quick select SKU"
                      >
                        <option value="" disabled>
                          — Quick select SKU —
                        </option>
                        {skuOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>

                      <input
                        value={editSku}
                        onChange={(e) => setEditSku(e.target.value)}
                        placeholder="SKU"
                      />

                      <button onClick={handleSaveCompletedEdit}>Save</button>
                      <button onClick={() => setEditCompletedIndex(null)}>
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      {entry.bayName} — {entry.serialNumber}
                      {entry.sku ? ` — ${entry.sku}` : ""}
                      <div className="button-group">
                        <button
                          className="edit-btn"
                          onClick={() => handleEditCompleted(index)}
                        >
                          Edit
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteCompleted(index)}
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ol>

          <div className="export-wrapper">
            <button className="export-btn" onClick={exportCompletedToCSV}>
              Download Completed as CSV
            </button>
          </div>
        </>
      )}

      <div className="clear-button-wrapper">
        <button className="clear-btn" onClick={requestClearAll}>
          Clear All Units
        </button>
      </div>

      {/* ✅ Custom Confirm Modal (same style as Reports) */}
      {showClearConfirm && (
        <div
          className="modal-backdrop"
          onMouseDown={(e) => {
            if (e.target.classList.contains("modal-backdrop")) cancelClearAll();
          }}
        >
          <div className="modal-card" role="dialog" aria-modal="true">
            <div className="modal-title">Clear all units?</div>
            <div className="modal-text">
              This will remove <strong>{totalUnits}</strong>{" "}
              {totalUnits === 1 ? "unit" : "units"} from your lists (active and
              completed). This cannot be undone.
            </div>

            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={cancelClearAll}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={confirmClearAll}>
                Yes, clear all
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
