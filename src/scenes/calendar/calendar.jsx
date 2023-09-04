import { useEffect, useState } from "react";
import FullCalendar, { formatDate } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { Box, List, ListItem, ListItemText, Typography, useTheme } from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";

const Calendar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [currentEvents, setCurrentEvents] = useState([]);

  const fetchEvents = async () => {
    const response = await fetch("http://localhost:5000/api/events");
    const data = await response.json();
    setCurrentEvents(data);
    console.log(currentEvents);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDateClick = async (selected) => {
    const title = prompt("Please enter a new title for your event");
    const description = prompt("Please enter a description for your event");
    const calendarApi = selected.view.calendar;
    calendarApi.unselect();
    console.log(selected);
    if (title) {
      const endDate = new Date(selected.endStr);
      endDate.setDate(endDate.getDate() - 1);
  
      const response = await fetch("http://localhost:5000/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          description,
          start: selected.startStr,
          end: endDate.toISOString(),
          createdBy: 1,
        })
      });
      
      fetchEvents();

      // const newEvent = await response.json();

      // calendarApi.addEvent({
      //   id: newEvent._id,
      //   title: newEvent.title,
      //   start: newEvent.date,
      //   end: selected.endStr,
      //   allDay: selected.allDay,
      // });
      
    }
  };

  const handleEventClick = async (selected) => {
    const eventId = selected.event.extendedProps._id;
    if (
      window.confirm(
        `Are you sure you want to delete the event '${selected.event.title}'`
      )
    ) {
      await fetch(`http://localhost:5000/api/events/${eventId}`, {
        method: "DELETE"
      });
      setCurrentEvents(currentEvents.filter(event => event._id !== eventId));
      selected.event.remove();
    }
  };

const handleEventDrop = async (info) => {
  const response = await fetch(`http://localhost:5000/api/events/${info.event.extendedProps._id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      start: info.event.start.toISOString(),
      end: info.event.end ? info.event.end.toISOString() : null,
    })
  });

  if (response.ok) {
    // If the server update is successful, update the local state
    setCurrentEvents(currentEvents.map(event => {
      if (event._id === info.event.extendedProps._id) {
        
        return {
          ...event,
          start: info.event.start.toISOString(),
          end: info.event.end ? info.event.end.toISOString() : null,
        };
      }
      return event;
    }));
  } else {
    console.error('Failed to update event');
  }
};


  return (
    <Box m="20px">
      <Header title="Calendar" subtitle="Full Calendar Interactive Page" />

      <Box display="flex" justifyContent="space-between">
        <Box
          flex="1 1 20%"
          backgroundColor={colors.primary[400]}
          p="15px"
          borderRadius="4px"
        >
          <Typography variant="h5">Events</Typography>
          <List>
            {currentEvents.map((event) => (
              <ListItem
                key={event._id}
                sx={{
                  backgroundColor: colors.greenAccent[500],
                  margin: "10px 0",
                  borderRadius: "2px",
                }}
              >
                <ListItemText
                  primary={event.title}
                  secondary={
                    <Typography>
                      {formatDate(event.start, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: 'numeric',
                        minute: 'numeric',
                        meridiem: 'short'
                      })}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>

        <Box flex="1 1 100%" ml="15px">
          <FullCalendar
            height="75vh"
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              listPlugin,
            ]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
            }}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            select={handleDateClick}
            eventClick={handleEventClick}
            eventDrop={handleEventDrop}
            eventResize={handleEventDrop}
            events={currentEvents}
            eventTimeFormat={{ // this will format events time in 12H format
              hour: 'numeric',
              minute: '2-digit',
              meridiem: 'short'
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Calendar;
