'use client';

import React from 'react';
import { Button } from '@/app/components/ui/button';
import type { DateSection, TimeSlot } from '@/hooks/features/reservation/useReservationDateSelection';

interface TimeSlotListProps {
  dateSections: DateSection[];
  isSlotAvailable: (slot: TimeSlot) => boolean;
  onSelectSlot: (slot: TimeSlot) => void;
}

/**
 * Component to display a list of time slots grouped by date
 */
export const TimeSlotList: React.FC<TimeSlotListProps> = ({
  dateSections,
  isSlotAvailable,
  onSelectSlot
}) => {
  return (
    <div className="space-y-8">
      {dateSections.map((section, sectionIndex) => (
        <div key={sectionIndex}>
          <h3 className="text-lg font-bold mb-4">
            {section.date} ({section.day})
          </h3>
          <div className="space-y-2">
            {section.timeSlots.map((slot: TimeSlot, slotIndex: number) => {
              const remainingCapacity = slot.remainingCapacityView?.remainingCapacity || 0;
              const isFull = remainingCapacity === 0;
              const isAvailable = isSlotAvailable(slot);

              return (
                <div
                  key={slotIndex}
                  className={`rounded-xl border p-4 ${isFull ? "bg-gray-50" : "bg-white"}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-lg font-bold ${isFull ? "text-gray-300" : ""}`}>
                        {slot.time}
                      </p>
                      <p className={`text-md font-bold ${isFull ? "text-gray-300" : ""}`}>
                        {slot.price.toLocaleString()}円/人
                      </p>
                    </div>
                    {isFull ? (
                      <div className="text-gray-300 bg-gray-50 px-8 py-3 rounded-full">満員</div>
                    ) : (
                      <div className="flex flex-col items-end gap-1">
                        {remainingCapacity <= 3 && remainingCapacity > 0 && (
                          <span className="text-xs text-blue-600">
                            定員まで残り{remainingCapacity}名
                          </span>
                        )}
                        <Button
                          variant="primary"
                          className="rounded-full px-8 py-3"
                          onClick={() => onSelectSlot(slot)}
                          disabled={!isAvailable}
                        >
                          選択
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TimeSlotList;
