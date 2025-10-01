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

    // Create Post
    async createPost({ title, slug, content, featuredImage, status, userID, companyName, role, batchYear, placementType, tags,dept }) {
        try {
            return await this.databases.createDocument(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_COLLECTION_ID,
                slug,
                {
                    title,
                    content,
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
            throw err; 
        }
    }

    // Update Post
    async updatePost(slug, { title, content, featuredImage, status, companyName, role, batchYear, placementType, tags,dept }) {
        try {
            return await this.databases.updateDocument(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_COLLECTION_ID,
                slug,
                {
                    title,
                    content,
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
            return null;
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
    // ... (omitted for brevity, assume correct)

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
        // 💡 FIX: Return the full, explicitly generated URL string
        if (!fileId) return null;
        return this.bucket.getFilePreview(
            import.meta.env.VITE_APPWRITE_BUCKET_ID,
            fileId
        ).toString(); // 🎯 Changed to explicitly return the string URL
    }
}

const service = new Service();
export default service;
