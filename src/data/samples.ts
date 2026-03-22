import type { SamplePair } from "@/lib/types";

export const samplePairs: SamplePair[] = [
  {
    id: "python-refactor",
    label: "Python — Function Refactor",
    description: "Validation and error handling improvements",
    fileType: ".py",
    file1: {
      name: "user_service_v1.py",
      content: `def create_user(name, email, age):
    """Create a new user and save to database."""
    user = {
        "name": name,
        "email": email,
        "age": age,
        "created_at": datetime.now()
    }
    db.users.insert(user)
    return user


def get_user_by_email(email):
    """Fetch a user by email address."""
    user = db.users.find_one({"email": email})
    return user


def update_user(email, data):
    """Update user fields by email."""
    db.users.update_one(
        {"email": email},
        {"$set": data}
    )
    return db.users.find_one({"email": email})`,
    },
    file2: {
      name: "user_service_v2.py",
      content: `import re
from datetime import datetime
from typing import Optional


class UserValidationError(Exception):
    """Raised when user data fails validation."""
    pass


def validate_email(email: str) -> bool:
    """Check that an email address has a valid format."""
    pattern = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$"
    return bool(re.match(pattern, email))


def create_user(name: str, email: str, age: int) -> dict:
    """Create a new user with input validation."""
    if not name or not name.strip():
        raise UserValidationError("Name cannot be empty.")
    if not validate_email(email):
        raise UserValidationError(f"Invalid email format: {email}")
    if not isinstance(age, int) or age < 0 or age > 150:
        raise UserValidationError(f"Age must be an integer between 0 and 150, got {age}")

    if db.users.find_one({"email": email}):
        raise UserValidationError(f"User with email {email} already exists.")

    user = {
        "name": name.strip(),
        "email": email.lower().strip(),
        "age": age,
        "created_at": datetime.now(),
        "updated_at": datetime.now(),
    }
    db.users.insert_one(user)
    return user


def get_user_by_email(email: str) -> Optional[dict]:
    """Fetch a user by email address, returning None if not found."""
    if not validate_email(email):
        raise UserValidationError(f"Invalid email format: {email}")
    return db.users.find_one({"email": email.lower().strip()})


def update_user(email: str, data: dict) -> Optional[dict]:
    """Update user fields by email with validation."""
    if not validate_email(email):
        raise UserValidationError(f"Invalid email format: {email}")

    forbidden_fields = {"_id", "created_at", "email"}
    invalid = set(data.keys()) & forbidden_fields
    if invalid:
        raise UserValidationError(f"Cannot update protected fields: {invalid}")

    data["updated_at"] = datetime.now()
    result = db.users.update_one(
        {"email": email.lower().strip()},
        {"\\$set": data}
    )
    if result.matched_count == 0:
        return None
    return db.users.find_one({"email": email.lower().strip()})`,
    },
  },
  {
    id: "html-accessibility",
    label: "HTML — Accessibility Improvements",
    description: "UI structure and ARIA enhancements",
    fileType: ".html",
    file1: {
      name: "contact_v1.html",
      content: `<!DOCTYPE html>
<html>
<head>
    <title>Contact Us</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="header">
        <img src="logo.png">
        <div class="nav">
            <a href="/">Home</a>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
        </div>
    </div>
    <div class="main">
        <div class="title">Get In Touch</div>
        <div class="subtitle">We'd love to hear from you</div>
        <div class="form-box">
            <div>Name</div>
            <input type="text" placeholder="Your name">
            <div>Email</div>
            <input type="text" placeholder="Your email">
            <div>Message</div>
            <textarea placeholder="Your message"></textarea>
            <div class="btn" onclick="submitForm()">Send Message</div>
        </div>
    </div>
    <div class="footer">
        <div>&copy; 2024 Acme Inc</div>
    </div>
</body>
</html>`,
    },
    file2: {
      name: "contact_v2.html",
      content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact Us — Acme Inc</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header role="banner">
        <img src="logo.png" alt="Acme Inc logo" width="120" height="40">
        <nav aria-label="Main navigation">
            <a href="/">Home</a>
            <a href="/about">About</a>
            <a href="/contact" aria-current="page">Contact</a>
        </nav>
    </header>

    <main>
        <section aria-labelledby="contact-heading">
            <h1 id="contact-heading">Get In Touch</h1>
            <p>We&rsquo;d love to hear from you. Fill out the form below and we&rsquo;ll get back to you within 24 hours.</p>

            <form action="/api/contact" method="POST" novalidate>
                <div class="form-group">
                    <label for="name">Name <span aria-hidden="true">*</span></label>
                    <input id="name" name="name" type="text" required
                           placeholder="Jane Doe" autocomplete="name"
                           aria-required="true">
                </div>

                <div class="form-group">
                    <label for="email">Email <span aria-hidden="true">*</span></label>
                    <input id="email" name="email" type="email" required
                           placeholder="jane@example.com" autocomplete="email"
                           aria-required="true">
                </div>

                <div class="form-group">
                    <label for="message">Message <span aria-hidden="true">*</span></label>
                    <textarea id="message" name="message" rows="5" required
                              placeholder="How can we help?"
                              aria-required="true"></textarea>
                </div>

                <button type="submit">Send Message</button>
            </form>
        </section>
    </main>

    <footer role="contentinfo">
        <p>&copy; 2024 Acme Inc. All rights reserved.</p>
    </footer>
</body>
</html>`,
    },
  },
  {
    id: "markdown-docs",
    label: "Markdown — Documentation Update",
    description: "Setup instructions and new feature notes",
    fileType: ".md",
    file1: {
      name: "README_v1.md",
      content: `# DataSync

A tool for syncing data between services.

## Setup

1. Clone the repo
2. Run \`npm install\`
3. Add your API keys to \`.env\`
4. Run \`npm start\`

## Usage

Import the client:

\`\`\`js
const client = require("datasync");
client.sync("source", "target");
\`\`\`

## Config

Set these in your .env file:

- API_KEY - your api key
- SOURCE_URL - source endpoint
- TARGET_URL - target endpoint

## Notes

- Only JSON is supported
- Runs every 5 minutes by default`,
    },
    file2: {
      name: "README_v2.md",
      content: `# DataSync

A lightweight data synchronization tool for keeping services in sync — supports JSON, CSV, and XML formats.

## Prerequisites

- Node.js 18 or higher
- npm 9+
- API credentials for source and target services

## Getting Started

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/acme/datasync.git
   cd datasync
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Copy the environment template and configure your keys:
   \`\`\`bash
   cp .env.example .env
   \`\`\`

4. Start the service:
   \`\`\`bash
   npm start
   \`\`\`

## Usage

\`\`\`typescript
import { DataSyncClient } from "datasync";

const client = new DataSyncClient({
  source: process.env.SOURCE_URL,
  target: process.env.TARGET_URL,
  format: "json", // also supports "csv" and "xml"
});

await client.sync();
\`\`\`

## Configuration

| Variable      | Required | Description                          | Default     |
|---------------|----------|--------------------------------------|-------------|
| API_KEY       | Yes      | Authentication key for the API       | —           |
| SOURCE_URL    | Yes      | Endpoint to pull data from           | —           |
| TARGET_URL    | Yes      | Endpoint to push data to             | —           |
| SYNC_INTERVAL | No       | Sync interval in minutes             | 5           |
| FORMAT        | No       | Data format (json, csv, xml)         | json        |
| LOG_LEVEL     | No       | Logging verbosity (debug, info, error)| info       |

## What's New in v2

- **CSV and XML support**: Sync is no longer limited to JSON — configure the format in your client options or via the \`FORMAT\` env variable.
- **TypeScript rewrite**: Full type safety with exported types for all configuration and response objects.
- **Configurable sync interval**: Set \`SYNC_INTERVAL\` in your environment to control how often syncs run.
- **Improved error handling**: Retries with exponential backoff and detailed error logs.

## Troubleshooting

If sync fails, check:
1. Both \`SOURCE_URL\` and \`TARGET_URL\` are reachable
2. Your \`API_KEY\` has the correct permissions
3. Run with \`LOG_LEVEL=debug\` for detailed output`,
    },
  },
];
