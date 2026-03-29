import React, { useEffect, useState } from "react";
import { IoTimeOutline } from "react-icons/io5";
import { MapPin } from "lucide-react";
import { getPlacePhoto } from "../../services/placePhotoApi";

/* SMART TAG LOGIC */
const getTag = (name = "") => {
  const s = name.toLowerCase();
  if (s.includes("museum") || s.includes("fort")) return "🏛️ Must Visit";
  if (s.includes("cafe") || s.includes("food")) return "🍽️ Food Spot";
  if (s.includes("park") || s.includes("garden")) return "🌿 Relax";
  if (s.includes("market") || s.includes("shopping")) return "🛍️ Shopping";
  return "✨ Explore";
};

const ActivityCard = ({ activity }) => {
  const [placePhoto, setPlacePhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgLoaded, setImgLoaded] = useState(false);

  const tag = getTag(activity?.activityName);

  useEffect(() => {
    if (!activity?.activityName) return;

    const cacheKey = `activity-img-${activity.activityName}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      setPlacePhoto(cached);
      setLoading(false);
      return;
    }

    const loadPhoto = async () => {
      try {
        const photoUrl = await getPlacePhoto(activity.activityName);
        if (photoUrl) {
          setPlacePhoto(photoUrl);
          localStorage.setItem(cacheKey, photoUrl);
        }
      } catch (err) {
        console.error("Photo error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadPhoto();
  }, [activity?.activityName]);

  return (
    <div className="group relative flex gap-x-4">
      {/* TIMELINE */}
      <div className="flex flex-col items-center">
        {/* Watch Icon */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md z-10">
          <IoTimeOutline className="text-white w-4 h-4" />
        </div>

        {/* Vertical Line (hide if last activity) */}
        {!activity.isLast && (
          <div className="w-px flex-1 bg-gray-200 mt-1" />
        )}
      </div>

      {/* CONTENT */}
      <div className="flex-1 pb-8">
        {/* Time */}
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm font-semibold text-gray-800">{activity.timeRange}</p>
        </div>

        {/* Travel Time */}
        <p className="text-xs text-gray-500 mb-2">🚗 {activity.timeToTravel}</p>

        {/* Card */}
        <div className="bg-white/90 backdrop-blur border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
          <div className="flex flex-col sm:flex-row">
            {/* IMAGE */}
            <div className="relative sm:w-48 h-40 overflow-hidden">
              {/* Skeleton */}
              {loading && <div className="absolute inset-0 animate-pulse bg-gray-300" />}

              {/* Fallback icon */}
              {!loading && !placePhoto && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                  <span className="text-3xl opacity-40">📍</span>
                </div>
              )}

              {/* Actual Image */}
              {placePhoto && (
                <img
                  src={placePhoto}
                  alt="activity"
                  loading="lazy"
                  onLoad={() => setImgLoaded(true)}
                  className={`h-full w-full object-cover transition-all duration-700 group-hover:scale-110 ${
                    imgLoaded ? "opacity-100 blur-0" : "opacity-0 blur-md"
                  }`}
                />
              )}

              {/* Ticket */}
              {activity.ticketPrice && (
                <div className="absolute bottom-2 left-2 bg-white/90 px-2 py-1 text-xs font-semibold rounded-lg shadow">
                  🎟️ {activity.ticketPrice}
                </div>
              )}

              {/* Tag */}
              <div className="absolute top-2 left-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[10px] px-2 py-1 rounded-full shadow">
                {tag}
              </div>
            </div>

            {/* TEXT */}
            <div className="p-4 flex flex-col justify-between flex-1">
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">{activity.activityName}</h3>
                <p className="mt-1 text-xs text-gray-600 line-clamp-3">{activity.description}</p>
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center mt-3">
                <span className="text-[10px] text-indigo-500 font-medium uppercase">Planned</span>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${activity.activityName}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-lg transition"
                >
                  <MapPin className="w-3 h-3" />
                  View Map
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;