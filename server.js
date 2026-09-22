const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("SK Chat Server is running!");
});

app.post("/chat", (req, res) => {
  const message = req.body.message || "";

  res.json({
    reply: "तुझा प्रश्न मिळाला: " + message
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("SK Chat server running on port " + PORT);
});
