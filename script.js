document.addEventListener('DOMContentLoaded', function () {
  var calendarEl = document.getElementById('calendar');
  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    selectable: true,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek'
    },
    events: [],
    dateClick: function (info) {
      let title = prompt('Digite o nome da reserva:');
      if (title) {
        calendar.addEvent({
          title: title,
          start: info.date,
          allDay: true
        });
        alert("Reserva feita!");
      }
    }
  });
  calendar.render();
});
