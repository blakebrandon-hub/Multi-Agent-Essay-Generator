# Multi-Agent Essay Generator

A full-stack web application that uses a multi-agent AI pipeline to research, outline, write, and edit college-level technical essays. Built with Python, Flask, and the OpenAI API, this tool breaks down the writing process into specialized tasks to produce high-quality, formatted academic documents.

## ✨ Features

*   **Multi-Agent Architecture:** Utilizes five distinct AI agents (Planner, Deep Researcher, Outliner, Essay Writer, and Editor) to handle different phases of the writing process.
*   **Iterative Drafting:** The Writer and Editor agents work together in a loop, revising the essay up to three times to meet college-level standards based on automated grading metrics.
*   **Real-Time Progress Tracking:** The frontend UI displays a live progress bar, current phase indicators, and a real-time activity log.
*   **Transparent Output:** Users can view the generated research tasks, structural outline, and the editor's scoring matrix directly in the browser.
*   **Word Document Export:** Automatically formats the final essay into a stylized Microsoft Word (`.docx`) file for easy downloading.
*   **Pre-built Examples:** Includes quick-start templates for complex topics like CRISPR, Blockchain, Transformer Architectures, Solid-State Batteries, and Edge Computing.

## 🛠️ Tech Stack

*   **Backend:** Python, Flask
*   **AI Models:** OpenAI API (defaulting to `gpt-4o-mini`)
*   **Document Generation:** `python-docx`
*   **Frontend:** HTML5, CSS3, Vanilla JavaScript

## 🚀 Getting Started

### Prerequisites

Ensure you have Python installed on your machine and an active OpenAI API key.

### Installation

1.  **Clone the repository** (or create the necessary files in your project directory).
2.  **Install required dependencies:**
    ```bash
    pip install flask openai python-docx
    ```
3.  **Set your API key as an environment variable:**
    ```bash
    export OPENAI_API_KEY="your-api-key-here"
    ```
    *(Note: On Windows, use `set OPENAI_API_KEY="your-api-key-here"`)*

### Running the Application

1.  Start the Flask server:
    ```bash
    python app.py
    ```
2.  Open your web browser and navigate to `http://localhost:5000`.

## 💡 How It Works

1.  **Input:** Enter your desired technical topic and any specific requirements (e.g., word count, target audience, specific areas of focus) into the web interface.
2.  **Planning & Research:** The **Planner** breaks the topic into actionable tasks, and the **Deep Researcher** gathers detailed, accurate technical information.
3.  **Outlining:** The **Outliner** creates a structured markdown outline integrating the research findings.
4.  **Writing & Editing:** The **Essay Writer** drafts the essay. The **Editor** then reviews it across six metrics (thesis, organization, evidence, technical accuracy, writing quality, and depth). If it fails the check, it provides feedback and sends it back to the writer for a revision.
5.  **Export:** Once approved (or after the maximum iterations are reached), the app compiles the final markdown into a nicely formatted `.docx` file.

## 📁 Project Structure

*   `app.py`: The main Flask server, API endpoints, and LLM agent definitions.
*   `templates/index.html`: The frontend user interface.
*   `outputs/`: The directory where all generated `.docx` files are saved locally.
