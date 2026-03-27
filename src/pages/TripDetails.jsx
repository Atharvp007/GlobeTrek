import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebaseConfig";
import { FaArrowLeftLong } from "react-icons/fa6";
import { Calendar } from "lucide-react"; // example icon, replace with your import
import Itinerary from "../components/shared/Itinerary"; // your component
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import HotelCard from "../components/shared/HotelCard";
import Autoplay from "embla-carousel-autoplay";
import TripStats from "@/components/shared/TripStats";

function TripDetails() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const navigate = useNavigate();

  const fetchTripData = async () => {
    try {
      const docRef = doc(db, "trips-ai", tripId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setTrip(docSnap.data());
      else console.log("No such document!");
    } catch (err) {
      console.error("Error fetching trip:", err);
    }
  };

  useEffect(() => {
    if (tripId) fetchTripData();
  }, [tripId]);

  if (!trip) return <p className="p-6">Loading trip data...</p>;

  return (
    <div className="min-h-screen bg-background relative">
      {/* Hero Section */}
      <div className="relative h-88 md:h-111 bg-gray-900">
        <img
          src={"/private.png"}
          alt="Trip Background"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent" />

        {/* Hero Overlay Content */}
        <div className="absolute bottom-0 left-0 right-0 max-w-6xl mx-auto p-6 text-white">
          <button
            onClick={() => navigate("/create-trip")}
            className="mb-4 text-sm bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full hover:bg-white/30 transition-colors flex items-center gap-1"
          >
            <FaArrowLeftLong /> Plan Another Trip
          </button>

          <h1 className="text-3xl font-bold mb-2">
            {trip?.userSelection?.destination?.label ||
              trip?.userSelection?.destination?.value}
          </h1>

          <p className="max-w-2xl text-lg">
            {trip?.tripData?.tripNote?.split(".")[0] ||
              "No trip note available"}
          </p>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="max-w-6xl mx-auto p-6 py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column -> Itineraries */}
          <div className="lg:col-span-2 space-y-6">
            <div className="sm:bg-white rounded-2xl sm:shadow-sm sm:border border-gray-100 sm:p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-indigo-600" /> Your Daily
                Plan
              </h2>
              <Itinerary trip={trip} />
            </div>
          </div>

          {/* Right Column -> Hotels & Trip summary */}

          <div className="space-y-6">
            <Carousel
              plugins={[
                Autoplay({
                  delay: 3000,
                  stopOnInteraction: true,
                }),
              ]}
            >
              <CarouselContent>
                {trip?.tripData?.hotelsOptions.map((hotel, index) => (
                  <CarouselItem key={index}>
                    <HotelCard hotel={hotel} />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
            <TripStats trip={trip}/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TripDetails;
