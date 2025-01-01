import React, { useState, useEffect, useContext } from "react";
import { CompanyContext } from "../CompanyContext"; // Ensure this context is properly set up
import "../../styles/CalendarView.css"; // Reference your CSS for styling

const CalendarView = () => {
  const { companies } = useContext(CompanyContext);
  const [selectedDate, setSelectedDate] = useState(null); // Currently selected date
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);

  // Format date to YYYY-MM-DD
  const formatDate = (date) => date.toISOString().split("T")[0];

  // Generate the calendar grid for the current month
  const generateCalendarWithScheduledCommunications = (date) => {
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const startDay = startOfMonth.getDay(); // Weekday index (0-6)
    const totalDays = endOfMonth.getDate(); // Total days in the month

    const days = Array.from({ length: startDay }, () => null).concat(
      Array.from({ length: totalDays }, (_, i) => i + 1)
    );

    setCalendarDays(days);
  };

  // Change month
  const handleMonthChange = (increment) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + increment);
    setCurrentDate(newDate);
  };

  // Fetch communications for a specific day
  const getCommunicationsForDay = (day) => {
    const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);

    if (!companies || companies.length === 0) {
      return [];
    }

    return companies.flatMap((company) => {
      return (
        company.communications?.filter(
          (comm) =>
            comm &&
            comm.date &&
            new Date(comm.date).toLocaleDateString() === targetDate.toLocaleDateString()
        ).map((comm) => ({
          ...comm,
          companyName: company.name, // Add company name to communication
        })) || []
      );
    });
  };

  // Fetch next scheduled communications
  const getNextScheduledCommunications = (day) => {
    const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);

    if (!companies || companies.length === 0) {
      return [];
    }

    return companies.flatMap((company) => {
      return (
        company.communications?.filter(
          (comm) =>
            comm &&
            comm.nextCommunication &&
            comm.nextCommunication.date &&
            new Date(comm.nextCommunication.date).toLocaleDateString() ===
              targetDate.toLocaleDateString()
        ).map((comm) => ({
          ...comm,
          companyName: company.name, // Add company name to next communication
        })) || []
      );
    });
  };

  // Recalculate calendar when the current month changes
  useEffect(() => {
    generateCalendarWithScheduledCommunications(currentDate);
  }, [currentDate]);

  return (
    <div className="calendar-view">
      <div className="calendar-controls">
        <button onClick={() => handleMonthChange(-1)}>Previous</button>
        <span>{currentDate.toLocaleString("default", { month: "long", year: "numeric" })}</span>
        <button onClick={() => handleMonthChange(1)}>Next</button>
      </div>

      <div className="calendar-grid">
        {calendarDays.map((day, index) => (
          <div
            key={index}
            className={`calendar-day ${day ? "active" : ""} ${
              selectedDate && day === selectedDate.getDate() ? "selected" : ""
            }`}
            onClick={() =>
              setSelectedDate(
                day ? new Date(currentDate.getFullYear(), currentDate.getMonth(), day) : null
              )
            }
          >
            {day && (
              <>
                <span>{day}</span>
                <div className="day-communications">
                  {/* Display last communications */}
                  {getCommunicationsForDay(day).map((comm, idx) => (
                    <div key={`last-${idx}`} className="communication-item">
                      <span>
                        {comm.companyName} - {comm.type}
                      </span>
                    </div>
                  ))}

                  {/* Display next scheduled communications */}
                  {getNextScheduledCommunications(day).map((comm, idx) => (
                    <div key={`next-${idx}`} className="communication-item next-scheduled">
                      <span>
                        {comm.companyName} - Next: {comm.nextCommunication.type}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarView;
