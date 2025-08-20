// 🔑 Configuração do Supabase
const SUPABASE_URL = "https://ykaharechusbluyuiflb.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrYWhhcmVjaHVzYmx1eXVpZmxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2NDc3OTMsImV4cCI6MjA3MTIyMzc5M30.lhO87GXrhOg_MzqptkBITcW2nZ1Zn5HpM3BNWGHSmV8";

// Criar cliente Supabase via CDN
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
    events: async function (info, successCallback, failureCallback) {
      try {
        let { data, error } = await supabase.from('reservas').select('*');
        if (error) {
          console.error(error);
          failureCallback(error);
        } else {
          // Converte start para Date, garantindo que o FullCalendar exiba corretamente
          const events = data.map(item => ({
            id: item.id,
            title: item.title,
            start: new Date(item.start)
          }));
          console.log("Eventos carregados do Supabase:", events);
          successCallback(events);
        }
      } catch (err) {
        console.error(err);
        failureCallback(err);
      }
    },
    dateClick: async function (info) {
      let title = prompt('Digite o nome da reserva:');
      if (title) {
        try {
          const { error } = await supabase.from('reservas').insert([
            { title: title, start: info.dateStr }
          ]);
          if (error) {
            alert("Erro ao salvar: " + error.message);
          } else {
            alert("Reserva feita!");
            calendar.refetchEvents(); // Recarrega do banco
          }
        } catch (err) {
          alert("Erro ao salvar: " + err.message);
        }
      }
    },
    eventContent: function(arg) {
      // Personaliza o conteúdo dentro do quadrado do dia
      return { html: `<div style="font-size:12px; color:#ffffff; background-color:#007bff; border-radius:4px; padding:2px;">${arg.event.title}</div>` };
    }
  });

  calendar.render();
});
