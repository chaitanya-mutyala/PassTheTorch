import React from 'react'
import appwriteService from "../appwrite/config"
import { Link } from 'react-router-dom'

// NOTE: Added 'dept' to props as it's part of the new structural requirement
function PostCard({ $id, title, featuredImage, companyName, role, batchYear, placementType, dept }) {
    
    // Fallback content if the image is missing
    // 💡 UPDATED: Uses the w-32/h-32 dimensions and centers the placeholder text
    const ImagePlaceholder = () => (
        <div className='w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center border-4 border-indigo-100'>
            <span className='text-gray-500 text-sm font-medium'>No Photo</span>
        </div>
    );
    
    return (
        <Link to={`/post/${$id}`}>
            <div className='w-full bg-white rounded-2xl p-6 shadow-md hover:shadow-xl hover:translate-y-[-2px] transition-all duration-300 border border-gray-100 flex flex-col items-center text-center h-full'>
                
                {/* 💡 IMAGE CONTAINER: Changed from h-40/rounded-xl to fixed 32x32 circular size */}
                <div className='w-32 h-32 mb-5 rounded-full overflow-hidden border-4 border-indigo-100 shadow-sm flex items-center justify-center'>
                    {featuredImage ? (
                        <img
                            src={appwriteService.getFilePreview(featuredImage)}
                            alt={title || "Student Photo"}
                            // 💡 Applied object-cover to ensure image fills the circle
                            className='w-full h-full object-cover'
                        />
                    ) : (
                        // Placeholder is rendered directly inside the circular container div
                        <ImagePlaceholder />
                    )}
                </div>
                
                {/* 💡 STUDENT NAME (Title) and Subtext */}
                <h2 className='text-2xl font-bold text-gray-900 mb-1'>{title}</h2>
                <p className="text-base text-gray-600 mb-4">{dept || 'Unknown Dept'} | Batch {batchYear}</p>


                {/* Placement Info: Styling updated for better hierarchy */}
                <div className="text-sm text-gray-700 space-y-2 border-t border-gray-200 pt-4 w-full text-left">
                    <p><span className="font-semibold text-gray-800">Company:</span> {companyName}</p>
                    <p><span className="font-semibold text-gray-800">Role:</span> {role}</p>
                    <p><span className="font-semibold text-gray-800">Type:</span> {placementType}</p>
                </div>
            </div>
        </Link>
    )
}

export default PostCard