import { Calendar } from "lucide-react";
import { SECTION_TITLES, FIELD_LABELS, DATE_FORMAT_OPTIONS, TIME_FORMAT_OPTIONS } from "./constants";

/**
 * Props for BookingScheduleInfo component
 */
interface BookingScheduleInfoProps {
  startTime: string;
  durationHours: number;
}

/**
 * Component to display booking schedule information
 * Shows date, start/end time, and duration
 */
export function BookingScheduleInfo({ startTime, durationHours }: BookingScheduleInfoProps) {
  const startDate = new Date(startTime);
  const endDate = new Date(startDate.getTime() + durationHours * 60 * 60 * 1000);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Calendar className="h-5 w-5" />
        {SECTION_TITLES.schedule}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{FIELD_LABELS.date}</p>
          <p className="font-medium">
            {startDate.toLocaleDateString('en-US', DATE_FORMAT_OPTIONS)}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{FIELD_LABELS.time}</p>
          <p className="font-medium">
            {startDate.toLocaleTimeString('en-US', TIME_FORMAT_OPTIONS)} - {endDate.toLocaleTimeString('en-US', TIME_FORMAT_OPTIONS)}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{FIELD_LABELS.duration}</p>
          <p className="font-medium">{durationHours} {FIELD_LABELS.hours}</p>
        </div>
      </div>
    </div>
  );
}

