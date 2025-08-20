// script.js
const { createClient } = supabase;
const supabaseUrl = "https://SEU-PROJETO.supabase.co";
const supabaseKey = "SEU-ANON-KEY";
const supabaseClient = createClient(supabaseUrl, supabaseKey);

document.addEventListener("DOMContentLoaded", async function () {
  const calendarEl = document.getElementById("calendar");

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    selectable: true,
    locale: "pt-br",

    // carregar os eventos do banco
    events: async function (info, successCallback, failureCallback) {
      try {
        let { data, error } = await supabaseClient
          .from("reservas")
          .select("id, title, start");

        if (error) throw error;

        // converter os dados para o formato que o FullCalendar entende
        const eventos = data.map(evento => ({
          id: evento.id,
          title: evento.title,
          start: evento.start  // já está em formato DATE
        }));

        successCallback(eventos);
      } catch (err) {
        console.error("Erro ao carregar eventos:", err.message);
        failureCallback(err);
      }
    },

    // ao clicar em um dia
    dateClick: async function (info) {
      const title = prompt("Digite o nome da reserva:");
      if (title) {
        try {
          let { data, error } = await supabaseClient
            .from("reservas")
            .insert([{ title, start: info.dateStr }])
            .select();

          if (error) throw error;

          // adicionar no calendário sem precisar recarregar
          calendar.addEvent({
            id: data[0].id,
            title: data[0].title,
            start: data[0].start
          });

          alert("Reserva salva!");
        } catch (err) {
          console.error("Erro ao salvar:", err.message);
          alert("Erro ao salvar reserva");
        }
      }
    }
  });

  calendar.render();
});
