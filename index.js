import express from "express";
import Url from "./models/shortUrl.js";
import mongoose from "mongoose";
import { nanoid } from "nanoid";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));


app.get("/", (req, res) => {
    res.send("Welcome to url shortener");
})


app.get("/:shortId", async (req, res) => {
    const { shortId } = req.params;
  
    try {
      const urlEntry = await Url.findOne({ shortId });
  
      if (urlEntry) {
        urlEntry.clicks += 1; // Increment click count
        await urlEntry.save();
  
        return res.redirect(urlEntry.url); // Redirect to original URL
      } else {
        return res.status(404).json({ error: "❌ Short URL not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "❌ Server error" });
    }
});

app.post("/shorten", async (req, res) => {
    const { url } = req.body;
    console.log(url);
    if (!url) {
        return res.status(400).json({error: "URL is required"});
    }
    try {
        const shortId = nanoid(6);
        const newUrl = new Url({url, shortId})
        await newUrl.save();
        res.json({ shortUrl: `http://localhost:${PORT}/${shortId}`});
    } catch(error) {
        res.status(500).json({error: "Server error"});
    }
})


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})