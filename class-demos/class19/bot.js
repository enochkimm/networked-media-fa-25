// load .env variables
import dotenv from "dotenv";
dotenv.config();

// import modern masto client (ESM)
import { createRestAPIClient } from "masto";

/*
=================================
CLASS RULES (LOCAL VERSION)
=================================
1. Follow Code of Conduct (no harmful/abusive content)
2. Minimum 1 hour posting interval (we test once locally)
3. No real-life people (block capitalised names)
4. Keep SFW + mom-friendly
5. No slurs / discrimination / -isms
6. Use non-American English (British spellings)
=================================
*/

// connect to class Mastodon server
const masto = createRestAPIClient({
    url: "https://networked-media.itp.io/",
    accessToken: process.env.TOKEN
});

// rule 5 — block harmful categories (placeholder-only list)
const BLOCKED_TERMS = [
    "slur_placeholder",
    "discrimination_placeholder",
    "racism_placeholder",
    "sexism_placeholder",
    "ableism_placeholder",
    "ageism_placeholder",
    "classism_placeholder",
    "colourism_placeholder",
    "nationalism_placeholder",
    "xenophobia_placeholder",
    "homophobia_placeholder",
    "transphobia_placeholder"
];

// rule 6 — British-English safe content
const SAFE_BRITISH_POSTS = [
    "What a lovely colour the afternoon sky hath to-day.",
    "My favourite quiet moment is enjoying a gentle breeze.",
    "A marvellous sense of calm accompanies my evening stroll.",
    "I’m organising my thoughts into a pleasant little programme.",
    "The theatre of my imagination feels especially serene to-day.",
    "A curious flavour lingers in the cool morning air.",
    "The neighbourhood is rather peaceful this fine evening.",
    "The splendour of to-day’s soft light is delightful."
];

// safety check (rules 1, 3, 4, 5)
function isSafe(text) {
    const lower = text.toLowerCase();

    // rule 5 — blocked categories
    for (const term of BLOCKED_TERMS) {
        if (lower.includes(term)) return false;
    }

    // rule 3 — block real names (capitalised)
    if (/\b[A-Z][a-z]+\b/.test(text)) return false;

    return true;
}

// generate rule-friendly text
function generatePost() {
    let phrase = SAFE_BRITISH_POSTS[
        Math.floor(Math.random() * SAFE_BRITISH_POSTS.length)
    ];

    if (!isSafe(phrase)) {
        return "What a charming and gentle day it is to-day.";
    }

    return phrase;
}

// send post to mastodon
async function makeStatus(text) {
    try {
        const status = await masto.v1.statuses.create({
            status: text,
            visibility: "public"
        });

        console.log("Posted:", status.url);

    } catch (err) {
        console.error("Error posting:", err);
    }
}

// run once locally
(async function testLocal() {
    console.log("Running local test…");
    const text = generatePost();
    await makeStatus(text);
})();