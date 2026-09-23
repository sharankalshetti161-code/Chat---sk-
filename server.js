const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("SK Chat AI Server is running!");
});

app.post("/chat", async (req, res) => {
  try {
    const message = req.body.message || "";

    if (!message) {
      return res.json({ reply: "कृपया प्रश्न लिहा." });
    }

    const response = await fetch(
      "https://router.huggingface.co/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-120b:fastest",
          messages: [
            {
              role: "system",
              content: "You are SK Chat, a helpful AI assistant. Understand and respond naturally in the same language the user uses. Support Marathi, Hindi, English, and other languages whenever possible. If the user asks in a specific language, answer in that language."
            },
            {
              role: "user",
              content: message
            }
          ],
          max_tokens: 500
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(data);
      return res.status(500).json({
        reply: "AI कडून उत्तर मिळाले नाही."
      });
    }

    const reply =
      data.choices?.[0]?.message?.content ||
      "उत्तर मिळाले नाही.";

    res.json({ reply });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      reply: "Server मध्ये समस्या आली. पुन्हा प्रयत्न कर."
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("SK Chat AI server running on port " + PORT);
});
