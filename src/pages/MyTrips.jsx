import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from '../services/firebaseConfig';
import MyTripCard from '@/components/shared/MyTripCard';
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';

function MyTrips() {
  const [userTrips, setUserTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch user trips
  const getUserTrips = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return navigate('/');

    const q = query(
      collection(db, "trips-ai"),
      where("userEmail", "==", user?.email)
    );

    try {
      const snapshot = await getDocs(q);
      const allTrips = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUserTrips(allTrips);
    } catch (err) {
      console.error("Error fetching trips:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserTrips();
  }, []);

  // Delete trip from Firestore & state
  const handleTripDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "trips-ai", id));
      setUserTrips(prev => prev.filter(trip => trip.id !== id));
    } catch (err) {
      console.error("Error deleting trip:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
        <div>
          <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-500 bg-clip-text text-transparent">
            My Trips ✈️
          </h2>
          <p className="text-gray-500 mt-2">Curated journeys crafted just for you</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Total Trips */}
          <div className="flex items-center justify-center px-6 py-3 rounded-2xl
                          bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500
                          text-white font-semibold shadow-lg shadow-purple-400/50
                          min-w-[150px] text-center">
            Total Trips: {userTrips.length}
          </div>

          {/* New Trip Button */}
          <button
            onClick={() => navigate('/create-trip')}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl
                       bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500
                       text-white font-semibold shadow-xl shadow-purple-400/50
                       min-w-[150px] text-center
                       backdrop-blur-sm border border-white/20
                       transform transition-all duration-300
                       hover:scale-110 hover:-translate-y-1 hover:rotate-6 hover:shadow-2xl hover:shadow-pink-400/60
                       active:scale-95 active:translate-y-0 active:rotate-0"
          >
            <Plus className="w-5 h-5" />
            New Trip
          </button>
        </div>
      </div>

      {/* Grid Container */}
      <div className="bg-white/60 backdrop-blur-2xl border border-gray-200 rounded-3xl shadow-2xl p-6">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {[1,2,3,4].map(i => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-[240px] w-full rounded-3xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : userTrips.length > 0 ? (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence>
              {userTrips.map((trip) => (
                <motion.div
                  key={trip.id}
                  layout  // smooth grid reflow
                  initial={{ opacity: 0, y: 40, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -40, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                >
                  <MyTripCard
                    trip={trip}
                    onDelete={handleTripDelete}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
            <div className="w-28 h-28 rounded-full bg-gray-100 flex items-center justify-center mb-6 shadow-inner">
              ✈️
            </div>
            <h3 className="text-2xl font-semibold text-gray-800">No Trips Yet</h3>
            <p className="text-gray-500 mt-2 mb-6">Start your journey by creating a new trip</p>
            <button
              onClick={() => navigate('/create-trip')}
              className="px-6 py-3 rounded-xl bg-black text-white shadow-md hover:scale-105 transition"
            >
              Create Trip
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyTrips;