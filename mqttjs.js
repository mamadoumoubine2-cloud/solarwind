import mqtt from "mqtt";
import fetch from "node-fetch";

const client = mqtt.connect("mqtts://broker.hivemq.com", {
  username: "esp_32_solarwind",
  password: "M1o2u3b4i5n6e7."
});

client.on("connect", () => {
  console.log("MQTT connecté");
  client.subscribe("solarwind/#");
});

client.on("message", async (topic, message) => {
  const value = parseFloat(message.toString());
  await fetch("https://us-west-2-1.aws.cloud2.influxdata.com/api/v2/write?org=solarwind&bucket=solarwind_data&precision=s", {
    method: "POST",
    headers: {
      "Authorization": "FN-jjOdZWhMBKAegRcOfZaADNd20IapxNVVeqN4RduZT0I6VehAhyWhOXpoC3fcpqZl2On5fQcZUjH4nS3VD_w==",
      "Content-Type": "text/plain"
    },
    body: `mqtt_value value=${value}`
  });
});
