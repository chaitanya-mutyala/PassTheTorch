import { Client, Account, ID ,Databases,Storage,Query} from "appwrite";

export class Service{
    client=new Client();
    databases;
    bucket;
    
    constructor(){
        this.client
            .setEndpoint(import.meta.env.VITE_APPWRITE_URL)
            .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID)
        this.databases = new Databases(this.client);
        this.bucket=new Storage(this.client);
    }
    async createPost({title,slug,content,featuredImage,status,userID}){
    try{
        return await this.databases.createDocument({
            databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
            collectionId: import.meta.env.VITE_APPWRITE_COLLECTION_ID,
            documentId:slug,
            data: {
                title: title,
                content: content,
                featuredImage: featuredImage,
                status: status,
                userID: userID // This is the explicit, corrected line
            },
        });
    }
    catch(err){
        console.log(err);
    }
}
    async updatepost(slug,{title,content,featuredImage,status}){
        try{
            return await this.databases.updateDocument({
    databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
    collectionId: import.meta.env.VITE_APPWRITE_COLLECTION_ID,
    documentId: slug,
    data: {
        title,
        content,
        featuredImage,
        status,
    }, // optional
    
});
        }
        catch(err){
            console.log(err);
        }
    }
    async deletePost(slug){
        try{
             await this.databases.deleteDocument({
    databaseId:import.meta.env.VITE_APPWRITE_DATABASE_ID,
    collectionId: import.meta.env.VITE_APPWRITE_COLLECTION_ID,
    documentId: slug
}); return true;
        }
        catch(err){
            console.log(err);
            return false;
        }
    }
    async getPost(slug){
        try{
            return await this.databases.getDocument({
    databaseId:import.meta.env.VITE_APPWRITE_DATABASE_ID,
    collectionId: import.meta.env.VITE_APPWRITE_COLLECTION_ID,
    documentId: slug
    
});
        }
        catch(err){
            console.log(err);
        }
    }
    async getPosts(queries=[Query.equal("status","active")]){
        try{
            return await this.databases.listDocuments(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
     import.meta.env.VITE_APPWRITE_COLLECTION_ID,
    queries,

            )


        }
        catch(err){
            console.log(err);
            return false;
        }

    }
    //file upload service
    async uploadFile(file){
        try{
            return await this.bucket.createFile({
    bucketId: import.meta.env.VITE_APPWRITE_BUCKET_ID,
    fileId: ID.unique(),
    file
});

        }
        catch(err){
            console.log(err);
            return false;
        }
    }
    async deleteFile(fileId){
        try{
            await this.bucket.deleteFile(
                import.meta.env.VITE_APPWRITE_BUCKET_ID,
                fileId
            )
            return true;

        }
        catch(err){
            console.log(err);
            return false;
        }
    
    }
    getFilePreview(fileId){
        return this.bucket.getFilePreview({
            bucketId:import.meta.env.VITE_APPWRITE_BUCKET_ID,
    fileId})}

    


}
const service= new Service()
export default service;