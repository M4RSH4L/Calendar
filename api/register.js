// /api/register.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Método no permitido");
  }

  try {
    const response = await fetch("https://script.google.com/macros/s/AKfycbzKZ3uuISwVorKV19uGhlqnc8I_7ARccGDcbee1de-vqX75V4HhIyDIEqMRYQFtdiDd/exec", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    const text = await response.text();
    res.status(200).send(text);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al conectar con Google Script");
  }
}
