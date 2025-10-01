import React from 'react'
import appwriteService from "../appwrite/config"
import { Link } from 'react-router-dom'

function PostCard({ $id, title, featuredImage, companyName, role, batchYear, placementType }) {
    
    // Fallback content if the image is missing
    const ImagePlaceholder = () => (
        <div className='w-full h-40 bg-gray-300 flex items-center justify-center rounded-xl'>
            <span className='text-gray-500 text-sm font-medium'>No Image</span>
        </div>
    );
    
    return (
        <Link to={`/post/${$id}`}>
            <div className='w-full bg-gray-100 rounded-xl p-4 hover:shadow-lg transition duration-300 border border-gray-200'>
                
                {/* Image Section - Ensures consistent height (h-40) */}
                <div className='w-full flex justify-center mb-4 overflow-hidden rounded-xl h-40'>
                    {featuredImage ? (
                        <img
                            src={appwriteService.getFilePreview(featuredImage)}
                            alt={title || "Post thumbnail"}
                            className='w-full h-full object-cover' // Changed to fill the 160px height
                        />
                    ) : (
                        <ImagePlaceholder />
                    )}
                </div>
                
                <h2 className='text-xl font-bold mb-2 text-gray-800'>{title}</h2>

                {/* ✅ Placement Info */}
                <div className="text-sm text-gray-600 space-y-1">
                    <p><span className="font-semibold text-gray-800">Company:</span> {companyName}</p>
                    <p><span className="font-semibold text-gray-800">Role:</span> {role}</p>
                    <p><span className="font-semibold text-gray-800">Batch:</span> {batchYear}</p>
                    <p><span className="font-semibold text-gray-800">Type:</span> {placementType}</p>
                </div>
            </div>
        </Link>
    )
}

export default PostCard