import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPlacePhoto } from "../../services/placePhotoApi";
import { Banknote, Clock, MapPin } from "lucide-react";
import { motion } from "framer-motion";

const MyTripCard = ({ trip }) => {
  const [placePhoto, setPlacePhoto] = useState("");

  useEffect(() => {
    if (!trip?.userSelection?.destination?.label) return;

    const loadPhoto = async () => {
      try {
        const photoUrl = await getPlacePhoto(
          trip.userSelection.destination.label
        );
        setPlacePhoto(photoUrl);
      } catch (err) {
        console.log(err);
      }
    };

    loadPhoto();
  }, [trip]);

  return (
    <Link to={"/trips/" + trip?.id}>
      <motion.div
        whileHover={{ scale: 1.04, rotateX: 2, rotateY: -2 }}
        whileTap={{ scale: 0.97 }}  // 👈 smooth click feel (no style change)
        transition={{ type: "spring", stiffness: 200 }}
        className="group relative rounded-3xl overflow-hidden bg-white shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100"
      >
        {/* Image */}
        <div className="relative h-52 overflow-hidden">
          
          {/* ✅ ONLY CHANGE HERE */}
          <motion.img
            layoutId={`trip-image-${trip.id}`}
            src={placePhoto || "/private.png"}
            alt="trip"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Title on Image */}
          <h4 className="absolute bottom-3 left-4 text-white text-xl font-semibold drop-shadow-lg">
            {trip?.userSelection?.destination?.label}
          </h4>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          
          {/* Info Row */}
          <div className="flex justify-between text-sm text-gray-600">
            <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
              <Banknote className="h-4 w-4" />
              {trip?.userSelection?.budget}
            </div>

            <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
              <Clock className="h-4 w-4" />
              {trip?.userSelection?.noOfDays} days
            </div>
          </div>

          {/* Traveler */}
          <div className="text-sm text-gray-700 font-medium">
            👤 {trip?.userSelection?.traveler}
          </div>

          {/* Description */}
          <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">
            {trip?.tripData?.tripNote || "No description available"}
          </p>

          {/* Location */}
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <MapPin className="h-3 w-3" />
            {trip?.userSelection?.destination?.label}
          </div>
        </div>

        {/* Glow Effect */}
        <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </motion.div>
    </Link>
  );
};

export default MyTripCard;