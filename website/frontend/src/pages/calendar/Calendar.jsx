import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
import "./Calendar.css";
import Logo from "../../assets/Logo/Logo.png";
import CFLogo from "../../assets/Logo/Codeforces.png";
import leetcodeImg from "../../assets/Images/leetcodeLogo.png";
import { DeleteModal } from "../../components/modals/Delete Modal/DeleteModal";
import RING from "vanta/src/vanta.rings";

const MyCalendar = () => {
  const [events, setEvents] = useState([]);
  const [open, setOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  useEffect(() => {
    RING({
      el: "#vant",
      backgroundColor: 0x0,
      touchControls: true,
    });
  }, []);

  useEffect(() => {
    const fetchCFContests = async () => {
      try {
        const response = await axios.get(
          "https://codeforces.com/api/contest.list"
        );
        const CFcontests = response.data.result;

        CFcontests.forEach((contest) => {
          if (
            contest.phase === "BEFORE" ||
            contest.phase === "CODING" ||
            contest.phase === "FINISHED"
          ) {
            const futureDate = new Date(contest.startTimeSeconds * 1000);
            const newEvent = {
              id: contest.id,
              title: contest.name,
              start: futureDate.toISOString(),
              allDay: true,
              source: "codeforces",
            };
            setEvents((prevEvents) => [...prevEvents, newEvent]);
          }
        });
      } catch (error) {
        console.error("Error fetching Codeforces contests:", error);
      }
    };

    const fetchLeetCodeContests = async () => {
      try {
        const response = await axios.get(
          "https://competeapi.vercel.app/contests/leetcode/"
        );
        const leetcodeContests = response.data.data.topTwoContests;

        leetcodeContests.forEach((contest) => {
          const futureDate = new Date(contest.startTime * 1000);
          const newEvent = {
            id: contest.title,
            title: contest.title,
            start: futureDate.toISOString(),
            allDay: true,
            source: "leetcode",
            url: contest.cardImg || "",
          };
          setEvents((prevEvents) => [...prevEvents, newEvent]);
        });
      } catch (error) {
        console.error("Error fetching LeetCode contests:", error);
      }
    };

    fetchCFContests();
    fetchLeetCodeContests();
  }, []);

  const handleDateClick = (arg) => {
    const title = prompt("Enter Event Title:");
    if (title) {
      const newEvent = {
        id: `manual-${Date.now()}`,
        title,
        start: arg.dateStr,
        allDay: true,
        source: "manual",
      };
      setEvents((prevEvents) => [...prevEvents, newEvent]);
    }
  };

  const handleEventClick = (info) => {
    if (info.event.extendedProps.source === "manual") {
      setEventToDelete(info.event); // Set the event to delete
      setOpen(true); // Open the modal for deletion
    } else if (info.event.extendedProps.source === "codeforces") {
      const contestId = info.event.id;
      const contestUrl = `https://codeforces.com/contests/${contestId}`;
      window.open(contestUrl, "_blank");
    } else if (info.event.extendedProps.source === "leetcode") {
      const title = info.event.title.replace(/\s+/g, "-").toLowerCase();
      const contestUrl = `https://leetcode.com/contest/${title}`;
      window.open(contestUrl, "_blank");
    }
  };

  const handleDelete = () => {
    if (eventToDelete) {
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== eventToDelete.id)
      );
      setOpen(false);
      setEventToDelete(null);
    }
  };

  const eventContent = (eventInfo) => {
    const { source, url } = eventInfo.event.extendedProps;
    const isCodeforcesEvent = source === "codeforces";
    const isLeetCodeEvent = source === "leetcode";

    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "5px",
          backgroundColor: isCodeforcesEvent
            ? "#f5f5dc"
            : isLeetCodeEvent
            ? "gray"
            : "",
          borderRadius: "5px",
          border: isCodeforcesEvent ? "1px solid #ccc" : "none",
          cursor: "pointer",
        }}
      >
        {isCodeforcesEvent && (
          <img
            src={CFLogo}
            alt="Codeforces Logo"
            style={{ width: "20px", height: "20px", marginRight: "5px" }}
          />
        )}
        {isLeetCodeEvent && (
          <img
            src={url || leetcodeImg}
            alt="LeetCode Contest"
            style={{ width: "20px", height: "20px", marginRight: "5px" }}
          />
        )}
        <span>{eventInfo.event.title}</span>
      </div>
    );
  };

  return (
    <div className="calendar-main" id="vant">
      <div className="calendar-title">
        <svg
          width="36"
          height="40"
          viewBox="0 0 36 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M28 22H18V32H28V22ZM26 0V4H10V0H6V4H4C1.79 4 0.02 5.79 0.02 8L0 36C0 38.21 1.79 40 4 40H32C34.21 40 36 38.21 36 36V8C36 5.79 34.21 4 32 4H30V0H26ZM32 36H4V14H32V36Z"
            fill="#6A79FF"
          />
        </svg>
        EVENT TRACKER <img src={Logo} style={{ height: "40px" }} alt="Logo" />
      </div>
      <div className="calendar-container">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          eventContent={eventContent}
          headerToolbar={{
            right: "prev,next today",
          }}
          height="100%"
        />
      </div>
      <DeleteModal
        open={open}
        onClose={() => setOpen(false)}
        onDelete={handleDelete}
        eventTitle={eventToDelete ? eventToDelete.title : ""}
      />
    </div>
  );
};

export default MyCalendar;
