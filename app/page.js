"use client";

import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

// 🔥 Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCYztFTb2cuTCrwgPgJk3O20C7SZwnx-wQ",
  authDomain: "teamworkload-d526d.firebaseapp.com",
  projectId: "teamworkload-d526d",
  storageBucket: "teamworkload-d526d.firebasestorage.app",
  messagingSenderId: "436331860817",
  appId: "1:436331860817:web:47dcab892c2557c58c7970",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function TeamAvailabilityApp() {
  const [members, setMembers] = useState([]);
  const [newName, setNewName] = useState("");
  const [newWorkload, setNewWorkload] = useState("");
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("admin");

  // ✅ Real-time Firestore sync
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "members"), (snapshot) => {
      setMembers(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    });

    return () => unsubscribe();
  }, []);

  // ➕ Add member
  const addMember = async () => {
    if (!newName) return;

    await addDoc(collection(db, "members"), {
      name: newName,
      status: "Ada",
      workload: newWorkload || "No details",
    });

    setNewName("");
    setNewWorkload("");
  };

  // 🔄 Toggle status
  const toggleStatus = async (member) => {
    await updateDoc(doc(db, "members", member.id), {
      status: member.status === "Ada" ? "Sibuk" : "Ada",
    });
  };

  // ❌ Delete member
  const deleteMember = async (id) => {
    await deleteDoc(doc(db, "members", id));
  };

  return (
    <div>
      <h1>🚀 Technical Designer Availability Dashboard</h1>
        <div style={{ marginBottom: "15px" }}>
          <strong>Mode:</strong>{" "}
          <button onClick={() => setRole("admin")}>Admin</button>
          <button onClick={() => setRole("viewer")} style={{ marginLeft: "10px" }}>
            Viewer
          </button>
        </div>

      {/* 🔍 Search */}
      <input
        placeholder="Cari nama TechDes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* ➕ Add Member */}
        {role === "admin" && (
          <div className="card">
        <input
          placeholder="Name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />

        <textarea
          placeholder={`Workload details\n• Task 1\n• Task 2`}
          value={newWorkload}
          onChange={(e) => setNewWorkload(e.target.value)}
        />

        <button className="main" onClick={addMember}>
          Add Member
        </button>
      </div>
      )}

      {/* 🧩 Board */}
      <div className="board">
        {["Ada", "Sibuk"].map((status) => (
          <div key={status}>
           
            <h2 style={{ textAlign: "center", marginBottom: "10px" }}>
              {status.toUpperCase()}
            </h2>
            {members
              .filter(
                (m) =>
                  m.status === status &&
                  m.name.toLowerCase().includes(search.toLowerCase())
              )
              .map((m) => (
                <div key={m.id} className="card">
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <strong>{m.name}</strong>
                    {role === "admin" && (
                      <button
                      className="delete"
                      onClick={() => deleteMember(m.id)}
                    >
                      Hapus
                    </button>
                        )}
                  </div>

                  <pre>{m.workload}</pre>
                  {role === "admin" && (
                  <button
                    className="toggle"
                    onClick={() => toggleStatus(m)}
                  >
                    Ganti Status
                  </button>
                      )}
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
