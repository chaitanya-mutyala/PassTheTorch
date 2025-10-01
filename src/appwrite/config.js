import { Client, Account, ID, Databases, Storage, Query } from "appwrite";

export class Service {
    client = new Client();
    databases;
    bucket;

    constructor() {
        this.client
            .setEndpoint(import.meta.env.VITE_APPWRITE_URL)
            .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID)
            
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    // --- Core Post Operations (Main Collection) ---

    // Create Post (now excludes large content fields)
    async createPost({ title, slug, content, featuredImage, status, userID, companyName, role, batchYear, placementType, tags,dept }) {
        try {
            // NOTE: The 'content' field remains here, assumed to be the 'Intro/Summary'
            return await this.databases.createDocument(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_COLLECTION_ID,
                slug, // documentId
                {
                    title,
                    content, // Intro/Summary
                    featuredImage,
                    status,
                    userID,
                    companyName,
                    role,
                    batchYear,
                    placementType,
                    tags,
                    dept
                }
            );
        } catch (err) {
            console.log("CreatePost Error:", err);
            throw err; // Re-throw error for PostForm.jsx to handle
        }
    }

    // Update Post (now excludes large content fields)
    async updatePost(slug, { title, content, featuredImage, status, companyName, role, batchYear, placementType, tags,dept }) {
        try {
            // NOTE: The 'content' field remains here, assumed to be the 'Intro/Summary'
            return await this.databases.updateDocument(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_COLLECTION_ID,
                slug,
                {
                    title,
                    content, // Intro/Summary
                    featuredImage,
                    status,
                    companyName,
                    role,
                    batchYear,
                    placementType,
                    tags,
                    dept
                }
            );
        } catch (err) {
            console.log("UpdatePost Error:", err);
            throw err;
        }
    }

    // Delete Post
    async deletePost(slug) {
        try {
            await this.databases.deleteDocument(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_COLLECTION_ID,
                slug
            );
            return true;
        } catch (err) {
            console.log("DeletePost Error:", err);
            return false;
        }
    }

    // Get Single Post
    async getPost(slug) {
        try {
            return await this.databases.getDocument(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_COLLECTION_ID,
                slug
            );
        } catch (err) {
            console.log("GetPost Error:", err);
            return null; // Return null if not found
        }
    }

    // Get Multiple Posts
    async getPosts(queries = [Query.equal("status", "active")]) {
        try {
            return await this.databases.listDocuments(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_COLLECTION_ID,
                queries
            );
        } catch (err) {
            console.log("GetPosts Error:", err);
            return false;
        }
    }

    // --- Detailed Content Operations (Secondary Collection) ---

    // 💡 CREATE detail document
    async createArticleDetails({ slug, postJourney, postExperiences, postStrategy, postAdvice }) {
        try {
            return await this.databases.createDocument(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_COLLECTION_ID2, // 🎯 USING COLLECTION ID 2
                slug, // Use slug as document ID (primary key in this collection)
                {
                    articleSlug: slug,
                    postJourney,
                    postExperiences,
                    postStrategy,
                    postAdvice,
                }
            );
        } catch (error) {
            console.error("CreateArticleDetails Error:", error);
            throw error;
        }
    }

    // 💡 UPDATE detail document
    async updateArticleDetails(slug, { postJourney, postExperiences, postStrategy, postAdvice }) {
        try {
            return await this.databases.updateDocument(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_COLLECTION_ID2, // 🎯 USING COLLECTION ID 2
                slug, // Use slug as document ID
                {
                    postJourney,
                    postExperiences,
                    postStrategy,
                    postAdvice,
                }
            );
        } catch (error) {
            console.error("UpdateArticleDetails Error:", error);
            throw error;
        }
    }

    // 💡 GET detail document
    async getArticleDetails(slug) {
        try {
            return await this.databases.getDocument(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_COLLECTION_ID2, // 🎯 USING COLLECTION ID 2
                slug // Use slug as document ID
            );
        } catch (error) {
            // Note: If the document doesn't exist, getDocument will throw an error.
            // We return null so the Post.jsx component can gracefully handle a missing details document.
            console.error("GetArticleDetails Error:", error);
            return null; 
        }
    }

    // --- File Storage Operations ---

    // Upload File
    async uploadFile(file) {
        try {
            return await this.bucket.createFile(
                import.meta.env.VITE_APPWRITE_BUCKET_ID,
                ID.unique(),
                file
            );
        } catch (err) {
            console.log("UploadFile Error:", err);
            return false;
        }
    }

    // Delete File
    async deleteFile(fileId) {
        try {
            await this.bucket.deleteFile(
                import.meta.env.VITE_APPWRITE_BUCKET_ID,
                fileId
            );
            return true;
        } catch (err) {
            console.log("DeleteFile Error:", err);
            return false;
        }
    }

    // File Preview
    getFilePreview(fileId) {
        return this.bucket.getFilePreview(
            import.meta.env.VITE_APPWRITE_BUCKET_ID,
            fileId
        );
    }
}

const service = new Service();
export default service;