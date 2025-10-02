# 🔥 Pass The Torch: Placement Story Platform

## Project Overview
Pass The Torch is a modern, full-stack application designed to capture, organize, and share detailed placement experiences from seniors to aid juniors in their preparation. It features clean, user-friendly UI and integrates an AI mentor for contextual support.

The application is built using React (Vite) on the frontend, managed by Redux, and uses Appwrite for its backend services (Database, Authentication, and Storage). Crucially, it leverages the Gemini API for context-aware Q&A within each article.

---

## 🚀 Live Demo & Repository

| Aspect | Detail |
|--------|---------|
| Live Demo Link | [https://pass-the-torch.vercel.app/] |
| Code Repository | [https://github.com/chaitanya-mutyala/PassTheTorch-.git](https://github.com/chaitanya-mutyala/PassTheTorch-.git) |
| Contribution | Made with 💙 by Chaitanya Mutyala |

---

## ✨ Key Features

### 1. Structured Content & Dual Database Model
- To handle comprehensive placement narratives and avoid database column limits, the content is split into two linked Appwrite collections:
  - **Main Articles Collection**: Stores lightweight, searchable metadata (Student Name, Role, Company, Batch Year, Status).
  - **Article Details Collection (Secondary)**: Stores the large, unstructured text content for each section (postJourney, postStrategy, etc.), linked via the article's unique ID (slug).

### 2. Context-Aware AI Chatbot
- **Purpose**: The chatbot acts as an AI mentor that provides answers strictly based on the content of the currently viewed post.
- **Technology**: Directly integrates the Gemini API via client-side fetch (using necessary environment variables for security).
- **Functionality**: Summarizes sections, elaborates on experiences, and provides fallback responses if info is missing in the article.

### 3. Enhanced UI/UX
- **Home Page**: Sharp, filterable cards with student photos, names, and subtle hover effects.
- **Post Details**: Displays a large circular student photo, key metadata (Name, Role, Dept, Batch), and uses collapsible sections for easy navigation.

### 4. Custom Slug Generation
- **Format**: `[Student Name]-[Department]-[Batch Year]` (e.g., `p-l-hareesh-cse-2025`).

### 5. Additional Features
- Rich Text Editing using **TinyMCE**.  
- Image upload supported via **Appwrite Storage**.  
- Secure Authentication powered by **Appwrite**.  
- **Role-Based Access**:  
  - **All users (juniors + seniors):** Can view posts and access the home page and all posts page.  
  - **Seniors:** Can create accounts to access **Add Post** functionality and edit/delete their posts.  
  - **Juniors:** Can interact with the **AI Q/A chatbot** to ask context-based questions.  

## ⚙️ Tech Stack

- **Frontend**: React (Vite)
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Backend Services**: Appwrite (Authentication, Database, Storage)
- **Generative AI**: Google Gemini API
- **Rich Text Editor**: TinyMCE

---

## 🛠️ Setup and Installation

### 1. Clone the Repository
```bash
git clone https://github.com/chaitanya-mutyala/PassTheTorch-.git
cd PassTheTorch-
```

### 2. Install Dependencies
```bash
npm install
# Install Lucide icons for UI:
npm install lucide-react
```

### 3. Configure Environment Variables
Set up your Appwrite instance (self-hosted or Appwrite Cloud). Create a `.env.local` file in your project root with the following:

```env
# Appwrite Configuration
VITE_APPWRITE_URL=https://[YOUR_APPWRITE_ENDPOINT]/v1
VITE_APPWRITE_PROJECT_ID=[YOUR_PROJECT_ID]
VITE_APPWRITE_DATABASE_ID=[YOUR_DATABASE_ID]
VITE_APPWRITE_COLLECTION_ID=[MAIN_ARTICLES_COLLECTION_ID]
VITE_APPWRITE_COLLECTION_ID2=[ARTICLE_DETAILS_COLLECTION_ID]
VITE_APPWRITE_BUCKET_ID=[YOUR_STORAGE_BUCKET_ID]

# AI Service Configuration
VITE_GEMINI_API_KEY=[YOUR_GEMINI_API_KEY]

# Rich Text Editor (TinyMCE)
VITE_TINYMCE_API_KEY=[YOUR_TINYMCE_KEY]
```

### 4. Run Locally
```bash
npm run dev
```



---

## 🤝 Contribution
Contributions are welcome! Please fork this repository and submit a pull request for any enhancements.

---

## 📜 License
This project is licensed under the MIT License.

---
