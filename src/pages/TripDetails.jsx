import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebaseConfig";
import { FaArrowLeftLong } from "react-icons/fa6";
import { Calendar } from "lucide-react";
import Itinerary from "../components/shared/Itinerary";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import HotelCard from "../components/shared/HotelCard";
import Autoplay from "embla-carousel-autoplay";
import TripStats from "@/components/shared/TripStats";
import { getPlacePhoto } from "../services/placePhotoApi";
import { motion } from "framer-motion";

function TripDetails() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [placePhoto, setPlacePhoto] = useState("");
  const [loadingHero, setLoadingHero] = useState(true);
  const navigate = useNavigate();

  // Scroll to top whenever page loads
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Fetch trip data from Firestore
  const fetchTripData = async () => {
    try {
      const docRef = doc(db, "trips-ai", tripId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setTrip(docSnap.data());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (tripId) fetchTripData();
  }, [tripId]);

  // Load hero image
  useEffect(() => {
    if (!trip?.userSelection?.destination?.label) return;

    const loadPhoto = async () => {
      try {
        const photoUrl = await getPlacePhoto(trip.userSelection.destination.label);
        setPlacePhoto(photoUrl);
      } catch {
        setPlacePhoto(null);
      } finally {
        setLoadingHero(false);
      }
    };

    loadPhoto();
  }, [trip]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-background"
    >
      {/* HERO */}
      <div className="relative h-80 md:h-96 w-full overflow-hidden rounded-b-3xl shadow-xl">
        {loadingHero && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse">
            <span className="text-6xl opacity-30">📍</span>
          </div>
        )}

        {!loadingHero && !placePhoto && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <span className="text-6xl opacity-30">📍</span>
          </div>
        )}

        {placePhoto && (
          <motion.img
            layoutId={`trip-image-${tripId}`}
            src={placePhoto}
            alt="Destination"
            className="w-full h-full object-cover brightness-90 contrast-105 saturate-110 transition-all duration-500"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-gray-900/30"></div>

        {/* HERO CONTENT */}
        <div className="absolute bottom-6 left-6 md:left-12 space-y-3">
          <button
            onClick={() => navigate("/create-trip")}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full font-semibold text-white hover:bg-white/30 hover:scale-105 transition-all duration-300 shadow-[0_0_10px_rgba(255,255,255,0.3)]"
          >
            <FaArrowLeftLong className="text-white" />
            Plan Another Trip
          </button>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-400 drop-shadow-lg">
            {trip?.userSelection?.destination?.label}
          </h1>

          {trip?.tripData?.tripNote && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-sm md:text-base text-gray-300/90 drop-shadow-md max-w-lg tracking-wide leading-relaxed"
            >
              {trip?.tripData?.tripNote.split(".")[0]}.
            </motion.p>
          )}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <Calendar className="mr-2 text-indigo-600" />
                Your Daily Plan
              </h2>
              <Itinerary trip={trip} />
            </div>
          </div>

          <div className="space-y-6">
            <Carousel plugins={[Autoplay({ delay: 3000 })]}>
              <CarouselContent>
                {trip?.tripData?.hotelsOptions?.map((hotel, i) => (
                  <CarouselItem key={i}>
                    <HotelCard hotel={hotel} />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>

            <TripStats trip={trip} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default TripDetails;