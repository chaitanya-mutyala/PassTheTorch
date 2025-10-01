import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "../index.js";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import DraftChatBot from "../ChatBot"; 

export default function PostForm({ post }) {
    const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
        defaultValues: {
            title: post?.title || "", 
            slug: post?.$id || "",
            content: post?.content || "", 
            status: post?.status || "active",
            companyName: post?.companyName || "",
            role: post?.role || "",
            batchYear: post?.batchYear || "",
            placementType: post?.placementType || "",
            tags: post?.tags?.join(", ") || "", 
            dept: post?.dept || "", 
            postJourney: post?.postJourney || "",
            postExperiences: post?.postExperiences || "",
            postStrategy: post?.postStrategy || "",
            postAdvice: post?.postAdvice || "",
        },
    });

    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);

    const submit = async (data) => {
        
        const userID = userData?.$id; 

        // 🛑 CRITICAL CHECK: Block submission if user data is missing
        if (!userID) {
            alert("Error: You must be logged in to submit a placement story. Please refresh or log in again."); 
            console.error("Submission blocked: User ID is missing in Redux store.");
            return; // STOP the function here
        }
        
        try {
            // Step 1: Handle file upload
            let fileId = post?.featuredImage || null; 

            if (data.image && data.image.length > 0) {
                const file = await appwriteService.uploadFile(data.image[0]);
                if (file) {
                    fileId = file.$id;
                    if (post?.featuredImage) {
                        await appwriteService.deleteFile(post.featuredImage);
                    }
                }
            }

            // Transform tags
            const tagsArray = data.tags
                ? data.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
                : [];

            // Payloads separated for the two Appwrite collections
            const mainPostPayload = {
                title: data.title, 
                slug: data.slug,
                content: data.content,
                status: data.status,
                companyName: data.companyName,
                role: data.role,
                batchYear: data.batchYear,
                placementType: data.placementType,
                tags: tagsArray,
                userID: userID, // 💡 Sending the now-validated userID
                featuredImage: fileId,
                dept: data.dept, 
            };
            
            const detailPayload = {
                slug: data.slug,
                postJourney: data.postJourney,
                postExperiences: data.postExperiences,
                postStrategy: data.postStrategy,
                postAdvice: data.postAdvice,
            };

            let dbPost;
            if (post) {
                // Update Main Article Document
                dbPost = await appwriteService.updatePost(post.$id, mainPostPayload);
                // Update Details Document
                await appwriteService.updateArticleDetails(post.$id, detailPayload);
            } else {
                // Create Main Article Document
                dbPost = await appwriteService.createPost(mainPostPayload);
                if (dbPost) {
                    // Create Details Document using the new dbPost.$id
                    await appwriteService.createArticleDetails({
                        ...detailPayload,
                        slug: dbPost.$id,
                    });
                }
            }

            if (dbPost) {
                navigate(`/post/${dbPost.$id}`);
            }
        } catch (err) {
            console.error("Post submission error:", err);
            // This will catch the Appwrite errors and any subsequent errors.
        }
    };

    const slugTransform = useCallback((value) => {
        const { title, dept, batchYear } = getValues();
        
        if (title && dept && batchYear) {
            const combined = `${title} ${dept} ${batchYear}`;
            return combined
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s/g, "-");
        }
        
        if (typeof value === "string") {
             return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s/g, "-");
        }
        return "";
    }, [getValues]);

    React.useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title" || name === "dept" || name === "batchYear") {
                const newSlug = slugTransform(value);
                setValue("slug", newSlug, { shouldValidate: true });
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);


    return (
        // 💡 Render Fragment to allow Chatbot placement outside form
        <>
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap bg-white p-6 rounded-xl shadow-lg border border-gray-100 mx-auto max-w-7xl mb-12">
            <div className="w-2/3 px-2">
                <Input
                    label="Student's Full Name (Title) :"
                    placeholder="e.g. Chaitanya Mutyala"
                    className="mb-4 border border-gray-300 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
                    {...register("title", { required: true })}
                />
                
                <Input
                    label="Department / Branch :"
                    placeholder="e.g. Computer Science Engineering (CSE)"
                    className="mb-4 border border-gray-300 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
                    {...register("dept", { required: true })}
                />
                
                <Input
                    label="Slug (URL Identifier) :"
                    placeholder="Auto-generated based on Name, Dept, and Batch"
                    className="mb-4 bg-gray-100 border border-gray-300 rounded-lg p-2 text-gray-600"
                    readOnly
                    {...register("slug", { required: true })}
                />

                <Input
                    label="Company Name :"
                    placeholder="e.g. Microsoft"
                    className="mb-4 border border-gray-300 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
                    {...register("companyName", { required: true })}
                />
                <Input
                    label="Role / Designation :"
                    placeholder="e.g. SDE Intern"
                    className="mb-4 border border-gray-300 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
                    {...register("role", { required: true })}
                />
                <Input
                    label="Batch Year :"
                    type="number"
                    placeholder="e.g. 2025"
                    className="mb-4 border border-gray-300 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
                    {...register("batchYear", { required: true, valueAsNumber: true })}
                />
                <Select
                    options={["On-Campus", "Off-Campus"]}
                    label="Placement Type"
                    className="mb-4 border border-gray-300 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
                    {...register("placementType", { required: true })}
                />
                <Input
                    label="Preparation Tags (comma separated):"
                    placeholder="e.g. DSA, Projects, ML"
                    className="mb-4 border border-gray-300 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
                    {...register("tags")}
                />


                {/* 💡 The structured fields are now regular text inputs (multi-line via classes) */}
                <h2 className="text-2xl font-bold mt-8 mb-4 text-indigo-700">Detailed Content Sections</h2>
                
                <Input
                    label="Journey/Process Summary (Textarea) :"
                    placeholder="Describe your overall recruitment timeline and process steps..."
                    className="mb-4 border border-gray-300 rounded-lg p-2 min-h-[100px] focus:ring-indigo-500 focus:border-indigo-500" // min-h for visual textarea look
                    {...register("postJourney")} 
                    rows={4} // Pass rows prop if your Input component supports rendering textarea
                />
                <Input
                    label="Detailed Experiences (Textarea) :"
                    placeholder="Detailed notes on interview rounds, questions asked, and challenges faced."
                    className="mb-4 border border-gray-300 rounded-lg p-2 min-h-[100px] focus:ring-indigo-500 focus:border-indigo-500"
                    {...register("postExperiences")} 
                    rows={4}
                />
                <Input
                    label="Preparation Strategy (Textarea) :"
                    placeholder="What resources did you use? How long did you prepare? Include tips."
                    className="mb-4 border border-gray-300 rounded-lg p-2 min-h-[100px] focus:ring-indigo-500 focus:border-indigo-500"
                    {...register("postStrategy")} 
                    rows={4}
                />
                <Input
                    label="Advice for Juniors (Textarea) :"
                    placeholder="Specific recommendations for students in junior years."
                    className="mb-4 border border-gray-300 rounded-lg p-2 min-h-[100px] focus:ring-indigo-500 focus:border-indigo-500"
                    {...register("postAdvice")} 
                    rows={4}
                />

                {/* 💡 RTE is kept ONLY for the Intro/Summary field */}
                <RTE
                    label="About in brief (Intro/Summary - Rich Text) :"
                    name="content"
                    control={control}
                    defaultValue={getValues("content")} 
                />
                
            </div>
            <div className="w-1/3 px-2">
                <Input
                    label="Student's Photo (Featured Image) :"
                    type="file"
                    className="mb-4 border border-gray-300 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", { required: false })} 
                />
                {post && post.featuredImage && (
                    <div className="w-full mb-4 p-2 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-sm font-semibold mb-2">Current Photo:</p>
                        <img
                            src={appwriteService.getFilePreview(post.featuredImage)}
                            alt={post.title}
                            className="rounded-lg object-cover w-full h-48"
                        />
                    </div>
                )}
                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4 border border-gray-300 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
                    {...register("status", { required: true })}
                />
                {/* 💡 Button Style Update */}
                <Button 
                    type="submit" 
                    bgColor={post ? "bg-indigo-600" : "bg-green-600"} 
                    className="w-full py-3 text-lg font-semibold rounded-lg shadow-md hover:opacity-90 transition-opacity"
                >
                    {post ? "Update Story" : "Submit Story"}
                </Button>
            </div>
        </form>
        
        {/* 💡 RENDER CHATBOT (Authoring Assistant) */}
        {/* The Chatbot logic is now available on the form page */}
        <DraftChatBot getFormValues={getValues} />
        </>
    );
}
