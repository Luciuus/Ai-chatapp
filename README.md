This is a context-aware AI chat application built with Next.js and powered by the Google Gemini API. It features a sleek, modern interface and maintains a persistent conversational memory by storing the chat history locally.

## Features

*   **Real-time Conversational AI**: Interact with Google's `gemini-2.5-flash` model.
*   **Persistent Memory**: Chat history is saved in a local `memory.json` file, providing context for ongoing conversations.
*   **Reset Functionality**: Easily clear the conversation history to start fresh.
*   **Modern UI**: A clean and responsive interface built with Tailwind CSS and Lucide React icons.
*   **Server-Side Logic**: API routes built with Next.js handle all communication with the Gemini API and manage the conversation memory.

## Tech Stack

*   **Framework**: Next.js
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS
*   **AI**: Google Gemini API (`@google/genai`)
*   **Icons**: Lucide React

## Getting Started

Follow these instructions to get a local copy of the project up and running.

### Prerequisites

*   Node.js (v20 or later)
*   A Google Gemini API key. You can obtain one from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/luciuus/ai-chatapp.git
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd ai-chatapp
    ```

3.  **Install dependencies:**
    ```bash
    npm install
    ```

4.  **Set up environment variables:**
    Create a file named `.env.local` in the root of the project and add your Google Gemini API key:
    ```
    GEMINI_API_KEY="YOUR_API_KEY_HERE"
    ```

5.  **Run the development server:**
    ```bash
    npm run dev
    ```

6.  Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## How It Works

The application's core feature is its ability to maintain conversation context.

*   **Conversation Memory**: The entire chat history is stored in the `memory.json` file located in the project's root directory.
*   **API Interaction**:
    1.  When a user sends a message, the frontend makes a `POST` request to the `/api/chat` endpoint.
    2.  The server reads the current history from `memory.json`, appends the new user message, and sends the complete conversation to the Gemini API.
    3.  The AI's response is received, appended to the history, and the `memory.json` file is overwritten with the updated conversation.
    4.  The updated history is sent back to the client to refresh the UI.
*   **Resetting Memory**: The "Reset" button triggers a `POST` request to the `/api/reset` endpoint, which clears the contents of `memory.json`, effectively starting a new session.
