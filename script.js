// 🔑 Configuração do Supabase
const SUPABASE_URL = "https://ykaharechusbluyuiflb.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrYWhhcmVjaHVzYmx1eXVpZmxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2NDc3OTMsImV4cCI6MjA3MTIyMzc5M30.lhO87GXrhOg_MzqptkBITcW2nZ1Zn5HpM3BNWGHSmV8";

// Criar cliente Supabase via CDN
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener('DOMContentLoaded', function () {
  const calendarEl = document.getElementById('calendar');

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    selectable: true,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek'
    },
    events: async function(info, successCallback, failureCallback) {
      try {
        // Busca todos os registros no Supabase
        let { data, error } = await supabase.from('reservas').select('*');
        if (error) {
          console.error(error);
          failureCallback(error);
          return;
        }

        // Mapeia para FullCalendar
        const events = data.map(item => ({
          id: item.id,
          title: item.title,             // o que será exibido
          start: item.start             // precisa ser YYYY-MM-DD ou ISO
        }));

        successCallback(events);

      } catch (err) {
        console.error(err);
        failureCallback(err);
      }
    },
    dateClick: async function(info) {
      let texto = prompt('Digite hora e nome da reserva (ex: 08:45 - Evandro):');
      if (texto) {
        try {
          const { error } = await supabase.from('reservas').insert([
            {
              title: texto,
              start: info.dateStr        // salva a data do dia clicado
            }
          ]);
          if (error) {
            alert("Erro ao salvar: " + error.message);
          } else {
            calendar.refetchEvents(); // recarrega os eventos do banco
          }
        } catch (err) {
          alert("Erro ao salvar: " + err.message);
        }
      }
    },
    eventContent: function(arg) {
      return { html: `<div style="font-size:12px; color:#ffffff; background-color:#007bff; border-radius:4px; padding:2px;">${arg.event.title}</div>` };
    }
  });

  calendar.render();
});
