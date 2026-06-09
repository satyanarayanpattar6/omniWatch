# OmniWatch // Enterprise Arbitrage & Compliance Console

An autonomous, multi-channel marketplace telemetry matrix engineered to monitor product price volatility, isolate targeted product specifications, calculate localized historical time-series pricing curves, and detect listing fraud or price gouging using distributed asynchronous scraping nodes and generative LLM models.

---

## 🏗️ Core Architectural Matrix

The platform is explicitly built to decouple high-concurrency external network scraping from client rendering loops. Instead of placing unpredictable web tasks inside the direct user response window, the system processes concurrent queries safely via event execution pipelines.

```mermaid
graph TD
    A[React Client] -->|POST Payload| B[Express API Router]
    B -->|Concurrent Execution Node| C[Promise.all Worker Engine]
    C -->|API Sub-Query| D[SerpApi: Amazon India Node]
    C -->|API Sub-Query| E[SerpApi: Google Flipkart Engine]
    B -->|Normalized Token Payload| F[OpenAI: GPT-4o-Mini Compliance Agent]
    B -->|Proportional Vector Computation| G[Deterministic Time-Series Generator]
    B -->|Unified Synchronized Entity| A