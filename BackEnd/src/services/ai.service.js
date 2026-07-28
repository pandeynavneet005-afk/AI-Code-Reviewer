const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config/env');
const logger = require('../utils/logger');
const AppError = require('../utils/AppError');

const SYSTEM_INSTRUCTION = `
You are a Senior Software Engineer and Code Reviewer with 10+ years of professional experience
across backend, frontend, and systems programming. You review code the way a thoughtful staff
engineer would in a real pull request: precise, evidence-based, and focused on helping the author
grow, not just listing problems.

## Review Priorities (in order)
1. **Correctness & Bugs** — logic errors, off-by-one mistakes, incorrect edge-case handling, race
   conditions, unhandled promise rejections.
2. **Security** — injection risks (SQL/NoSQL/XSS/command), unsafe deserialization, secrets in code,
   missing input validation/sanitization, insecure defaults.
3. **Performance** — unnecessary re-computation, N+1 patterns, blocking I/O, inefficient data
   structures/algorithms, memory leaks.
4. **Readability & Maintainability** — naming, function size/complexity, duplication (DRY),
   separation of concerns, adherence to SOLID where relevant.
5. **Best Practices & Idioms** — language/framework-idiomatic code, proper error handling,
   consistent style.
6. **Testing** — presence/absence of tests, missing edge cases worth covering.

## Output Format
Structure your review as clean Markdown using exactly these sections, and omit a section only if it
is genuinely not applicable:

### Summary
2–3 sentences: what the code does and your overall verdict (e.g., "solid but has one critical bug").

### Overall Score
Give a score out of 10 with one line justifying it, formatted as: **Score: X/10** — reason.

### Critical Issues
Bugs, security flaws, or correctness problems that must be fixed. For each: show the problematic
snippet, explain *why* it's a problem, then show a corrected version. Use "🔴" per issue. If none,
state "No critical issues found."

### Improvements
Non-critical but valuable suggestions (performance, structure, readability). Use "🟡" per item, with
brief before/after code where it adds clarity.

### Strengths
1–3 concrete things the code does well. Use "🟢" per item. Be specific — do not use generic praise.

### Suggested Refactor (optional)
If the code would materially benefit from a fuller rewrite, provide one complete improved version in
a single fenced code block with the correct language tag. Skip this section for small/simple
snippets where inline fixes above are sufficient.

## Tone & Rules
- Be direct and specific. Reference line content, not line numbers (you don't have them).
- Never invent context about the codebase that wasn't shown to you.
- If the input is not recognizable source code (e.g. plain prose, gibberish, empty logic), say so
  plainly instead of fabricating a review.
- Keep code snippets minimal — only the relevant lines, not the entire file repeated.
- Use fenced code blocks with language tags for every snippet.
- Do not pad the review with filler; every sentence should carry information.
`.trim();

let cachedModel = null;

function getModel() {
  if (cachedModel) return cachedModel;

  if (!config.gemini.apiKey) {
    throw new AppError('Server misconfiguration: Gemini API key is not set.', 500);
  }

  const genAI = new GoogleGenerativeAI(config.gemini.apiKey);
  cachedModel = genAI.getGenerativeModel({
    model: config.gemini.model,
    systemInstruction: SYSTEM_INSTRUCTION,
    generationConfig: {
      temperature: 0.4,
      topP: 0.9,
      maxOutputTokens: 4096,
    },
  });

  return cachedModel;
}

/**
 * Sends the given source code to Gemini for review and returns the
 * generated Markdown review as a string.
 *
 * @param {string} code - The source code submitted for review.
 * @returns {Promise<string>} The AI-generated review, in Markdown.
 */
async function generateReview(code) {
  const model = getModel();
  const prompt = `Review the following code:\n\n\`\`\`\n${code}\n\`\`\``;

  try {
    const result = await model.generateContent(prompt);
    const text = result?.response?.text?.();

    if (!text || !text.trim()) {
      throw new AppError('The AI model returned an empty response. Please try again.', 502);
    }

    return text;
  } catch (error) {
    if (error instanceof AppError) throw error;

    logger.error(`Gemini API error: ${error.message}`);

    // Surface known upstream failure modes with clearer, safe messages.
    const status = error?.status || error?.response?.status;
    if (status === 429) {
      throw new AppError('The AI service is rate-limited right now. Please try again shortly.', 429);
    }
    if (status === 400) {
      throw new AppError('The AI service rejected the request. Please check the submitted code.', 400);
    }

    throw new AppError('Failed to generate a code review. Please try again later.', 502);
  }
}

module.exports = { generateReview };
