import React from "react";
import Header from "./components/shared/Header";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import CreateTrip from "./pages/CreateTrip";

const App = () => {
  return (
    <>
      <Header />

      
      <main className="pt-[80px]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-trip" element={<CreateTrip />} />
        </Routes>
      </main>
    </>
  );
};

export default App;