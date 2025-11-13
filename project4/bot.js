import dotenv from "dotenv";
dotenv.config();

import { createRestAPIClient } from "masto";

// mastodon client
const masto = createRestAPIClient({
  url: "https://networked-media.itp.io/",
  accessToken: process.env.TOKEN,
});

const DROPLET_IP = "http://67.207.84.10:7001/all-posts";

// pull one random db item
async function retrieveData() {
  try {
    const res = await fetch(DROPLET_IP);
    const json = await res.json();
    const posts = json.posts;

    if (!posts || posts.length === 0) {
      console.log("no posts found");
      return;
    }

    const rand = Math.floor(Math.random() * posts.length);
    const randText = posts[rand].text;

    console.log("posting:", randText);
    makeStatus(randText);
  } catch (err) {
    console.log("error retrieving data:", err);
  }
}

// post to mastodon
async function makeStatus(text) {
  try {
    const status = await masto.v1.statuses.create({
      status: text,
      visibility: "public",
    });
    console.log("posted:", status.url);
  } catch (err) {
    console.log("error posting:", err);
  }
}

// run immediately + hourly
retrieveData();
setInterval(retrieveData, 60 * 60 * 1000);