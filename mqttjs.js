import mqtt from "mqtt";
import fetch from "node-fetch";
import express from "express";

// 🔑 Identifiants (à mettre en variables d'environnement sur Render)
const hivemqUser = process.env.HIVEMQ_USER;
const hivemqPass = process.env.HIVEMQ_PASS;
const influxToken = process.env.INFLUX_TOKEN;
const influxOrg = process.env.INFLUX_ORG;
const influxBucket = "solarwind_data";

// URL InfluxDB
const influxURL = `https://us-west-2-1.aws.cloud2.influxdata.com/api/v2/write?org=${influxOrg}&bucket=${influxBucket}&precision=s`;

// Fonction principale MQTT
function startMQTT() {
  const client = mqtt.connect("mqtts://broker.hivemq.com:8883", {
    username: hivemqUser,
    password: hivemqPass
  });

  client.on("connect", () => {
    console.log("✅ MQTT connecté");
    client.subscribe("solarwind/#");
  });

  client.on("message", async (topic, message) => {
    const value = parseFloat(message.toString());
    console.log(`📡 ${topic}: ${value}`);

    try {
      await fetch(influxURL, {
        method: "POST",
        headers: {
          "Authorization": `Token ${influxToken}`,
          "Content-Type": "text/plain"
        },
        body: `mqtt_value value=${value}`
      });
    } catch (err) {
      console.error("⚠️ Erreur InfluxDB:", err.message);
    }
  });

  client.on("error", (err) => {
    console.error("⚠️ Erreur MQTT:", err.message);
    console.log("🔁 Reconnexion dans 5s...");
    setTimeout(startMQTT, 5000);
  });

  client.on("close", () => {
    console.log("🔌 Connexion MQTT fermée, reconnexion dans 5s...");
    setTimeout(startMQTT, 5000);
  });
}

// Lancer MQTT
startMQTT();

// 🌍 Petit serveur Express pour keep-alive
const app = express();
app.get("/", (req, res) => res.send("OK - Service actif 🚀"));
app.listen(3000, () => console.log("🌍 Keep-alive actif sur port 3000"));

// ⏱ Heartbeat toutes les minutes
setInterval(() => {
  console.log("⏱ Service actif...");
}, 60000);
