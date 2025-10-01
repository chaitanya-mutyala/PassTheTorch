import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "../index.js";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PostForm({ post }) {
    const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.$id || "",
            // The original 'content' field is now used for the 'Intro'
            content: post?.content || "", 
            status: post?.status || "active",

            // ✅ New fields for structured content
            companyName: post?.companyName || "",
            role: post?.role || "",
            batchYear: post?.batchYear || "",
            placementType: post?.placementType || "",
            tags: post?.tags?.join(", ") || "", 
            postJourney: post?.postJourney || "",
            postExperiences: post?.postExperiences || "",
            postStrategy: post?.postStrategy || "",
            postAdvice: post?.postAdvice || "",
        },
    });

    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);

    const submit = async (data) => {
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

            // ✅ transform tags from "a, b, c" → ["a","b","c"]
            const tagsArray = data.tags
                ? data.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
                : [];

            // 💡 Payloads are separated here for the two Appwrite collections
            const mainPostPayload = {
                title: data.title,
                slug: data.slug,
                content: data.content, // Intro/Summary
                status: data.status,
                companyName: data.companyName,
                role: data.role,
                batchYear: data.batchYear,
                placementType: data.placementType,
                tags: tagsArray,
                userID: userData?.$id || null,
                featuredImage: fileId,
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
                // ------------------------------------
                // 🟢 UPDATE LOGIC: TWO Appwrite Calls
                // ------------------------------------
                // 1. Update Main Article Document
                dbPost = await appwriteService.updatePost(post.$id, mainPostPayload);
                
                // 2. Update Details Document
                await appwriteService.updateArticleDetails(post.$id, detailPayload);

            } else {
                // ------------------------------------
                // 🟢 CREATE LOGIC: TWO Appwrite Calls
                // ------------------------------------
                // 1. Create Main Article Document
                dbPost = await appwriteService.createPost(mainPostPayload);

                if (dbPost) {
                    // 2. Create Details Document using the new dbPost.$id
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
            // You might want to show a user-friendly error message here
        }
    };

    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string")
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s/g, "-");

        return "";
    }, []);

    React.useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransform(value.title), { shouldValidate: true });
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
            <div className="w-2/3 px-2">
                <Input
                    label="Title :"
                    placeholder="Title"
                    className="mb-4"
                    {...register("title", { required: true })}
                />
                <Input
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-4"
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                />

                {/* ✅ New placement fields */}
                <Input
                    label="Company Name :"
                    placeholder="e.g. Microsoft"
                    className="mb-4"
                    {...register("companyName", { required: true })}
                />
                <Input
                    label="Role / Designation :"
                    placeholder="e.g. SDE Intern"
                    className="mb-4"
                    {...register("role", { required: true })}
                />
                <Input
                    label="Batch Year :"
                    type="number"
                    placeholder="e.g. 2025"
                    className="mb-4"
                    {...register("batchYear", { required: true })}
                />
                <Select
                    options={["On-Campus", "Off-Campus"]}
                    label="Placement Type"
                    className="mb-4"
                    {...register("placementType", { required: true })}
                />
                <Input
                    label="Preparation Tags (comma separated)"
                    placeholder="e.g. DSA, Projects, ML"
                    className="mb-4"
                    {...register("tags")}
                />


{/* Add separate RTEs for structured content */}
<RTE
    label="About in brief (Intro/Summary) :"
    name="content" // Use the 'content' field for the Intro/Summary
    control={control}
    defaultValue={getValues("content")} 
/>
<RTE
    label="Journey/Process Summary :"
    name="postJourney"
    control={control}
    defaultValue={getValues("postJourney")} 
/>
<RTE
    label="Detailed Experiences :"
    name="postExperiences"
    control={control}
    defaultValue={getValues("postExperiences")} 
/>
<RTE
    label="Preparation Strategy :"
    name="postStrategy"
    control={control}
    defaultValue={getValues("postStrategy")} 
/>
<RTE
    label="Advice for Juniors :"
    name="postAdvice"
    control={control}
    defaultValue={getValues("postAdvice")} 
/>
            </div>
            <div className="w-1/3 px-2">
                <Input
                    label="Featured Image :"
                    type="file"
                    className="mb-4"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    
                    // 🟢 Keep this as required: false to make the image optional
                    {...register("image", { required: false })} 
                    
                />
                {post && (
                    <div className="w-full mb-4">
                        <img
                            src={appwriteService.getFilePreview(post.featuredImage)}
                            alt={post.title}
                            className="rounded-lg"
                        />
                    </div>
                )}
                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4"
                    {...register("status", { required: true })}
                />
                <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full">
                    {post ? "Update" : "Submit"}
                </Button>
            </div>
        </form>
    );
}