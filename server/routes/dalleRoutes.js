import * as dotenv from "dotenv";
import express from "express";
import fetch from "node-fetch";

dotenv.config();
const router = express.Router();

router.route("/").get((req, res) => {
  res.status(200).json({ message: "Hello from Stability AI!" });
});

router.route("/").post(async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await fetch(
      "https://api.stability.ai/v1/generation/stable-diffusion-v1-6/text-to-image",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.STABILITY_API_KEY}`
        },
        body: JSON.stringify({
          text_prompts: [
            {
              text: prompt,
              weight: 1
            }
          ],
          cfg_scale: 7,
          height: 1024,
          width: 1024,
          samples: 1,
          steps: 30
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Stability AI API error: ${response.statusText}`);
    }

    const responseData = await response.json();
    const base64Image = responseData.artifacts[0].base64;

    res.status(200).json({ photo: base64Image });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send(error?.message || "Something went wrong");
  }
});

export default router;
