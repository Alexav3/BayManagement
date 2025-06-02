import React, { useState } from "react";
import "./Home.css";

function Home() {
  const [bayName, setBayName] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
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

  const handleAdd = () => {
    const newEntry = { bayName, serialNumber };
    const updatedList = [...bayList, newEntry];
    setBayList(updatedList);
    localStorage.setItem("bayList", JSON.stringify(updatedList));
    setBayName("");
    setSerialNumber("");
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
    setEditActiveIndex(index);
    setEditCompletedIndex(null);
    setEditBayName(bayList[index].bayName);
    setEditSerialNumber(bayList[index].serialNumber);
  };

  const handleEditCompleted = (index) => {
    setEditCompletedIndex(index);
    setEditActiveIndex(null);
    setEditBayName(completedList[index].bayName);
    setEditSerialNumber(completedList[index].serialNumber);
  };

  const handleSaveActiveEdit = () => {
    const updated = [...bayList];
    updated[editActiveIndex] = {
      bayName: editBayName,
      serialNumber: editSerialNumber,
    };
    setBayList(updated);
    localStorage.setItem("bayList", JSON.stringify(updated));
    setEditActiveIndex(null);
    setEditBayName("");
    setEditSerialNumber("");
  };

  const handleSaveCompletedEdit = () => {
    const updated = [...completedList];
    updated[editCompletedIndex] = {
      bayName: editBayName,
      serialNumber: editSerialNumber,
    };
    setCompletedList(updated);
    localStorage.setItem("completedList", JSON.stringify(updated));
    setEditCompletedIndex(null);
    setEditBayName("");
    setEditSerialNumber("");
  };

  const handleClearAll = () => {
    localStorage.removeItem("bayList");
    localStorage.removeItem("completedList");
    setBayList([]);
    setCompletedList([]);
  };

  return (
    <div className="container">
      <h2>Bay Manager</h2>
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
        <button onClick={handleAdd}>Add Unit</button>
      </div>

      <h3>Dismounted Units</h3>
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
                    <button onClick={handleSaveActiveEdit}>Save</button>
                    <button onClick={() => setEditActiveIndex(null)}>
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    {entry.bayName} - {entry.serialNumber}
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

      <h3>Newly Mounted Units</h3>
      {completedList.length === 0 ? (
        <p>No mounted units.</p>
      ) : (
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
                    <button onClick={handleSaveCompletedEdit}>Save</button>
                    <button onClick={() => setEditCompletedIndex(null)}>
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    {entry.bayName} - {entry.serialNumber}
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
      )}

      <div className="clear-button-wrapper">
        <button className="clear-btn" onClick={handleClearAll}>
          Clear All Units
        </button>
      </div>
    </div>
  );
}

export default Home;
