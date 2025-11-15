import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.OPENAI_SERCRET_KEY
});

export default client;