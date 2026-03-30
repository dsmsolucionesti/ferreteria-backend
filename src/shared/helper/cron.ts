import cron from "node-cron";
import { pool } from "../../config/database";
import { CotizacionService } from "../../features/cotizacion/services/cotizacion.service";
import { CotizacionRepository } from "../../features/cotizacion/infrastructure/cotizacion.repository";

let cronTask: any = null;
let ultimaExpresion: string | null = null;

const cotizacionService = new CotizacionService(new CotizacionRepository());

async function cargarCron() {
  try {
    const result = await pool.query(`
      SELECT valor 
      FROM configuracion 
      WHERE codigo = 'CRON_COTIZACIONES'
      LIMIT 1
    `);

    const expresion = result.rows[0]?.valor;

    if (!expresion) {
      console.log("⚠️ No hay configuración de cron");
      return;
    }

    // 🔥 validar expresión
    if (!cron.validate(expresion)) {
      console.log("❌ Expresión cron inválida:", expresion);
      return;
    }

    // 🔥 evitar recrear si no cambió
    if (expresion === ultimaExpresion) {
      return;
    }

    console.log("🕒 Nueva configuración de cron:", expresion);

    // 🔥 detener cron anterior
    if (cronTask) {
      cronTask.stop();
      console.log("🛑 Cron anterior detenido");
    }

    // 🔥 crear nuevo cron
    cronTask = cron.schedule(
      expresion,
      async () => {
        console.log("⏳ Ejecutando cron dinámico...");

        try {
          const resp = await cotizacionService.vencerCotizaciones();
          console.log("✅ Resultado:", resp);
        } catch (error) {
          console.error("❌ Error ejecutando cron:", error);
        }
      },
      {
        timezone: "America/Santiago",
      },
    );

    ultimaExpresion = expresion;
  } catch (error) {
    console.error("❌ Error cargando cron:", error);
  }
}

// 🚀 Ejecutar al iniciar
(async () => {
  console.log("🚀 Inicializando cron dinámico...");
  await cargarCron();

  // 🔥 Ejecutar una vez al iniciar (muy recomendado)
  console.log("⚡ Ejecutando validación inicial...");
  await cotizacionService.vencerCotizaciones();
})();

// 🔄 Revisar cambios cada 1 minuto
setInterval(async () => {
  await cargarCron();
}, 60000);
