import React from "react";
import Header from "./components/shared/Header";
import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion"; // 👈 add this
import Home from "./pages/Home";
import CreateTrip from "./pages/CreateTrip";
import TripDetails from "./pages/TripDetails";
import MyTrips from "./pages/MyTrips";

const App = () => {
  const location = useLocation(); // 👈 add this

  return (
    <>
      <Header />

      <main className="pt-[80px]">
        {/* 👇 wrap ONLY this */}
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/create-trip" element={<CreateTrip />} />
            <Route path="/trips/:tripId" element={<TripDetails />} />
            <Route path="/my-trips" element={<MyTrips />} />
          </Routes>
        </AnimatePresence>
      </main>
    </>
  );
};

export default App;