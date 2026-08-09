import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./component/Login";
import Signup from "./component/Signup";
import Navbar from "./component/Navbar";
import Sidebar from "./component/Sidebar";
import Note from "./component/Note";
import Home from "./component/Home";
import CreateNotes from "./component/CreateNotes";
import Dashboard from "./component/Dashboard";
import NotFound from "./component/NotFound";
import ProtectedRoute from "./component/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <div className="flex">
                <Sidebar />
                <main className="flex-1">
                  <Home />
                </main>
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/notes/:id"
          element={
            <ProtectedRoute>
              <div className="flex">
                <Sidebar />
                <main className="flex-1">
                  <Note />
                </main>
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/createNotes"
          element={
            <ProtectedRoute>
              <CreateNotes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
