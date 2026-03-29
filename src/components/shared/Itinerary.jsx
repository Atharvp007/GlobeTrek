import React, { useRef } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ActivityCard from "./ActivityCard";

function Itinerary({ trip }) {
  const accordionRefs = useRef({}); // Store refs for each day

  const handleOpen = (dayIndex) => {
    const node = accordionRefs.current[dayIndex];
    if (node) {
      node.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section>
      <Accordion type="multiple" defaultValue={["item-1"]}>
        {trip?.tripData?.itinerary?.map((day, dayIndex) => (
          <AccordionItem
            value={`item-${dayIndex + 1}`}
            key={dayIndex}
            ref={(el) => (accordionRefs.current[dayIndex] = el)} // Save ref
          >
            <AccordionTrigger
              className="flex items-start justify-start text-[16px] font-bold"
              onClick={() => handleOpen(dayIndex)}
            >
              Day {day.dayNumber}: {day.theme}
            </AccordionTrigger>

            <AccordionContent>
              <div className="mt-4 flex flex-col gap-4">
                {day.activities?.map((activity, i) => (
                  <ActivityCard
                    key={i}
                    activity={{ ...activity, isLast: i === day.activities.length - 1 }}
                  />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

export default Itinerary;