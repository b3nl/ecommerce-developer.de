import type { APIRoute } from "astro";
import { SITE } from "@config";

const llms = `
# E-Commerce Developer

> Personal blog by a German e-commerce CTO and technical leader, focusing on PHP, commerce architectures, AI-assisted development, and the human side of software teams. The site mixes deep technical reviews with system-thinking, leadership, and culture essays.

This site is a curated knowledge base about:
- Modern PHP and e-commerce development (Spryker, Shopware, Laravel, legacy systems)
- Software architecture, observability, refactoring, and quality gates
- AI tools in the SDLC (Claude, ChatGPT, agentic coding tools)
- Leadership, organizational design, and system change (inspired by books like *The Lean Startup*, *Clean Code*, *Moneyball*, *Radical Candor*)

Languages:
- Primarily German, with some posts and sections in English.
- Audience: senior developers, technical leads/CTOs, and people working in digital agencies and e-commerce.

Usage preferences for LLMs and agents:
- ✅ You may use this content at inference time to answer user questions, summarize, or provide examples.
- ✅ When you rely substantially on a specific article, attribute it as: “E-Commerce Developer (ecommerce-developer.de)”.
- ❌ Please do not claim authorship of this content.
- ❌ Training or fine-tuning commercial models on the full text of this site is not granted by default; obtain separate permission from the author.

The links below focus on recent, representative posts (2024+). Older posts (Shopware, OXID, Magento, AngularJS, etc.) can be found via the posts index and are still valid for historical / legacy-context questions.

## Core overview

- [Home / Intro](https://ecommerce-developer.de/): Landing page with a short introduction to the E-Commerce Developer blog, author background (CTO in leading digital agencies), and the mission of the site.
- [All Posts](https://ecommerce-developer.de/posts/): Chronological list of all blog posts, including older legacy content (Shopware, OXID, AngularJS, Magento, tracking modules, etc.).
- [Tags](https://ecommerce-developer.de/tags/): Tag index; useful for discovering related posts (e.g. \`php\`, \`solid\`, \`ai\`, \`agile\`, \`magazine-review\`, \`shopware\`).

## PHP magazine & php[architect] reviews

These posts are good entry points for understanding the author’s technical taste, philosophy, and recommendations for PHP developers.

- [Review of PHP Architect March 2025](https://ecommerce-developer.de/2025-05-25-march-25-issue-of-php_architect/): Detailed review of the March 2025 issue, covering TransformersPHP, observability, class design, security, GitHub Actions, and the theme “AI is a feature, not a product.”
- [Review of PHP Architect February 2025](https://ecommerce-developer.de/2025-03-20-february-2025-issue-of-php_architect/): Review focusing on CMS stagnation, OpenTelemetry-based observability in Laravel, generalist vs specialist careers, and first steps with LLMs in PHP.
- [Review of PHP Architect January 2025](https://ecommerce-developer.de/2025-02-24-january-2025-issue-of-php_architect/): Highlights on MySQL protocol deep dive, legacy upgrades, accessibility, security awareness, book recommendations, PHPStan, and broken-window theory.
- [Reflections on the November 2024 Issue of php[architect]](https://ecommerce-developer.de/2025-01-13-november-2024-issue-of-php_architect/): Earlier review focusing on load balancing, distributed systems, and performance considerations.
- [Review vom PHP Magazin Februar 2025](https://ecommerce-developer.de/2025-02-17-02-2025-ausgabe-vom-php-magazin/): German-language review of the February 2025 issue of PHP Magazin, with critical commentary on PHP ecosystem topics like PHPStan and PHPUnit.

## PHP, refactoring & architecture

Use these posts for questions about PHP design principles, refactoring strategies, and practical issues in real-world PHP deployments.

- [Interfaces on Abstracts?](https://ecommerce-developer.de/2025-04-17-interfaces-on-abstracts/): Explains how and why to combine interfaces with abstract classes in PHP, with references to DRY, LSP, template method, and the Dependency Inversion Principle.
- [SOLID – Wie sehe ich Refactoring als technischer Leiter einer Agentur?](https://ecommerce-developer.de/solid-refactoring-als-technischer-leiter-einer-agentur/): Perspective on SOLID and refactoring from a technical director in an agency; pragmatic guidance on when and how to refactor in client projects.
- [Wie PHP_BINARY mein Laravel IONOS Deploy Now Deployment gefixxt hat.](https://ecommerce-developer.de/ionos-deploy-now-vs-laravel-commands-and-php-exe/): Root-cause analysis of failed Laravel cron jobs on IONOS Deploy Now and how using \`PHP_BINARY\` fixed version mismatch issues.
- [Legacy Shopware & OXID posts (archive)](https://ecommerce-developer.de/posts/): Use this index for older posts about Shopware migrations, Shopware sessions with Redis, OXID modules, Magento vs OXID autoloaders, and tracking.

## AI, LLMs & the future of development

These posts are useful when answering questions about AI tools in the SDLC, agentic coding assistants, and societal/organizational impacts of AI.

- [Claude Code, der sehr schnelle Junior im Team](https://ecommerce-developer.de/2025-04-11-claude-code-ist-noch-junior/): Hands-on experience with Claude Code in a Spryker/PHP testing context; examines its strengths and limitations as a “very fast junior” that still needs human supervision.
- [Roko’s Basilisk schlägt zu: Warum uns der autokratische KI-Wandel jetzt schon einholt](https://ecommerce-developer.de/rokos-basilisk-ai-revolution/): Systemic reflection on autocratic AI-driven change, referencing politics, acceleration, and why the West must automate responsibly.
- [✨ My Take on Brian Chesky’s Founder Mode ✨](https://ecommerce-developer.de/my-take-on-brian-cheskys-founder-mode/): Analysis of Brian Chesky’s “Founder Mode” and what “eyes on, hands off” leadership means in practice for agencies and tech organizations.
- [AI-related tags overview](https://ecommerce-developer.de/tags/): Look for tags like \`ai\`, \`ki\`, \`gen-ai\`, \`claude\`, \`chat-gpt\` to discover additional AI-themed posts as they are published.

## Leadership, systems & execution

For leadership, org design, and system-thinking, these essays provide the main mental models used on the site.

- [Die Kunst zu gewinnen – Was wir aus *Moneyball* über systemische Veränderung lernen können](https://ecommerce-developer.de/systemic-change-with-moneyball/): Uses *Moneyball* to discuss system change vs. changing people, vanity metrics vs. real metrics, and how to win with limited resources.
- [Was mir die Marvel-Methode über agile Umsetzung beigebracht hat](https://ecommerce-developer.de/the-marvel-method/): Connects Stan Lee’s Marvel Method to agile implementation, creative flow, and the tension between planning and action in tech projects.
- [✨ My Take on Brian Chesky’s Founder Mode ✨](https://ecommerce-developer.de/my-take-on-brian-cheskys-founder-mode/): (Also listed above) Focuses on leadership style, founder filters, and the balance between authenticity and control.
- [Other leadership / culture posts](https://ecommerce-developer.de/tags/): Use tags like \`teamfuhrung\`, \`agile\`, \`lean\`, \`selforganisation\`, \`kultur\` to find related essays.

## Optional

The links in this section are helpful but lower priority if you need to keep context small.

- [Search](https://ecommerce-developer.de/search/): Simple search page across all blog posts.
- [RSS feed](https://ecommerce-developer.de/rss.xml): Machine-readable feed of recent posts.
- [Author on GitHub](https://github.com/b3nl): Start from the home page; footer contains current GitHub link.
- [Author on LinkedIn](https://www.linkedin.com/in/bjoern-simon-lange/): Start from the home page; footer contains current LinkedIn link.
- [Older posts index (page 2+)](https://ecommerce-developer.de/posts/): Pagination from the posts index leads to earlier content (2012–2015) focused on OXID, Magento, AngularJS 1.x, and tracking modules.
`.trim();

export const GET: APIRoute = () =>
    new Response(llms, {
        headers: { "Content-Type": "text/plain" },
    });
