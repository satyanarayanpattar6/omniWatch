import { getJson } from "serpapi";
import { evaluateMarketSafety } from "../services/evaluatorService.js";

// 1. In-Memory State Cache Engine
let localInventoryState = {
  lastUpdated: null,
  products: {}
};

// 2. High-Throughput Engine Execution Node
export async function runAutonomousScrape(targetItemsArray) {
  console.log(`[Worker Engine] Beginning scheduled query cycle for ${targetItemsArray.length} items...`);
  
  const updatedProducts = {};
  const apiKey = (process.env.SERPAPI_API_KEY || "").trim();

  if (!apiKey) {
    console.error("[Worker Error] Extraction aborted: SERPAPI_API_KEY is missing from environment variables.");
    return;
  }

  // 3. Concurrent Multi-Engine Batch Execution Loop
  const scrapingPromises = targetItemsArray.map(async (item) => {
    try {
      // Execute Amazon direct engine parsing
      const amazonResponse = await getJson({
        engine: "amazon",
        amazon_domain: "amazon.in",
        k: item,
        api_key: apiKey,
      });

      // Execute standard Google core engine search targeted at Flipkart
      const flipkartResponse = await getJson({
        engine: "google",
        q: `${item} site:flipkart.com`,
        location: "India",
        hl: "en",
        gl: "in",
        api_key: apiKey,
      });

      const amzResults = amazonResponse.organic_results || [];
      const fkResults = flipkartResponse.organic_results || [];

      // 4. Structuring normalized data entities defensively
      updatedProducts[item] = {
        amazon: amzResults.slice(0, 1).map(r => ({
          title: r.title || "Unknown Listing",
          price: r.price || "N/A",
          image: r.thumbnail || ""
        }))[0] || null,

        flipkart: fkResults.slice(0, 1).map(r => ({
          title: r.title || "Unknown Listing",
          snippet: r.snippet || "No data provided.",
          image: r.thumbnail || ""
        }))[0] || null
      };

        const amzAndFkSpecs = {
        amazon: amzResults.slice(0, 1).map(r => ({ title: r.title, price: r.price, image: r.thumbnail }))[0] || null,
        flipkart: fkResults.slice(0, 1).map(r => ({ title: r.title, snippet: r.snippet, image: r.thumbnail }))[0] || null
        };

        // 🚀 RUN THE EVALUATOR: Add the AI analysis verdict string to our state object
        const aiVerdict = await evaluateMarketSafety(item, amzAndFkSpecs);

        updatedProducts[item] = {
        ...amzAndFkSpecs,
        verdict: aiVerdict // Clean, fraud-checked commentary stored right in RAM
        };


    } catch (innerError) {
      console.error(`[Worker Exception] Failed compiling data vectors for product: ${item}`, innerError.message);
      // Fail-Safe: Retain old data matrix if current API fetch crashes
      updatedProducts[item] = localInventoryState.products[item] || null;
    }
  });

  // Wait until all concurrent network resolutions finish processing
  await Promise.all(scrapingPromises);

  // Commit updated states to memory securely
  localInventoryState = {
    lastUpdated: new Date(),
    products: updatedProducts
  };

  console.log("[Worker Engine] Scheduled query synchronization cycle successfully completed.");
}

// 5. Clean Memory State Getter
export function getLatestInventoryState() {
  return localInventoryState;
}