// Auto-generated from web-fundamental-crash-course
export interface QuizQuestionRaw {
  id: string;
  topic: string;
  question: string;
  options: string[];
  answer: number;
  hint: string;
}

export interface MatchingItem {
  id: string;
  term: string;
  definition: string;
}

export const QUIZ_QUESTIONS_EN: QuizQuestionRaw[] = [
  {
    "id": "q1",
    "topic": "What Is the Web and Why Does It Matter?",
    "question": "What is the fundamental difference between the Internet and the Web?",
    "options": [
      "The Internet is just for websites, while the Web includes email and gaming.",
      "The Internet is the physical/logical network layer, while the Web is an application built on top of it.",
      "The Web is a hardware layer, and the Internet is the software layer.",
      "They are exactly the same thing, just used interchangeably."
    ],
    "answer": 1,
    "hint": "Think of one as the physical roads of a city, and the other as the buildings sitting on those roads."
  },
  {
    "id": "q2",
    "topic": "What Is the Web and Why Does It Matter?",
    "question": "In the full lifecycle of a web request, what is the very first step before a TCP connection can be established?",
    "options": [
      "TLS Handshake",
      "Server Processing",
      "DNS Resolution",
      "DOM Rendering"
    ],
    "answer": 2,
    "hint": "The browser needs to know the IP address of the domain name (like example.com) before it can connect."
  },
  {
    "id": "q3",
    "topic": "What Is the Web and Why Does It Matter?",
    "question": "Which rendering strategy builds the HTML page on the server per request, making it highly suitable for SEO-sensitive pages that need personalization?",
    "options": [
      "Client-Side Rendering (CSR)",
      "Server-Side Rendering (SSR)",
      "Static Site Generation (SSG)",
      "Single Page Application (SPA)"
    ],
    "answer": 1,
    "hint": "It happens on the \"Server\" side dynamically for every single request, unlike SSG."
  },
  {
    "id": "q4",
    "topic": "What Is the Web and Why Does It Matter?",
    "question": "Why is Semantic HTML critical for a website?",
    "options": [
      "It makes the website load faster on mobile devices.",
      "It automatically styles the page without needing CSS.",
      "It provides structure that screen readers and search engine crawlers depend on to understand the page.",
      "It prevents security vulnerabilities like Cross-Site Scripting (XSS)."
    ],
    "answer": 2,
    "hint": "Think about how a blind user's screen reader or a Google bot knows what a <nav> or <header> is compared to a plain <div>."
  },
  {
    "id": "q5",
    "topic": "Client–Server Communication",
    "question": "According to the restaurant analogy, if the user is the customer and the browser is the ordering tablet, what does the server represent?",
    "options": [
      "The menu",
      "The kitchen",
      "The meal",
      "The waiter"
    ],
    "answer": 1,
    "hint": "It's the place where the requested order (request) is processed and the meal (response) is prepared."
  },
  {
    "id": "q6",
    "topic": "Client–Server Communication",
    "question": "What is a key characteristic of a \"Thick Client\"?",
    "options": [
      "It holds significant logic and state locally, communicating with the server mainly through an API.",
      "It does very little logic locally and mostly displays what the server sends.",
      "It runs entirely on the backend server.",
      "It only supports static HTML pages without JavaScript."
    ],
    "answer": 0,
    "hint": "A React Single Page Application (SPA) or a native mobile app is \"thick\" because it does a lot of the heavy lifting on the user's device."
  },
  {
    "id": "q7",
    "topic": "Client–Server Communication",
    "question": "Why is \"statelessness\" an important architectural concept for backend servers?",
    "options": [
      "It forces the server to remember every user indefinitely.",
      "It allows servers to be scaled horizontally, as any server instance can handle any request.",
      "It prevents the use of databases entirely.",
      "It guarantees that the server never crashes."
    ],
    "answer": 1,
    "hint": "If a server doesn't have to \"remember\" client state in its own memory, you can easily add 10 more identical servers behind a load balancer."
  },
  {
    "id": "q8",
    "topic": "HTTP Communication",
    "question": "What does it mean for an HTTP method to be \"idempotent\"?",
    "options": [
      "The method is encrypted and secure.",
      "Making the request once or multiple times produces the same result on the server.",
      "The method can only be used by authenticated administrators.",
      "The request automatically retries if it fails."
    ],
    "answer": 1,
    "hint": "If you hit a DELETE endpoint 5 times, the resource is still gone, just like hitting it once. The end state doesn't change after the first time."
  },
  {
    "id": "q9",
    "topic": "HTTP Communication",
    "question": "Which HTTP method is specifically used to modify or update ONLY a specific part of existing data?",
    "options": [
      "PUT",
      "POST",
      "PATCH",
      "GET"
    ],
    "answer": 2,
    "hint": "You use this when you just want to \"patch up\" a small detail, like fixing a single typo in a bio, rather than replacing the whole thing."
  },
  {
    "id": "q10",
    "topic": "HTTP Communication",
    "question": "What was a major improvement introduced in HTTP/2 compared to HTTP/1.1?",
    "options": [
      "Switching to a UDP-based protocol.",
      "Multiplexing, allowing many requests to share a single TCP connection.",
      "Removing the need for HTTP headers.",
      "Replacing JSON with XML for data transfer."
    ],
    "answer": 1,
    "hint": "Instead of opening multiple parallel connections per domain, HTTP/2 sends many streams over just one connection at the same time."
  },
  {
    "id": "q11",
    "topic": "HTTP Communication",
    "question": "If a client sends a malformed or incomplete request, which HTTP status code category should the server return?",
    "options": [
      "2xx",
      "3xx",
      "4xx",
      "5xx"
    ],
    "answer": 2,
    "hint": "Errors caused by the user or browser (like bad syntax or unauthorized access) fall into the four-hundreds range."
  },
  {
    "id": "q12",
    "topic": "HTTP Communication",
    "question": "What is the difference between a 401 and a 403 HTTP status code?",
    "options": [
      "401 means \"Not Found\", 403 means \"Bad Request\".",
      "401 means \"Log in again\" (Unauthorized), 403 means \"Logged in, but no permission\" (Forbidden).",
      "401 is a client error, 403 is a server error.",
      "401 indicates rate limiting, 403 indicates a crashed server."
    ],
    "answer": 1,
    "hint": "401 is when the bouncer doesn't know who you are. 403 is when the bouncer knows who you are, but you still aren't on the VIP list."
  },
  {
    "id": "q13",
    "topic": "HTTP Communication",
    "question": "What is the primary purpose of the \"User-Agent\" request header?",
    "options": [
      "To identify the user's personal email address.",
      "To tell the server what types of data the client can read.",
      "To identify the browser, operating system, and device making the request.",
      "To send the user's authentication token."
    ],
    "answer": 2,
    "hint": "It tells the server if you are visiting from Chrome on Windows, or Safari on an iPhone."
  },
  {
    "id": "q14",
    "topic": "HTTP Communication",
    "question": "When should a developer choose Server-Sent Events (SSE) over WebSockets?",
    "options": [
      "When building a fast-paced multiplayer game.",
      "When the data only needs to flow one way (from server to client) like a live feed.",
      "When the client needs to frequently send messages back to the server.",
      "When the application requires offline support."
    ],
    "answer": 1,
    "hint": "SSE is a one-way street (pushing notifications to a dashboard), while WebSockets are a two-way street."
  },
  {
    "id": "q15",
    "topic": "APIs and Data Exchange",
    "question": "Why do teams use an API Gateway in a microservices architecture?",
    "options": [
      "To write all backend logic in a single file.",
      "To act as a single entry point handling cross-cutting concerns like auth, logging, and rate limiting.",
      "To convert SQL databases into NoSQL databases.",
      "To bypass CORS security rules entirely."
    ],
    "answer": 1,
    "hint": "Instead of every small service implementing its own security and rate limits, a \"Gateway\" handles it at the front door."
  },
  {
    "id": "q16",
    "topic": "APIs and Data Exchange",
    "question": "Which API style is characterized by having a single endpoint where the client specifies exactly which fields it needs in the response?",
    "options": [
      "REST",
      "gRPC",
      "GraphQL",
      "Webhooks"
    ],
    "answer": 2,
    "hint": "It was created by Facebook to let frontends ask for exactly the data they need, no more and no less."
  },
  {
    "id": "q17",
    "topic": "APIs and Data Exchange",
    "question": "What is \"Serialization\" in the context of data exchange?",
    "options": [
      "The process of turning an in-memory object (like a database row) into a JSON string to send over the network.",
      "The process of validating a user's password.",
      "The process of encrypting data over HTTPS.",
      "The process of sorting database records alphabetically."
    ],
    "answer": 0,
    "hint": "It's the act of packaging complex memory objects into a flat string format (like JSON) so it can travel across the web."
  },
  {
    "id": "q18",
    "topic": "Authentication & User Management",
    "question": "How does \"Authorization\" differ from \"Authentication\"?",
    "options": [
      "Authentication verifies permissions, Authorization verifies identity.",
      "Authentication is \"Who are you?\", Authorization is \"What are you allowed to do?\".",
      "They are two words for the exact same process.",
      "Authentication happens after Authorization."
    ],
    "answer": 1,
    "hint": "Showing your ID card is Authentication. The keycard only opening your specific hotel room is Authorization."
  },
  {
    "id": "q19",
    "topic": "Authentication & User Management",
    "question": "Which authorization model computes permissions dynamically from attributes of the user, resource, and context (e.g., 'only during business hours')?",
    "options": [
      "Role-Based Access Control (RBAC)",
      "JSON Web Tokens (JWT)",
      "Attribute-Based Access Control (ABAC)",
      "Single Sign-On (SSO)"
    ],
    "answer": 2,
    "hint": "It uses \"Attributes\" rather than fixed \"Roles\" to make complex, situational decisions."
  },
  {
    "id": "q20",
    "topic": "Authentication & User Management",
    "question": "What does the \"HttpOnly\" flag do when set on a cookie?",
    "options": [
      "It forces the cookie to only be sent over HTTPS.",
      "It blocks JavaScript from reading the cookie, reducing the risk of XSS attacks.",
      "It prevents the cookie from being used across different sites.",
      "It ensures the cookie never expires."
    ],
    "answer": 1,
    "hint": "It makes the cookie strictly for HTTP transport, hiding it from document.cookie in client-side scripts."
  },
  {
    "id": "q21",
    "topic": "Authentication & User Management",
    "question": "Why do production systems commonly split tokens into a short-lived \"Access Token\" and a long-lived \"Refresh Token\"?",
    "options": [
      "To save database storage space.",
      "To limit the damage if an access token is leaked, while keeping the user logged in seamlessly via the refresh token.",
      "Because JSON Web Tokens have a maximum size limit.",
      "To prevent Cross-Origin Resource Sharing (CORS) errors."
    ],
    "answer": 1,
    "hint": "If a hacker steals an Access Token, it becomes useless in 15 minutes. The Refresh Token is kept much safer and gets new Access Tokens."
  },
  {
    "id": "q22",
    "topic": "Authentication & User Management",
    "question": "In a JSON Web Token (JWT), what guarantees that the token hasn't been tampered with by the client?",
    "options": [
      "The Header",
      "The Payload",
      "The Signature",
      "The Encryption"
    ],
    "answer": 2,
    "hint": "The server uses a secret key to sign the token. If the payload is altered, this part will no longer match."
  },
  {
    "id": "q23",
    "topic": "Security & Performance",
    "question": "What triggers a CORS \"Preflight\" (OPTIONS) request?",
    "options": [
      "Any standard GET request to load an image.",
      "A \"non-simple\" request across different origins, like one using PUT, DELETE, or custom Authorization headers.",
      "A request made entirely within the same domain.",
      "When the DNS resolution fails."
    ],
    "answer": 1,
    "hint": "The browser checks with the server (\"Is this allowed?\") before sending complex or potentially dangerous cross-origin requests."
  },
  {
    "id": "q24",
    "topic": "Security & Performance",
    "question": "In caching, what is the role of an ETag?",
    "options": [
      "It specifies the exact time a cache entry should expire (TTL).",
      "It acts as a fingerprint of a resource's content, allowing the server to return \"304 Not Modified\" if the content hasn't changed.",
      "It encrypts the cached data in the browser.",
      "It prevents the CDN from storing static assets."
    ],
    "answer": 1,
    "hint": "The client sends this fingerprint back to the server. If it matches the server's current version, the server doesn't resend the heavy payload."
  },
  {
    "id": "q25",
    "topic": "Security & Performance",
    "question": "Which Core Web Vital measures how long it takes for the page to respond after a user clicks, taps, or presses a key?",
    "options": [
      "Largest Contentful Paint (LCP)",
      "Cumulative Layout Shift (CLS)",
      "Interaction to Next Paint (INP)",
      "Time to First Byte (TTFB)"
    ],
    "answer": 2,
    "hint": "It tracks the delay between the user's \"Interaction\" and the browser's next visual update."
  },
  {
    "id": "q26",
    "topic": "Security & Performance",
    "question": "During a TLS (HTTPS) handshake, what proves to the client that the server is actually the domain it claims to be?",
    "options": [
      "The IP address matching the DNS record.",
      "A digital certificate issued by a trusted Certificate Authority (CA).",
      "The presence of the \"Strict-Transport-Security\" header.",
      "The user's stored session cookie."
    ],
    "answer": 1,
    "hint": "Just like a passport proves your identity, a trusted third party (CA) issues this document to the server."
  },
  {
    "id": "q27",
    "topic": "Security & Performance",
    "question": "Which rate limiting algorithm gives each user a \"bucket\" that refills at a steady rate, allowing short bursts of traffic while enforcing a long-term average?",
    "options": [
      "Fixed Window",
      "Sliding Window",
      "Token Bucket",
      "Preflight Limiting"
    ],
    "answer": 2,
    "hint": "The algorithm's name literally contains the word \"bucket\" where \"tokens\" represent permission to make a request."
  },
  {
    "id": "q28",
    "topic": "Data Storage",
    "question": "What is the primary purpose of a database \"Index\"?",
    "options": [
      "To encrypt sensitive columns in a table.",
      "To duplicate data across multiple servers for backup.",
      "To allow the database to jump straight to matching rows instead of scanning the entire table, drastically speeding up queries.",
      "To enforce referential integrity between tables."
    ],
    "answer": 2,
    "hint": "It works exactly like the index at the back of a textbook, telling you exactly which page to flip to."
  },
  {
    "id": "q29",
    "topic": "Data Storage",
    "question": "Why is Server-Side Validation mandatory, even if you have excellent Client-Side Validation?",
    "options": [
      "Client-side validation slows down the browser too much.",
      "Client-side validation can always be bypassed by directly calling the API, so the server must protect itself.",
      "Server-side validation is required by the HTTP/2 specification.",
      "Client-side validation only works on mobile devices."
    ],
    "answer": 1,
    "hint": "A malicious user can just use a tool like Postman to send requests directly to the backend, skipping your frontend forms entirely."
  },
  {
    "id": "q30",
    "topic": "Data Storage",
    "question": "What is a major drawback of \"Offset-based\" pagination on large datasets or fast-changing feeds?",
    "options": [
      "It is impossible to jump to a specific page.",
      "It gets slower on large offsets and can skip or repeat items if new data is added between requests.",
      "It requires a NoSQL database.",
      "It forces the server to load all records into memory at once."
    ],
    "answer": 1,
    "hint": "If you ask for \"items 20-30\", but 5 new items were just inserted at the top, items that used to be 15-20 shift down and you see them twice."
  },
  {
    "id": "q31",
    "topic": "Background Processing",
    "question": "How does a Webhook differ from a standard REST API request?",
    "options": [
      "Webhooks use XML, while REST uses JSON.",
      "In REST you ask for data; in a Webhook, the external service automatically pushes data to you when an event occurs.",
      "Webhooks do not require an internet connection.",
      "Webhooks can only be used by frontend applications."
    ],
    "answer": 1,
    "hint": "A REST API is you calling the restaurant to ask if the food is ready. A Webhook is the restaurant calling you the moment the food is ready."
  },
  {
    "id": "q32",
    "topic": "Background Processing",
    "question": "Why should heavy processing NOT be done directly inside a webhook handler endpoint?",
    "options": [
      "Webhooks only accept GET requests, which cannot have a body.",
      "The sender usually expects a fast response (e.g., 200 OK); if you take too long, they will assume failure and retry.",
      "Webhooks are limited to 1 kilobyte of memory.",
      "Background jobs cannot be triggered from webhooks."
    ],
    "answer": 1,
    "hint": "If you take 30 seconds to process a payment webhook, Stripe will think your server crashed and will hit you with the same event again."
  },
  {
    "id": "q33",
    "topic": "Background Processing",
    "question": "In message broker architectures, what is the \"Pub/Sub\" pattern?",
    "options": [
      "Each message is processed by exactly one worker in a work queue.",
      "Each message is delivered to every interested subscriber independently.",
      "The message is stored in the database instead of a queue.",
      "The server publishes an HTML page and the user subscribes to the RSS feed."
    ],
    "answer": 1,
    "hint": "When an \"order placed\" event is Published, the email service, analytics service, and inventory service all Subscribe and react to it simultaneously."
  },
  {
    "id": "q34",
    "topic": "Background Processing",
    "question": "Why is \"Structured Logging\" (writing logs as JSON) preferred in modern backend systems?",
    "options": [
      "It reduces the physical disk space used by 90%.",
      "It allows centralized logging systems (like ELK) to easily parse, search, and filter logs by specific fields.",
      "It encrypts the logs automatically.",
      "It prevents sensitive data from ever being logged."
    ],
    "answer": 1,
    "hint": "Searching through millions of free-text sentences is hard. Searching for {\"user_id\": 123, \"level\": \"ERROR\"} is instantaneous."
  },
  {
    "id": "q35",
    "topic": "Testing & Quality Assurance",
    "question": "According to the Testing Pyramid, which type of tests should you have the MOST of, because they are fast and cheap?",
    "options": [
      "End-to-End (E2E) Tests",
      "Integration Tests",
      "Unit Tests",
      "Manual UI Tests"
    ],
    "answer": 2,
    "hint": "These tests isolate one small piece of logic (a single function) and don't require external databases or running browsers."
  },
  {
    "id": "q36",
    "topic": "Testing & Quality Assurance",
    "question": "In Test-Driven Development (TDD), what is the correct order of the \"Red-Green-Refactor\" cycle?",
    "options": [
      "Write code (Green), write test (Red), clean up (Refactor).",
      "Write a failing test (Red), write just enough code to pass it (Green), clean up the code (Refactor).",
      "Clean up (Refactor), write failing test (Red), write code (Green).",
      "Write test (Green), clean up (Refactor), break code (Red)."
    ],
    "answer": 1,
    "hint": "You must prove the test can fail before you write the code to make it pass, then you tidy things up."
  },
  {
    "id": "q37",
    "topic": "Testing & Quality Assurance",
    "question": "What is a \"Mock\" in the context of automated testing?",
    "options": [
      "A fake replacement for a real dependency (like a database or API) so the test runs fast and isolated.",
      "A tool that randomly generates bad user input.",
      "A script that insults the developer when tests fail.",
      "A copy of the production database."
    ],
    "answer": 0,
    "hint": "Instead of actually charging a credit card in a test, you use a \"fake\" object that just pretends to succeed."
  },
  {
    "id": "q38",
    "topic": "Deployment & Infrastructure",
    "question": "In deployment strategies, what is a \"Canary Deployment\"?",
    "options": [
      "Releasing the new version to 100% of users simultaneously.",
      "Running two identical environments and switching traffic instantly.",
      "Releasing the new version to a small percentage of users first, watching for errors, then rolling out to everyone.",
      "Manually copying files to a server via FTP."
    ],
    "answer": 2,
    "hint": "Named after the birds used in coal mines, this strategy sends a small group of users ahead to detect danger before committing fully."
  },
  {
    "id": "q39",
    "topic": "Deployment & Infrastructure",
    "question": "Why are \"Environment Variables\" essential for modern web applications?",
    "options": [
      "They automatically configure the user's browser settings.",
      "They keep secrets (like API keys and DB URLs) out of the code and allow the same code to run differently in dev vs. production.",
      "They prevent DNS propagation delays.",
      "They speed up JavaScript execution in the rendering engine."
    ],
    "answer": 1,
    "hint": "You never want to hardcode a production password into a file that gets committed to Git. Instead, the server provides it at runtime."
  },
  {
    "id": "q40",
    "topic": "Collaboration & Version Control",
    "question": "In Git Branching Strategies, what is the defining feature of \"Trunk-Based Development\"?",
    "options": [
      "Developers work on feature branches that last for months before merging.",
      "Everyone commits small, frequent changes directly to (or via very short-lived branches into) a single main branch.",
      "Code is sent via email patches instead of pull requests.",
      "There is no main branch, only individual developer repositories."
    ],
    "answer": 1,
    "hint": "The \"trunk\" (main branch) is the single source of truth, and developers merge their tiny updates into it multiple times a day."
  },
  {
    "id": "q41",
    "topic": "What Is the Web and Why Does It Matter?",
    "question": "What is the main difference between static and dynamic content on the web?",
    "options": [
      "Static content is only for mobile phones; dynamic is for desktops.",
      "Static content serves the exact same HTML/CSS/JS to every visitor, while dynamic content is built by the server per request.",
      "Dynamic content doesn't require a backend server.",
      "Static content uses WebSockets, while dynamic uses plain HTTP."
    ],
    "answer": 1,
    "hint": "A plain landing page is static, while your personalized Instagram feed is built dynamically just for you."
  },
  {
    "id": "q42",
    "topic": "What Is the Web and Why Does It Matter?",
    "question": "What is a Multi Page Application (MPA)?",
    "options": [
      "An application that opens multiple browser tabs at once.",
      "An application where each navigation triggers a fresh request to the server for a completely new HTML page.",
      "An application built entirely without JavaScript.",
      "An application where navigation is handled by JavaScript without full page reloads."
    ],
    "answer": 1,
    "hint": "Every time you click a link, you see the browser's loading spinner because it's asking the server for a brand new page."
  },
  {
    "id": "q43",
    "topic": "What Is the Web and Why Does It Matter?",
    "question": "When building accessible websites, when should you use ARIA attributes?",
    "options": [
      "On every single HTML element to ensure perfect accessibility.",
      "Only when native semantic HTML tags can't express the necessary accessibility information.",
      "Instead of CSS to style elements for screen readers.",
      "Only on <div> elements, never on <button> elements."
    ],
    "answer": 1,
    "hint": "If a native <nav> tag does the job, use it. You only bring in ARIA when the standard tags aren't enough."
  },
  {
    "id": "q44",
    "topic": "What Is the Web and Why Does It Matter?",
    "question": "Why can a long-running script freeze an entire web page (\"the page is unresponsive\")?",
    "options": [
      "The browser's JavaScript engine is single-threaded and uses an event loop, meaning it can only do one thing at a time.",
      "The browser runs out of RAM and crashes the operating system.",
      "The script disconnects the user from the Wi-Fi.",
      "The server stops sending HTML until the script finishes."
    ],
    "answer": 0,
    "hint": "Because it's \"single-threaded,\" if a heavy calculation is running, clicking a button has to wait in line until it's done."
  },
  {
    "id": "q45",
    "topic": "HTTP Communication",
    "question": "What does a \"persistent connection\" (Connection: keep-alive) achieve in HTTP?",
    "options": [
      "It saves the user's password in the browser permanently.",
      "It reuses the same TCP connection for multiple requests to avoid the cost of a new handshake every time.",
      "It prevents the server from ever timing out.",
      "It upgrades the connection to a WebSocket automatically."
    ],
    "answer": 1,
    "hint": "Instead of saying \"Hello\" and \"Goodbye\" for every single image on a webpage, you say \"Hello\" once and download them all."
  },
  {
    "id": "q46",
    "topic": "HTTP Communication",
    "question": "What is the purpose of the Strict-Transport-Security (HSTS) header?",
    "options": [
      "It prevents Cross-Origin Resource Sharing (CORS).",
      "It forces the browser to only ever contact the site over HTTPS, even if the user types http://.",
      "It blocks all JavaScript execution on the page.",
      "It validates the ETag for caching."
    ],
    "answer": 1,
    "hint": "It ensures that no one can accidentally connect to your site over an insecure, unencrypted connection."
  },
  {
    "id": "q47",
    "topic": "HTTP Communication",
    "question": "Which HTTP header restricts which scripts, styles, and resources a page is allowed to load, drastically reducing the risk of XSS attacks?",
    "options": [
      "Access-Control-Allow-Origin",
      "Content-Security-Policy (CSP)",
      "X-Request-ID",
      "Cache-Control"
    ],
    "answer": 1,
    "hint": "Think of it as a \"Policy\" that defines the \"Security\" of the \"Content\" allowed on the page."
  },
  {
    "id": "q48",
    "topic": "Authentication & User Management",
    "question": "What is the standard defense against a \"session fixation\" attack?",
    "options": [
      "Encrypting the user's password in the database.",
      "Generating a brand-new session ID immediately after the user logs in successfully.",
      "Using an offset-based pagination strategy.",
      "Disabling cookies entirely and using LocalStorage."
    ],
    "answer": 1,
    "hint": "If an attacker gives you a specific session ID to use, the server should throw it away and hand you a fresh one the moment you prove who you are."
  },
  {
    "id": "q49",
    "topic": "Data Storage",
    "question": "In database design, what is \"Normalization\"?",
    "options": [
      "Structuring relational data to avoid duplicating the same information across multiple tables.",
      "The process of turning NoSQL documents into SQL tables.",
      "Caching database queries in Redis.",
      "Reverting a database to a previous backup state."
    ],
    "answer": 0,
    "hint": "Instead of writing the user's home address into every single order they place, you store it once and reference it by ID."
  },
  {
    "id": "q50",
    "topic": "Collaboration & Version Control",
    "question": "What does the git revert command do?",
    "options": [
      "It completely erases a commit from the project's history.",
      "It undoes a commit by creating a new, opposite commit, without erasing history.",
      "It moves changes from the working directory to the staging area.",
      "It deletes the current branch and switches to main."
    ],
    "answer": 1,
    "hint": "It safely rolls back a mistake by adding a \"fix\" commit on top, rather than dangerously rewriting the past."
  }
];

export const MATCHING_ITEMS: Record<'tr' | 'en', MatchingItem[]> = {
  "tr": [
    {
      "id": "thin-client",
      "term": "Thin Client",
      "definition": "Yerelde çok az işlem yapar; çoğunlukla sunucunun gönderdiği içeriği görüntüler."
    },
    {
      "id": "json-schema",
      "term": "JSON Schema",
      "definition": "Bir JSON verisinin beklenen yapısını, veri tiplerini ve zorunlu alanlarını tanımlar."
    },
    {
      "id": "sso",
      "term": "SSO (Single Sign-On)",
      "definition": "Kullanıcının bir kez giriş yaparak birden fazla ilişkili uygulamaya erişmesini sağlar."
    },
    {
      "id": "samesite",
      "term": "SameSite Attribute",
      "definition": "Cookie’nin siteler arası isteklerde gönderilip gönderilmeyeceğini kontrol eder."
    },
    {
      "id": "etag",
      "term": "ETag",
      "definition": "Önbellekteki verinin güncel olup olmadığını kontrol etmek için kullanılan içerik parmak izidir."
    },
    {
      "id": "blue-green",
      "term": "Blue-Green Deployment",
      "definition": "İki paralel ortam çalıştırılır ve trafik doğrulanan yeni ortama geçirilir."
    },
    {
      "id": "kubernetes",
      "term": "Kubernetes",
      "definition": "Container’ları bir makine kümesi üzerinde çalıştıran ve ölçekleyen orkestrasyon sistemidir."
    },
    {
      "id": "pull-request",
      "term": "Pull Request",
      "definition": "Bir branch’teki değişikliklerin incelenerek başka bir branch’e birleştirilmesi talebidir."
    },
    {
      "id": "multiplexing",
      "term": "Multiplexing",
      "definition": "Birden fazla HTTP akışının aynı bağlantıyı eşzamanlı paylaşmasını sağlar."
    },
    {
      "id": "idempotency",
      "term": "Idempotency",
      "definition": "Bir işlemin bir veya birçok kez uygulanmasının aynı nihai sonucu üretmesi özelliğidir."
    }
  ],
  "en": [
    {
      "id": "thin-client",
      "term": "Thin Client",
      "definition": "Does little processing locally and mostly displays what the server sends."
    },
    {
      "id": "json-schema",
      "term": "JSON Schema",
      "definition": "Formally describes the expected shape, types, and required fields of JSON data."
    },
    {
      "id": "sso",
      "term": "SSO (Single Sign-On)",
      "definition": "Lets a user sign in once and access multiple related applications."
    },
    {
      "id": "samesite",
      "term": "SameSite Attribute",
      "definition": "Controls whether a cookie is sent with cross-site requests."
    },
    {
      "id": "etag",
      "term": "ETag",
      "definition": "A content fingerprint used to determine whether a cached resource is still current."
    },
    {
      "id": "blue-green",
      "term": "Blue-Green Deployment",
      "definition": "Runs two parallel environments and switches traffic to the verified new environment."
    },
    {
      "id": "kubernetes",
      "term": "Kubernetes",
      "definition": "An orchestration system that runs and scales containers across a cluster."
    },
    {
      "id": "pull-request",
      "term": "Pull Request",
      "definition": "A request to review and merge changes from one branch into another."
    },
    {
      "id": "multiplexing",
      "term": "Multiplexing",
      "definition": "Allows multiple HTTP streams to share one connection at the same time."
    },
    {
      "id": "idempotency",
      "term": "Idempotency",
      "definition": "The property that repeating an operation produces the same final result."
    }
  ]
};
