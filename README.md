# Multilingual Translation API Testing & Analysis

I tested a multilingual translation API to investigate how consistently it responds to identical requests across English, Spanish, and French.

The project began with exploratory API testing in Postman and expanded into an automated experiment using Playwright and TypeScript. I sent 400 translation requests (100 per language pair), collected the responses as structured data, and analyzed output variation and API latency with Pandas and Matplotlib.

## Experiment Design

- 4 language pairs: EN → ES, ES → EN, EN → FR, FR → EN
- 10 source inputs per language pair
- 10 identical requests per input
- 400 total API requests
- Automated with Playwright + TypeScript
- Analyzed with Pandas
- Visualized with Matplotlib

## Key Findings

### 1. Most translations were stable, but not all

8 of 40 translation scenarios (20%) produced more than one unique translation across 10 identical requests.

<img width="1887" height="1408" alt="image" src="https://github.com/user-attachments/assets/807f7922-e771-44cc-9b02-20a374384819" />

EN → ES was stable across all 10 tested inputs, while variation appeared in the other three language directions.

### 2. Not all variation had the same impact

Observed differences ranged from harmless wording changes to changes affecting the source information.

Examples included:

- Stylistic variation: equivalent ways of expressing a time, i.e., 7:30 PM / 7:30 in the evening
- Register variation: formal vs. informal French, in this case *Peux-tu m'aider avec ce problème* vs. *Pouvez-vous m'aider avec ce problème*
- Orthographic variation: `María` → `Maria` (in the first case, the "í" carries a diacritic; in the second, it does not)
- Semantic variation: `12.5 kilograms` → `27.5 pounds`
- Functional failure: a valid translation request returned an unsupported-language message instead of a translation (a QA question!)

This demonstrates why exact-string assertions can be brittle when testing nondeterministic language systems, and why simply accepting any variation can be equally dangerous.

### 3. HTTP success did not guarantee translation success

All 400 automated requests returned HTTP 200.

However, successful HTTP responses did not necessarily mean the translation itself was correct. Translation quality and preservation of source information therefore require validation beyond the response status.

### 4. Typical latency was similar across language pairs

<img width="1000" height="800" alt="image" src="https://github.com/user-attachments/assets/a5dd087b-3a87-489a-a293-db87ad054748" />

Median response times were similar across the four tested language directions, although all four showed occasional latency spikes.

## QA Takeaways

Testing an AI-powered language API requires more than checking status codes or asserting one expected string.

Useful validation strategies include:

- validating semantic meaning rather than only exact wording
- checking preservation of names, numbers, units, and other critical information
- accounting for multiple valid outputs
- separating harmless linguistic variation from failures that corrupt meaning
- repeating identical requests to expose nondeterministic behavior

## Tools

- Postman — exploratory API testing
- Playwright + TypeScript — automated API requests and data collection
- Pandas — data analysis
- Matplotlib — visualization
- RapidAPI — translation API access

## Repository Contents

- Playwright/TypeScript API test
- CSV dataset containing 400 observations
- Pandas analysis
- Matplotlib visualizations

## Security

API credentials are stored in environment variables and excluded from version control.
