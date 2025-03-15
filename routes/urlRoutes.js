import express from "express";
import urlShortenLimiter from "../middlewares/rateLimiter.js";
import Url from "../models/shortUrl.js";
import { nanoid } from "nanoid";

const router = express.Router();


router.get("/", (req, res) => {
    res.send("Welcome to url shortener");
})

router.get("/:shortId", async (req, res) => {
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

router.post("/shorten", urlShortenLimiter, async (req, res) => {
    const { url } = req.body;
    console.log(url);
    if (!url) {
        return res.status(400).json({error: "URL is required"});
    }
    try {
        const shortId = nanoid(6);
        const newUrl = new Url({url, shortId})
        await newUrl.save();
        res.json({ shortUrl: `https://url-shortener-production-9b70.up.railway.app/${shortId}`});
    } catch(error) {
        res.status(500).json({error: "Server error"});
    }
})

export default router;