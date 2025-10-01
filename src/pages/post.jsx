import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import ChatBot from "../components/ChatBot"; // 💡 1. IMPORT CHATBOT

// Helper function to conditionally render a collapsible section
const CollapsibleSection = ({ title, content, defaultOpen = false }) => {
    // Check if content exists and is not just empty HTML tags (like <p></p>)
    const hasContent = content && (content.replace(/<[^>]*>/g, '').trim().length > 0);
    
    // Do not render the section if there is no content
    if (!hasContent) return null;

    return (
        // Using <details> and <summary> for native, accessible collapsing
        <details className="border rounded-lg p-3" open={defaultOpen}>
            <summary className="cursor-pointer font-semibold text-lg hover:text-indigo-600 transition">
                {title}
            </summary>
            {/* The actual content, parsed as HTML */}
            <div className="mt-2 pl-3 border-l-2 border-gray-200">
                {parse(content)}
            </div>
        </details>
    );
};


export default function Post() {
    const [post, setPost] = useState(null);
    const { slug } = useParams();
    const navigate = useNavigate();

    const userData = useSelector((state) => state.auth.userData);
    const isAuthor = post && userData ? post.userID === userData.$id : false;

    useEffect(() => {
        if (slug) {
            // 💡 2. UPDATE: Fetch both the main article and the detail article
            appwriteService.getPost(slug).then(async (mainPost) => { 
                if (mainPost) {
                    // Fetch the detail post from the secondary collection
                    const detailPost = await appwriteService.getArticleDetails(mainPost.$id);
                    
                    // Merge and set the post state
                    if (detailPost) {
                        setPost({ ...mainPost, ...detailPost });
                    } else {
                        // Handle case where detail post is missing (shouldn't happen, but safe)
                        setPost(mainPost);
                    }
                } else {
                    navigate("/");
                }
            });
        } else navigate("/");
    }, [slug, navigate]);

    const deletePost = () => {
        appwriteService.deletePost(post.$id).then((status) => {
            if (status) {
                appwriteService.deleteFile(post.featuredImage);
                // NOTE: You should also delete the detail document from the secondary collection here!
                // await appwriteService.deleteArticleDetails(post.$id); 
                navigate("/");
            }
        });
    };

    return post ? (
        <div className="py-8">
            <Container>
                {/* ... (Existing code for image and edit/delete buttons) ... */}
                <div className="w-full flex justify-center mb-4 relative border rounded-xl p-2">
                    {/* Only render image if featuredImage exists */}
                    {post.featuredImage && (
                        <img
                            src={appwriteService.getFilePreview(post.featuredImage)}
                            alt={post.title}
                            className="rounded-xl max-h-96 object-cover"
                        />
                    )}

                    {isAuthor && (
                        <div className="absolute right-6 top-6">
                            <Link to={`/edit-post/${post.$id}`}>
                                <Button bgColor="bg-green-500" className="mr-3">
                                    Edit
                                </Button>
                            </Link>
                            <Button bgColor="bg-red-500" onClick={deletePost}>
                                Delete
                            </Button>
                        </div>
                    )}
                </div>

                <div className="w-full mb-6">
                    <h1 className="text-4xl font-extrabold text-gray-900">{post.title}</h1>
                </div>

                {/* Placement Info (Summary Info) */}
                <div className="mb-8 p-4 border-l-4 border-indigo-500 bg-gray-50 rounded-r-lg shadow-md text-gray-800 space-y-2">
                    <p><span className="font-semibold text-indigo-700">Company:</span> {post.companyName}</p>
                    <p><span className="font-semibold text-indigo-700">Role:</span> {post.role}</p>
                    <p><span className="font-semibold text-indigo-700">Batch:</span> {post.batchYear}</p>
                    <p><span className="font-semibold text-indigo-700">Type:</span> {post.placementType}</p>
                    {post.tags?.length > 0 && (
                        <p className="pt-2 border-t border-gray-200">
                            <span className="font-semibold text-indigo-700">Tags:</span>{" "}
                            {post.tags.join(", ")}
                        </p>
                    )}
                </div>

                {/* Structured Collapsible Sections (using the merged post data) */}
                <div className="structured-content space-y-6">

                    <CollapsibleSection 
                        title="About in brief (Intro/Summary)" 
                        content={post.content} 
                        defaultOpen={true}
                    />
                    <CollapsibleSection 
                        title="🚀 Placement Journey & Process" 
                        content={post.postJourney} 
                    />
                    <CollapsibleSection 
                        title="🧠 Detailed Experiences & Interview Rounds" 
                        content={post.postExperiences} 
                    />
                    <CollapsibleSection 
                        title="📚 Preparation Strategy & Resources" 
                        content={post.postStrategy} 
                    />
                    <CollapsibleSection 
                        title="💡 Advice for Future Juniors" 
                        content={post.postAdvice} 
                    />
                </div>
            </Container>
            
            {/* 💡 3. RENDER CHATBOT (Only renders when post is loaded and available) */}
            <ChatBot post={post} /> 
            
        </div>
    ) : null;
}