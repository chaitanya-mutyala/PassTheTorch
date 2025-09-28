import { Client, Account, ID } from "appwrite";

export class AuthService {
    client = new Client();
    account;

    constructor() {
        this.client
            .setEndpoint(import.meta.env.VITE_APPWRITE_URL)
            .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

        this.account = new Account(this.client);
    }

    // Create user account and immediately log them in
    async createAccount({ email, password, name }) {
        try {
            const userAcc = await this.account.create(
                ID.unique(),
                email,
                password,
                name
            );

            // Automatically login after creating account
            return await this.login({ email, password });
        } catch (err) {
            throw err;
        }
    }

    // Login
    async login({ email, password }) {
        try {
            const session = await this.account.createEmailPasswordSession(
                email,
                password
            );
            return session;
        } catch (err) {
            throw err;
        }
    }

    // Get current logged-in user
    async getCurrentUser() {
        try {
            const user = await this.account.get();
            return user; // return user data if logged in
        } catch (err) {
            console.log("Not logged in:", err);
            return null;
        }
    }

    // Logout (delete all sessions)
    async logout() {
        try {
            const result = await this.account.deleteSessions();
            return result;
        } catch (err) {
            console.log("Logout error:", err);
        }
    }
}

const authService = new AuthService();
export default authService;
