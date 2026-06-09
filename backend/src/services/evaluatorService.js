import { OpenAI } from 'openai';

// Initialize the OpenAI instance defensively
const openai = new OpenAI({
  apiKey: (process.env.OPENAI_API_KEY || "").trim()
});

/**
 * Evaluates live marketplace text data vectors for potential fraud or price gouging.
 * @param {string} productName - The item being verified
 * @param {Object} scrapedData - Clean extracted data from our local memory worker
 */

export async function evaluateMarketSafety(productName, scrapedData) {
  const apiKey = (process.env.OPENAI_API_KEY || "").trim();
  
  // Fail-Safe: If no OpenAI key is configured, bypass analysis gracefully without crashing
  if (!apiKey) {
    console.warn("[Evaluator Warning] Skipping AI safety audit: OPENAI_API_KEY is unconfigured.");
    return "Market analysis temporarily unavailable (System Offline).";
  }

  try {
    // 1. Construct an ultra-clean, low-token data payload for the LLM
    const marketContextString = `
      Product: ${productName}
      Amazon Listing: ${scrapedData.amazon ? `${scrapedData.amazon.title} - Price: ${scrapedData.amazon.price}` : 'N/A'}
      Flipkart Listing: ${scrapedData.flipkart ? `${scrapedData.flipkart.title} - Snippet: ${scrapedData.flipkart.snippet}` : 'N/A'}
    `;

    // 2. High-Precision System Prompt
    const systemInstruction = `You are an enterprise e-commerce risk-compliance engine. 
    Analyze the provided marketplace snapshots for:
    1. Scam Detection (e.g., selling an accessory like a "case only" at full phone price).
    2. Price Gouging or extreme artificial manipulation.
     Provide a concise, 2-sentence structural verdict warning the user of risks or confirming the listings look legitimate. Do not use markdown styling.`;

    // 3. Execution using a low temperature for predictable, non-hallucinated results
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Senior Tip: Using a mini model keeps costs down and execution speeds high
      messages: [
        { role: 'system', content: systemInstruction },
        { role: 'user', content: `Analyze this current market snapshot:\n${marketContextString}` }
      ],
      temperature: 0.1, 
      max_tokens: 150
    });

    return completion.choices[0].message.content.trim();

  } catch (error) {
    console.error(`[Evaluator Error] AI analysis failed for ${productName}:`, error.message);
    return "Failed to compile automated fraud risk matrix. Cross-verify links manually.";
  }
}