import React, { useState, useEffect } from "react";
import "./Home.css";

function Home() {
  const [bayName, setBayName] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [bayList, setBayList] = useState(() => {
    const saved = sessionStorage.getItem("bayList");
    return saved ? JSON.parse(saved) : [];
  });

  const [completedList, setCompletedList] = useState(() => {
    const saved = sessionStorage.getItem("completedList");
    return saved ? JSON.parse(saved) : [];
  });

  const handleAdd = () => {
    const newEntry = { bayName, serialNumber };
    const updatedList = [...bayList, newEntry];
    setBayList(updatedList);
    sessionStorage.setItem("bayList", JSON.stringify(updatedList));
    setBayName("");
    setSerialNumber("");
  };

  const handleComplete = (indexToComplete) => {
    const completedItem = bayList[indexToComplete];
    const updatedBayList = bayList.filter(
      (_, index) => index !== indexToComplete
    );
    const updatedCompletedList = [...completedList, completedItem];

    setBayList(updatedBayList);
    setCompletedList(updatedCompletedList);

    sessionStorage.setItem("bayList", JSON.stringify(updatedBayList));
    sessionStorage.setItem(
      "completedList",
      JSON.stringify(updatedCompletedList)
    );
  };

  const handleDeleteActive = (indexToDelete) => {
    const updatedList = bayList.filter((_, index) => index !== indexToDelete);
    setBayList(updatedList);
    sessionStorage.setItem("bayList", JSON.stringify(updatedList));
  };

  const handleDeleteCompleted = (indexToDelete) => {
    const updatedList = completedList.filter(
      (_, index) => index !== indexToDelete
    );
    setCompletedList(updatedList);
    sessionStorage.setItem("completedList", JSON.stringify(updatedList));
  };

  return (
    <div className="container">
      <h2>Bay Manager</h2>
      <input
        placeholder="Enter Bay Name"
        value={bayName}
        onChange={(e) => setBayName(e.target.value)}
      />
      <input
        placeholder="Enter Serial Number"
        value={serialNumber}
        onChange={(e) => setSerialNumber(e.target.value)}
      />
      <button onClick={handleAdd}>Add Entry</button>

      <h3>Active Entries</h3>
      {bayList.length === 0 ? (
        <p>No active entries.</p>
      ) : (
        <ol>
          {bayList.map((entry, index) => (
            <li key={index}>
              {entry.bayName} - {entry.serialNumber}
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
            </li>
          ))}
        </ol>
      )}

      <h3>Completed Entries</h3>
      {completedList.length === 0 ? (
        <p>No completed entries yet.</p>
      ) : (
        <ol className="completed-list">
          {completedList.map((entry, index) => (
            <li key={index}>
              {entry.bayName} - {entry.serialNumber}
              <button
                className="delete-btn"
                onClick={() => handleDeleteCompleted(index)}
              >
                Delete
              </button>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export default Home;
