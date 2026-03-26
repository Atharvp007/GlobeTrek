import React, { useState, useEffect } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { SelectTravelersList, SelectBudgetOptions } from "../constants/Options";
import { Toaster, toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { FiCalendar } from "react-icons/fi"; // calendar icon
import { Loader2 } from "lucide-react"; // loader icon
import { generateTripWithAI } from "../services/aiModel";
import LoginDialog from "../components/shared/LoginDialog";
const CreateTrip = () => {
  const placesApiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [tripData, setTripData] = useState(null);
  const [formData, setFormData] = useState({
    destination: null,
    noOfDays: "",
    traveler: "",
    budget: "",
  });

  useEffect(() => {
    console.log("Form Data Updated:", formData);
  }, [formData]);

  const next = () => setStep((prev) => prev + 1);
  const prev = () => setStep((prev) => prev - 1);

    const handleSubmit = async () => {

      const user = localStorage.getItem("user")
if (!user) {
  return setOpenDialog(true)
}
    if (!formData.destination || !formData.noOfDays || !formData.traveler || !formData.budget) {
      toast.error("Please complete all steps");
      return;
    }

    try {
      setLoading(true);

      const DYNAMIC_PROMPT = `Generate a travel plan for Location: ${formData?.destination?.label} for ${formData?.noOfDays} days for a ${formData?.traveler} traveler on ${formData?.budget} budget. Return strictly a single JSON object with camelCase keys. Include: tripNote, hotelsOptions (hotelName, hotelAddress, priceRange, imageUrl, rating, description, coordinates with latitude and longitude), itinerary (dayNumber, theme, activities with activityName, description, imageUrl, ticketPrice, timeRange, timeToTravel, coordinates). Return JSON only.`;

      
      const result = await generateTripWithAI(DYNAMIC_PROMPT);

      console.log("AI Trip Result:", result);

      setTripData(result); 

      toast.success("Your premium trip is ready! ✨");

    } catch (error) {
      console.error(error);
      toast.error("Failed to generate trip");
    } finally {
      setLoading(false);
    }
  };
  const stepTransition = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

// Premium Loading Screen
if (loading) {
  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-purple-50 to-pink-50 flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Background Glow Circles */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute top-10 right-1/4 w-80 h-80 bg-pink-400/20 rounded-full blur-3xl animate-pulse-slow delay-2000" />
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-pulse-slow delay-4000" />

      {/* Spinner Container */}
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-300 via-pink-300 to-indigo-400 opacity-20 animate-spin-slow" />
        <div className="relative bg-white/90 p-6 rounded-3xl shadow-2xl flex items-center justify-center">
          <Loader2 className="w-14 h-14 text-purple-600 animate-spin" />
        </div>
      </div>

      {/* Text */}
      <h3 className="mt-10 text-2xl md:text-3xl font-bold text-gray-900 text-center">
        Curating your trip to{" "}
        <span className="text-purple-500">
          {formData.destination?.label?.split(",")[0]}
        </span>
        ...
      </h3>
      <p className="mt-2 text-gray-600 text-center animate-pulse text-lg md:text-xl">
        Our AI is finding the best hotels, experiences, and hidden gems for you ✨
      </p>

      {/* Optional subtle loading dots */}
      <div className="flex mt-6 space-x-2">
        <span className="w-3 h-3 bg-purple-500 rounded-full animate-bounce delay-75" />
        <span className="w-3 h-3 bg-pink-500 rounded-full animate-bounce delay-150" />
        <span className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce delay-300" />
      </div>
    </div>
  );
}

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-16 bg-gradient-to-b from-gray-50 to-gray-100">
      <Toaster position="bottom-right" reverseOrder={false} />

      {/* Glow Backgrounds */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-purple-400/20 blur-3xl rounded-full animate-pulse-slow" />
      <div className="absolute top-0 right-0 w-80 h-80 bg-pink-400/20 blur-3xl rounded-full animate-pulse-slow delay-2000" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-indigo-400/20 blur-3xl rounded-full animate-pulse-slow delay-4000" />

      {/* Glass Card */}
      <motion.div
        className="relative z-10 w-full max-w-3xl bg-white/60 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30 flex flex-col overflow-hidden"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Progress Bar */}
        <div className="h-2 bg-white/30">
          <div
            className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 transition-all duration-500"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <div className="p-6 md:p-10 flex flex-col flex-1">
          {/* Step Indicators */}
          <div className="flex justify-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all duration-300 ${
                  step === s
                    ? "w-12 bg-gradient-to-r from-purple-500 to-pink-500"
                    : step > s
                    ? "w-4 bg-purple-400"
                    : "w-3 bg-gray-200"
                }`}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* STEP 1 */}
            {step === 1 && (
              <motion.div
                key="step1"
                variants={stepTransition}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-6"
              >
                <h3 className="text-3xl font-bold">Where’s your next trip? ✈️</h3>
                <p className="text-gray-600">Choose destination and duration</p>

                <div>
                  <label className="font-medium">Destination</label>
                  <div className="mt-2">
                    <GooglePlacesAutocomplete
                      apiKey={placesApiKey}
                      selectProps={{
                        value: formData.destination,
                        onChange: (val) => setFormData({ ...formData, destination: val }),
                        placeholder: "Search destination...",
                        isDisabled: loading,
                      }}
                    />
                  </div>
                </div>

                {/* Days Input with Calendar Icon */}
                <div className="relative">
                  <label className="font-medium">Days</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={formData.noOfDays}
                    disabled={loading}
                    onChange={(e) => setFormData({ ...formData, noOfDays: e.target.value })}
                    className="w-full mt-2 p-3 pl-10 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
                    placeholder="Number of days"
                  />
                  <FiCalendar className="absolute left-3 top-2/3 -translate-y-1/2 text-gray-400" />
                </div>

                <div className="flex justify-end mt-4">
                  <button
                    disabled={!formData.destination || !formData.noOfDays || loading}
                    onClick={next}
                    className="px-6 py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-105 shadow-lg transition-all disabled:opacity-40"
                  >
                    Next →
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <motion.div
                key="step2"
                variants={stepTransition}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-6"
              >
                <h3 className="text-3xl font-bold">Select Budget 💰</h3>
                <p className="text-gray-600">Choose your travel style</p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                  {SelectBudgetOptions.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => !loading && setFormData({ ...formData, budget: item.title })}
                      className={`relative p-5 rounded-2xl cursor-pointer transition-all duration-300
                        bg-white/70 backdrop-blur-md border hover:shadow-xl hover:-translate-y-1
                        ${formData.budget === item.title
                          ? "border-purple-500 ring-2 ring-purple-300 scale-105"
                          : "border-gray-200"
                        }`}
                    >
                      {formData.budget === item.title && (
                        <span className="absolute top-2 right-2 text-xs bg-purple-500 text-white px-2 py-1 rounded-full">
                          Selected
                        </span>
                      )}
                      <div className="text-4xl">{item.icon}</div>
                      <h4 className="font-semibold text-lg mt-2">{item.title}</h4>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between">
                  <button onClick={prev} disabled={loading} className="text-gray-600">← Back</button>
                  <button
                    disabled={!formData.budget || loading}
                    onClick={next}
                    className="px-6 py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-105 shadow-lg transition-all disabled:opacity-40"
                  >
                    Next →
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <motion.div
                key="step3"
                variants={stepTransition}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-6"
              >
                <h3 className="text-3xl font-bold">Who’s traveling? 🧑‍🤝‍🧑</h3>

                <div className="grid grid-cols-2 gap-5">
                  {SelectTravelersList.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => !loading && setFormData({ ...formData, traveler: item.title })}
                      className={`relative p-5 rounded-2xl cursor-pointer transition-all duration-300
                        bg-white/70 backdrop-blur-md border hover:shadow-xl hover:-translate-y-1
                        ${formData.traveler === item.title
                          ? "border-purple-500 ring-2 ring-purple-300 scale-105"
                          : "border-gray-200"
                        }`}
                    >
                      {formData.traveler === item.title && (
                        <span className="absolute top-2 right-2 text-xs bg-purple-500 text-white px-2 py-1 rounded-full">
                          Selected
                        </span>
                      )}
                      <div className="text-4xl">{item.icon}</div>
                      <h4 className="font-semibold mt-2">{item.title}</h4>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between">
                  <button onClick={prev} disabled={loading} className="text-gray-600">← Back</button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-6 py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:scale-105 shadow-lg flex items-center justify-center transition-all"
                  >
                    Generate Trip
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      <LoginDialog open={openDialog} onClose={() => setOpenDialog(false)} onLoginSuccess={handleSubmit}/>
    </div>
  );
};

export default CreateTrip;