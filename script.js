import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// 🔑 Cole aqui seus dados do Supabase
const SUPABASE_URL = "https://ykaharechusbluyuiflb.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrYWhhcmVjaHVzYmx1eXVpZmxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2NDc3OTMsImV4cCI6MjA3MTIyMzc5M30.lhO87GXrhOg_MzqptkBITcW2nZ1Zn5HpM3BNWGHSmV8"
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

document.addEventListener('DOMContentLoaded', async function () {
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
      // Busca as reservas no banco
      let { data, error } = await supabase.from('reservas').select('*')
      if (error) {
        console.error(error)
        failureCallback(error)
      } else {
        successCallback(data)
      }
    },
    dateClick: async function (info) {
      let title = prompt('Digite o nome da reserva:')
      if (title) {
        // Salva no banco
        const { error } = await supabase.from('reservas').insert([
          { title: title, start: info.dateStr }
        ])
        if (error) {
          alert("Erro ao salvar: " + error.message)
        } else {
          alert("Reserva feita!")
          calendar.refetchEvents() // recarrega do banco
        }
      }
    }
  });
  calendar.render();
});
