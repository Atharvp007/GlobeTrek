import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../services/firebaseConfig';
import MyTripCard from '@/components/shared/MyTripCard';
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

function MyTrips() {
  const [userTrips, setUserTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getUserTrips = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      return navigate('/');
    }

    const q = query(
      collection(db, "trips-ai"),
      where("userEmail", "==", user?.email)
    );

    try {
      const querySnapshot = await getDocs(q);

      const allTrips = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      setUserTrips(allTrips);
    } catch (error) {
      console.log("Error fetching userTrips", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserTrips();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-500 bg-clip-text text-transparent">
            My Trips ✈️
          </h2>
          <p className="text-gray-500 mt-2">Curated journeys crafted just for you</p>
        </div>

        <button
          onClick={() => navigate('/create-trip')}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-black text-white hover:opacity-90 transition-all shadow-lg"
        >
          <Plus className="w-4 h-4" />
          New Trip
        </button>
      </div>

      {/* Glass Container */}
      <div className="bg-white/60 backdrop-blur-2xl border border-gray-200 rounded-3xl shadow-2xl p-6">

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">

          {loading ? (
            [1, 2, 3, 4].map((index) => (
              <div key={index} className="space-y-4">
                <Skeleton className="h-[240px] w-full rounded-3xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))
          ) : userTrips?.length > 0 ? (
            userTrips.map((trip, index) => (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.07, duration: 0.5 }}
                whileHover={{ y: -8 }}
                className="transition-all duration-300"
              >
                <MyTripCard trip={trip} />
              </motion.div>
            ))
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

    </div>
  )
}

export default MyTrips;
