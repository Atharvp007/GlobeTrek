import { Star } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { getPlacePhoto } from "../../services/placePhotoApi";

const HotelCard = ({ hotel }) => {
  const [placePhoto, setPlacePhoto] = useState(null);
  const [loading, setLoading] = useState(true);

  if (!hotel) return null;

  useEffect(() => {
    if (!hotel?.hotelName) return;

    const cacheKey = `hotel-img-${hotel.hotelName}`;
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      setPlacePhoto(cached);
      setLoading(false);
      return;
    }

    const loadPhoto = async () => {
      try {
        const photoUrl = await getPlacePhoto(hotel.hotelName);
        if (photoUrl) {
          setPlacePhoto(photoUrl);
          localStorage.setItem(cacheKey, photoUrl);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    loadPhoto();
  }, [hotel?.hotelName]);

  return (
    <Link
      to={`https://www.google.com/maps/search/?api=1&query=${hotel?.hotelName},${hotel?.hotelAddress}`}
      target="_blank"
    >
      <div className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">

        {/* IMAGE */}
        <div className="relative h-48 overflow-hidden">

          {/* Skeleton */}
          {loading && (
            <div className="absolute inset-0 animate-pulse bg-gray-300" />
          )}

          {/* Premium fallback if no image */}
          {!loading && !placePhoto && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <span className="text-3xl opacity-40">🏨</span>
            </div>
          )}

          {/* Image */}
          {placePhoto && (
            <img
              src={placePhoto}
              alt={hotel.hotelName}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

          {/* ⭐ Rating */}
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-full text-xs font-semibold flex items-center shadow">
            <Star className="w-3 h-3 text-yellow-400 mr-1 fill-yellow-400" />
            {hotel.rating || "4.5"}
          </div>

          {/* 💰 Price badge */}
          <div className="absolute bottom-3 left-3 bg-white px-3 py-1 rounded-xl text-sm font-bold shadow-md">
            {hotel?.priceRange ? hotel.priceRange.split(" p")[0] : "₹2000"}
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-4 space-y-2">

          <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">
            {hotel.hotelName}
          </h3>

          <p className="text-xs text-gray-500 line-clamp-1">
            📍 {hotel.hotelAddress}
          </p>

          <p className="text-xs text-gray-600 line-clamp-2">
            {hotel.description}
          </p>

          {/* CTA */}
          <div className="flex justify-between items-center pt-2">

            <span className="text-[10px] text-gray-400 uppercase">
              per night
            </span>

            <Button
              size="sm"
              className="rounded-full px-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90"
            >
              View Deal →
            </Button>

          </div>
        </div>

      </div>
    </Link>
  );
};

export default HotelCard;