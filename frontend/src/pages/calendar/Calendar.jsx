// src/MyCalendar.js
import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; 
import axios from "axios"
import './Calendar.css'; 
import Logo from "../../assets/Logo/Logo.png";

const MyCalendar = () => {
  const [events, setEvents] = useState([]);

  const handleDateClick = (arg) => {
    const title = prompt('Enter Event Title:');
    if (title) {
      const newEvent = { id: Date.now(), title, start: arg.date, allDay: true };
      setEvents([...events, newEvent]);
    }
  };

  const handleEventClick = (info) => {
    const confirmDelete = window.confirm('Do you want to delete this event?');
    if (confirmDelete) {
      setEvents(events.filter(event => event.id !== Number(info.event.id))); // Ensure the id is a number
    }
  };

  

  return (
    <div className="calendar-main">
      <div className="calendar-title">
        <svg width="36" height="40" viewBox="0 0 36 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M28 22H18V32H28V22ZM26 0V4H10V0H6V4H4C1.79 4 0.02 5.79 0.02 8L0 36C0 38.21 1.79 40 4 40H32C34.21 40 36 38.21 36 36V8C36 5.79 34.21 4 32 4H30V0H26ZM32 36H4V14H32V36Z" fill="#6A79FF"/>
        </svg>
        EVENT TRACKER <img src={Logo} style={{ height: "40px" }} alt="Logo" />
      </div>
      <div className="calendar-container">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events.map(event => ({
            ...event,
            id: String(event.id), // Ensure the id is a string for FullCalendar
          }))}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          height="100%"
        />
      </div>
    </div>
  );
};

export default MyCalendar;
