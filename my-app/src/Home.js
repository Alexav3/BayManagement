import React, { useState } from "react";
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

  const [editActiveIndex, setEditActiveIndex] = useState(null);
  const [editCompletedIndex, setEditCompletedIndex] = useState(null);
  const [editBayName, setEditBayName] = useState("");
  const [editSerialNumber, setEditSerialNumber] = useState("");

  const handleAdd = () => {
    const newEntry = { bayName, serialNumber };
    const updatedList = [...bayList, newEntry];
    setBayList(updatedList);
    sessionStorage.setItem("bayList", JSON.stringify(updatedList));
    setBayName("");
    setSerialNumber("");
  };

  const handleComplete = (index) => {
    const completedItem = bayList[index];
    const updatedBayList = bayList.filter((_, i) => i !== index);
    const updatedCompletedList = [
      ...completedList,
      {
        bayName: completedItem.bayName,
        serialNumber: completedItem.serialNumber,
      },
    ];
    setBayList(updatedBayList);
    setCompletedList(updatedCompletedList);
    sessionStorage.setItem("bayList", JSON.stringify(updatedBayList));
    sessionStorage.setItem(
      "completedList",
      JSON.stringify(updatedCompletedList)
    );
  };

  const handleDeleteActive = (index) => {
    const updatedList = bayList.filter((_, i) => i !== index);
    setBayList(updatedList);
    sessionStorage.setItem("bayList", JSON.stringify(updatedList));
  };

  const handleDeleteCompleted = (index) => {
    const updatedList = completedList.filter((_, i) => i !== index);
    setCompletedList(updatedList);
    sessionStorage.setItem("completedList", JSON.stringify(updatedList));
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
    sessionStorage.setItem("bayList", JSON.stringify(updated));
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
    sessionStorage.setItem("completedList", JSON.stringify(updated));
    setEditCompletedIndex(null);
    setEditBayName("");
    setEditSerialNumber("");
  };

  return (
    <div className="container">
      <h2>Bay Manager</h2>
      <div className="form-group">
        <input
          placeholder="Ingrese el número de Bay"
          value={bayName}
          onChange={(e) => setBayName(e.target.value)}
        />
        <input
          placeholder="Ingrese el número de Serie"
          value={serialNumber}
          onChange={(e) => setSerialNumber(e.target.value)}
        />
        <button onClick={handleAdd}>Agregar Unidad</button>
      </div>

      <h3>Unidades Desmontadas</h3>
      {bayList.length === 0 ? (
        <p>No hay unidades desmontadas.</p>
      ) : (
        <ol className="active-list">
          {bayList.map((entry, index) => (
            <li key={index}>
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
                  <button onClick={handleSaveActiveEdit}>Guardar</button>
                  <button onClick={() => setEditActiveIndex(null)}>
                    Cancelar
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
                      Completar
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteActive(index)}
                    >
                      Eliminar
                    </button>
                    <button
                      className="edit-btn"
                      onClick={() => handleEditActive(index)}
                    >
                      Editar
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ol>
      )}

      <h3>Nuevas Unidades Montadas</h3>
      {completedList.length === 0 ? (
        <p>No hay unidades montadas.</p>
      ) : (
        <ol className="completed-list">
          {completedList.map((entry, index) => (
            <li key={index}>
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
                  <button onClick={handleSaveCompletedEdit}>Guardar</button>
                  <button onClick={() => setEditCompletedIndex(null)}>
                    Cancelar
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
                      Editar
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteCompleted(index)}
                    >
                      Eliminar
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export default Home;
