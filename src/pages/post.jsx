import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import ChatBot from "../components/ChatBot"; 

// Helper function to conditionally render a collapsible section (omitted for brevity)
const CollapsibleSection = ({ title, content, defaultOpen = false, icon = '' }) => {
    const hasContent = content && (content.replace(/<[^>]*>/g, '').trim().length > 0);
    if (!hasContent) return null;
    return (
        <details className="py-2 border-b border-gray-100 transition duration-300" open={defaultOpen}>
            <summary className="cursor-pointer text-lg font-semibold text-indigo-700 hover:text-indigo-800 flex items-center py-2">
                {icon && <span className="mr-2 text-xl">{icon}</span>}
                {title}
            </summary>
            <div className="mt-3 pl-6 text-gray-900 leading-relaxed prose max-w-none">
                {parse(content)}
            </div>
        </details>
    );
};


export default function Post() {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true); // 💡 RESTORED: Loading State
    const { slug } = useParams();
    const navigate = useNavigate();

    const userData = useSelector((state) => state.auth.userData);
    const isAuthor = post && userData ? post.userID === userData.$id : false;

    useEffect(() => {
        if (slug) {
            setLoading(true); // Start loading
            appwriteService.getPost(slug).then(async (mainPost) => { 
                let fullPost = mainPost; // Initialize with main post data
                
                if (mainPost) {
                    try {
                        // 1. Attempt to fetch details. If this fails, the catch block runs.
                        const detailPost = await appwriteService.getArticleDetails(mainPost.$id);
                        
                        // Merge data only if detailPost is successfully retrieved (not null)
                        if (detailPost) {
                            fullPost = { ...mainPost, ...detailPost };
                        }

                    } catch (e) {
                        // 2. ERROR RECOVERY: If the secondary document is missing (e.g., old post), 
                        // we gracefully proceed without the detailed content.
                        console.warn(`Details document not found or failed to fetch for ID: ${mainPost.$id}.`);
                    }
                    
                    setPost(fullPost); // 3. Set state with merged or main-only data
                } else {
                    // Main post not found, navigate away
                    navigate("/");
                }
                
                // 🛑 Ensure loading state ends regardless of success/failure
                setLoading(false);
            });
        } else {
            navigate("/");
        }
    }, [slug, navigate]);

    const deletePost = () => {
        if (window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
            // Delete secondary document first
            appwriteService.deleteArticleDetails(post.$id).then(() => {
                // Then delete main post
                appwriteService.deletePost(post.$id).then((status) => {
                    if (status) {
                        // Finally, delete file
                        appwriteService.deleteFile(post.featuredImage);
                        navigate("/");
                    }
                });
            }).catch(error => {
                console.error("Failed to delete post components:", error);
            });
        }
    };

    // 💡 Render Loading State
    if (loading) {
        return (
            <div className="py-12 bg-white min-h-screen flex items-center justify-center">
                <p className="text-xl text-indigo-700 font-semibold">Loading placement story...</p>
            </div>
        );
    }
    
    // ... (rest of the return post ? (...) : null)
    return post ? (
        <div className="py-12 bg-white min-h-screen"> 
            <Container className="relative">
                
                {isAuthor && (
                    <div className="absolute top-0 right-0 flex space-x-3 z-10">
                        <Link to={`/edit-post/${post.$id}`}>
                            <Button 
                                bgColor="bg-green-600 hover:bg-green-700" 
                                className="px-5 py-2 text-white font-semibold rounded-full shadow-md transition-all"
                            >
                                Edit
                            </Button>
                        </Link>
                        <Button 
                            bgColor="bg-red-600 hover:bg-red-700" 
                            onClick={deletePost}
                            className="px-5 py-2 text-white font-semibold rounded-full shadow-md transition-all"
                        >
                            Delete
                        </Button>
                    </div>
                )}
                
                
                <div className="max-w-4xl mx-auto pt-10">
                    
                    
                    <div className="w-full flex flex-col items-center mb-10 pb-6 border-b border-gray-200">
                        
                        {post.featuredImage ? (
                            <img
                                src={appwriteService.getFilePreview(post.featuredImage)}
                                alt={post.title}
                                className="rounded-full h-40 w-40 object-cover border-4 border-indigo-200 shadow-xl mb-4"
                            />
                        ) : (
                            <div className="h-40 w-40 bg-gray-100 rounded-full flex items-center justify-center mb-4 border-4 border-indigo-200 shadow-xl">
                                <span className="text-gray-500 font-semibold">No Photo</span>
                            </div>
                        )}
                        
                        
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-1 text-center leading-tight">{post.title}</h1>
                        
                        <p className="text-xl text-gray-700 font-medium text-center">{post.role} @ {post.companyName}</p>
                    </div>

                    
                    <div className="flex justify-center flex-wrap gap-x-8 gap-y-2 text-lg text-gray-700 mb-12 border-b pb-8 border-gray-100">
                        {post.dept && <p><span className="font-semibold text-gray-800">Department:</span> {post.dept}</p>}
                        {post.batchYear && <p><span className="font-semibold text-gray-800">Batch:</span> {post.batchYear}</p>}
                        {post.placementType && <p><span className="font-semibold text-gray-800">Type:</span> {post.placementType}</p>}
                        {post.tags?.length > 0 && (
                            <div className="col-span-full mt-2 w-full text-center">
                                <span className="font-semibold text-gray-800 mr-2">Tags:</span>{" "}
                                {post.tags.map((tag, index) => (
                                    <span key={index} className="bg-indigo-50 text-indigo-700 text-sm px-3 py-1 rounded-full font-medium inline-block mr-2 mb-1 shadow-sm">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    
                    <div className="structured-content space-y-2">
                        
                        
                        <CollapsibleSection 
                            title="About in brief (Intro/Summary)" 
                            icon="📝" 
                            content={post.content} 
                            defaultOpen={true}
                        />
                        <CollapsibleSection 
                            title="🚀 Placement Journey & Process" 
                            icon="🗺️" 
                            content={post.postJourney} 
                        />
                        <CollapsibleSection 
                            title="🧠 Detailed Experiences & Interview Rounds" 
                            icon="💬" 
                            content={post.postExperiences} 
                        />
                        <CollapsibleSection 
                            title="📚 Preparation Strategy & Resources" 
                            icon="💡" 
                            content={post.postStrategy} 
                        />
                        <CollapsibleSection 
                            title="🌟 Advice for Future Juniors" 
                            icon="🎓" 
                            content={post.postAdvice} 
                        />
                    </div>
                </div>
            </Container>
            
            {!isAuthor && <ChatBot post={post} />} 
            
        </div>
    ) : null;
}
