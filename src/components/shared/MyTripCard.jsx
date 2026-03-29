import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPlacePhoto } from "../../services/placePhotoApi";
import { Banknote, Clock, MapPin, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../services/firebaseConfig";

const MyTripCard = ({ trip, onDelete }) => {
  const [placePhoto, setPlacePhoto] = useState("");
  const [isDeleted, setIsDeleted] = useState(false);

  useEffect(() => {
    if (!trip?.userSelection?.destination?.label) return;

    const loadPhoto = async () => {
      try {
        const photoUrl = await getPlacePhoto(trip.userSelection.destination.label);
        setPlacePhoto(photoUrl);
      } catch (err) {
        console.log(err);
      }
    };
    loadPhoto();
  }, [trip]);

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDeleted(true);

    try {
      await deleteDoc(doc(db, "trips-ai", trip.id));
      if (onDelete) onDelete(trip.id);
    } catch (err) {
      console.error("Error deleting trip:", err);
      setIsDeleted(false);
    }
  };

  return (
    <AnimatePresence>
      {!isDeleted && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ duration: 0.4 }}
        >
          <Link to={`/trips/${trip.id}`}>
            <motion.div
              whileHover={{ scale: 1.03, rotateX: 2, rotateY: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="group relative rounded-3xl overflow-hidden
                         bg-white/50 backdrop-blur-lg border border-white/20
                         shadow-2xl hover:shadow-3xl transition-all duration-500"
            >
              {/* Premium Delete Button */}
              <button
                onClick={handleDelete}
                className="absolute top-3 right-3 z-10 p-3 rounded-full 
                           bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500
                           text-white shadow-xl shadow-pink-400/50
                           backdrop-blur-sm border border-white/20
                           transform transition-all duration-300
                           hover:scale-110 hover:rotate-12 hover:shadow-2xl hover:shadow-purple-400/60
                           active:scale-95 active:rotate-0"
              >
                <Trash2 className="h-5 w-5" />
              </button>

              {/* Image with fixed height */}
              <div className="relative h-52 w-full overflow-hidden rounded-3xl">
                {placePhoto && (
                  <motion.img
                    layoutId={`trip-image-${trip.id}`}
                    src={placePhoto}
                    alt="trip"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent rounded-3xl" />
                <h4 className="absolute bottom-3 left-4 text-white text-xl font-semibold drop-shadow-lg">
                  {trip?.userSelection?.destination?.label}
                </h4>
              </div>

              {/* Content */}
              <div className="p-5 space-y-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-1 bg-gray-100/50 px-3 py-1 rounded-full backdrop-blur-sm">
                    <Banknote className="h-4 w-4" />
                    {trip?.userSelection?.budget}
                  </div>
                  <div className="flex items-center gap-1 bg-gray-100/50 px-3 py-1 rounded-full backdrop-blur-sm">
                    <Clock className="h-4 w-4" />
                    {trip?.userSelection?.noOfDays} days
                  </div>
                </div>

                <div className="text-sm text-gray-700 font-medium">
                  👤 {trip?.userSelection?.traveler}
                </div>

                <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">
                  {trip?.tripData?.tripNote || "No description available"}
                </p>

                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <MapPin className="h-3 w-3" />
                  {trip?.userSelection?.destination?.label}
                </div>
              </div>

              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </motion.div>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MyTripCard;