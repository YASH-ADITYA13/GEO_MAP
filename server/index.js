const express = require("express");
const cors = require("cors");

require("dotenv").config();

const PORT = process.env.PORT || 3000;

// init express
const app = express();

// use cors
app.use(cors());

// routes
app.use("/api/search/", require("./routes/searchResults.js"));

app.listen(PORT, () => console.log(`app has started on port: ${PORT}`));
