import React, { useState } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import {
  SelectTravelersList,
  SelectBudgetOptions,
} from "../constants/Options";

const CreateTrip = () => {
  const placesApiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    destination: null,
    noOfDays: "",
    traveler: "",
    budget: "",
  });

  const next = () => setStep((prev) => prev + 1);
  const prev = () => setStep((prev) => prev - 1);

  const handleSubmit = () => {
    if (
      !formData.destination ||
      !formData.noOfDays ||
      !formData.traveler ||
      !formData.budget
    ) {
      alert("Please complete all steps");
      return;
    }

    console.log({
      destination: formData.destination.label,
      ...formData,
    });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-16 bg-gradient-to-b from-gray-50 to-white">

      {/* 🌈 Glow Background */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-400/20 blur-3xl rounded-full" />
      <div className="absolute top-0 right-0 w-72 h-72 bg-pink-400/20 blur-3xl rounded-full" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-indigo-400/20 blur-3xl rounded-full" />

      {/* 🧊 Main Card */}
      <div className="relative z-10 w-full max-w-3xl bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 flex flex-col overflow-hidden">

        {/* Progress Bar */}
        <div className="h-2 bg-white/40">
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
                    ? "w-10 bg-gradient-to-r from-purple-500 to-pink-500"
                    : step > s
                    ? "w-3 bg-purple-400"
                    : "w-3 bg-gray-200"
                }`}
              />
            ))}
          </div>

          <div className="flex-1 flex flex-col justify-center">

            {/* STEP 1 */}
            {step === 1 && (
              <div className="flex flex-col gap-6">
                <div>
                  <h3 className="text-2xl font-bold">
                    Where’s your next trip? ✈️
                  </h3>
                  <p className="text-gray-500">
                    Choose destination and duration
                  </p>
                </div>

                <div>
                  <label className="font-medium">Destination</label>
                  <div className="mt-2">
                    <GooglePlacesAutocomplete
                      apiKey={placesApiKey}
                      selectProps={{
                        value: formData.destination,
                        onChange: (val) =>
                          setFormData({ ...formData, destination: val }),
                        placeholder: "Search destination...",
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label className="font-medium">Days</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={formData.noOfDays}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        noOfDays: e.target.value,
                      })
                    }
                    className="w-full mt-2 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>

                {/* Right aligned Next */}
                <div className="flex justify-end mt-4">
                  <button
                    disabled={!formData.destination || !formData.noOfDays}
                    onClick={next}
                    className="px-6 py-2 rounded-lg text-white font-medium
                    bg-gradient-to-r from-purple-500 to-pink-500
                    hover:scale-105 transition-all shadow-md
                    disabled:opacity-40"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2 - Budget */}
            {step === 2 && (
              <div className="flex flex-col gap-6">
                <div>
                  <h3 className="text-2xl font-bold">Select Budget 💰</h3>
                  <p className="text-gray-500 text-sm">
                    Choose your travel style
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                  {SelectBudgetOptions.map((item) => (
                    <div
                      key={item.id}
                      onClick={() =>
                        setFormData({ ...formData, budget: item.title })
                      }
                      className={`relative p-5 rounded-2xl cursor-pointer transition-all duration-300
                        bg-white/70 backdrop-blur-md border
                        hover:shadow-xl hover:-translate-y-1
                        ${
                          formData.budget === item.title
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
                      <h4 className="font-semibold text-lg mt-2">
                        {item.title}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between">
                  <button onClick={prev} className="text-gray-600">
                    ← Back
                  </button>

                  <button
                    disabled={!formData.budget}
                    onClick={next}
                    className="px-6 py-2 rounded-lg text-white
                    bg-gradient-to-r from-purple-500 to-pink-500
                    disabled:opacity-40"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3 - Travelers */}
            {step === 3 && (
              <div className="flex flex-col gap-6">
                <h3 className="text-2xl font-bold">
                  Who’s traveling? 🧑‍🤝‍🧑
                </h3>

                <div className="grid grid-cols-2 gap-5">
                  {SelectTravelersList.map((item) => (
                    <div
                      key={item.id}
                      onClick={() =>
                        setFormData({ ...formData, traveler: item.title })
                      }
                      className={`relative p-5 rounded-2xl cursor-pointer transition-all duration-300
                        bg-white/70 backdrop-blur-md border
                        hover:shadow-xl hover:-translate-y-1
                        ${
                          formData.traveler === item.title
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
                      <h4 className="font-semibold mt-2">
                        {item.title}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between">
                  <button onClick={prev} className="text-gray-600">
                    ← Back
                  </button>

                  <button
                    onClick={handleSubmit}
                    className="px-6 py-3 rounded-xl text-white font-semibold
                    bg-gradient-to-r from-purple-500 via-pink-500 to-red-500
                    hover:scale-[1.02] transition-all shadow-lg"
                  >
                    🚀 Generate Trip
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTrip;