import cron from "node-cron";
import { checkPaymentStatus } from "./controllers/auth.controller.js"; // Importa la función que debe ejecutarse

const checkPayments = () => {
    cron.schedule("0 * * * *", async () => {
        await checkPaymentStatus();
        console.log("Revisando pagos");
    });
}

export default checkPayments;