import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ActivityCard from "./ActivityCard";

function Itinerary({ trip }) {
  return (
    <section>
      <Accordion type="single" collapsible defaultValue={"item-1"}>
        {trip?.tripData?.itinerary?.map((day, dayIndex) => (
          <AccordionItem value={`item-${dayIndex + 1}`} key={dayIndex}>
            <AccordionTrigger className="flex items-start justify-start text-[16px] font-bold">
              Day {day.dayNumber}: {day.theme}
            </AccordionTrigger>

            <AccordionContent>
              {/* Timeline Activities */}
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