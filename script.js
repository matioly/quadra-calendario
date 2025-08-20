// 🔑 Configuração do Supabase
const SUPABASE_URL = "https://ykaharechusbluyuiflb.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrYWhhcmVjaHVzYmx1eXVpZmxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2NDc3OTMsImV4cCI6MjA3MTIyMzc5M30.lhO87GXrhOg_MzqptkBITcW2nZ1Zn5HpM3BNWGHSmV8";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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

    // 🔹 Buscar eventos do Supabase
    events: async function (info, successCallback, failureCallback) {
      try {
        let { data, error } = await supabase.from('reservas').select('*');
        if (error) {
          console.error(error);
          failureCallback(error);
        } else {
          const events = data.map(item => ({
            id: item.id,
            title: item.title,
            start: item.start,  // já vem YYYY-MM-DD
            allDay: true        // 👈 força ser evento de dia inteiro
          }));
          console.log("Eventos carregados:", events);
          successCallback(events);
        }
      } catch (err) {
        console.error(err);
        failureCallback(err);
      }
    },

    // 🔹 Clique em uma data para salvar no Supabase
    dateClick: async function (info) {
      let title = prompt('Digite o nome da reserva:');
      if (title) {
        try {
          const { error } = await supabase.from('reservas').insert([
            { title: title, start: info.dateStr } // YYYY-MM-DD
          ]);
          if (error) {
            alert("Erro ao salvar: " + error.message);
          } else {
            alert("Reserva feita!");
            calendar.refetchEvents();
          }
        } catch (err) {
          alert("Erro ao salvar: " + err.message);
        }
      }
    },

    // 🔹 Exibir todos os eventos no quadrado do dia
    eventContent: function(arg) {
      return {
        html: `<div style="
          font-size:11px;
          color:#fff;
          background:#007bff;
          border-radius:4px;
          margin:1px 0;
          padding:1px 3px;
          white-space:nowrap;
          overflow:hidden;
          text-overflow:ellipsis;">
            ${arg.event.title}
          </div>`
      };
    }
  });

  calendar.render();
});
