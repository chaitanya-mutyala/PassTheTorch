import React, { useEffect, useState } from 'react'
import appwriteService from "../appwrite/config";
import { Container, PostCard } from '../components'
import { Query } from 'appwrite'; // Import Query for potential future dynamic filtering

function Home() {
    const [posts, setPosts] = useState([])
    const [filters, setFilters] = useState({ company: "", role: "", type: "", batch: "", dept: "" }) // 💡 Added dept to filters
    const [loading, setLoading] = useState(true); // 💡 Added loading state for better UX

    useEffect(() => {
        // 💡 Fetching only 'active' posts (default query, can be expanded)
        appwriteService.getPosts([Query.equal("status", "active")]).then((posts) => {
            if (posts) {
                setPosts(posts.documents);
            }
            setLoading(false); // Set loading to false after fetch
        });
    }, []);

    // Memoize filtered posts for performance if filters change frequently
    const filteredPosts = React.useMemo(() => {
        return posts.filter(post => {
            return (
                (filters.company ? post.companyName?.toLowerCase().includes(filters.company.toLowerCase()) : true) &&
                (filters.role ? post.role?.toLowerCase().includes(filters.role.toLowerCase()) : true) &&
                (filters.type ? post.placementType === filters.type : true) &&
                (filters.batch ? String(post.batchYear) === filters.batch : true) &&
                (filters.dept ? post.dept?.toLowerCase().includes(filters.dept.toLowerCase()) : true) // 💡 Filter by Department
            );
        });
    }, [posts, filters]); // Recalculate only when posts or filters change

    // If no posts or loading, show a message
    if (loading) {
        // 💡 Enhanced Loading State: Skeleton loader or a simple message
        return (
            <div className='w-full py-8 text-center text-xl text-gray-600 bg-gray-50 min-h-screen flex items-center justify-center'>
                Loading placement stories...
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className='w-full py-8 text-center text-xl text-gray-600 bg-gray-50 min-h-screen flex items-center justify-center'>
                <Container>
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">No Placement Stories Available</h1>
                    <p className="text-lg text-gray-600">Be the first to share your experience!</p>
                </Container>
            </div>
        );
    }

    return (
        // 💡 UPDATED: Overall page background and padding
        <div className='w-full py-10 bg-gray-50 min-h-screen'>
            <Container>
                {/* 💡 UPDATED: Filter Controls Container */}
                <div className="w-full bg-white rounded-2xl p-6 shadow-lg mb-10 flex flex-wrap items-center justify-start gap-4">
                    <span className="text-xl font-semibold text-gray-800 mr-2">Filter:</span> {/* Added a filter label */}
                    
                    {/* 💡 UPDATED: Input Field Styling */}
                    <input
                        type="text"
                        placeholder="Company"
                        className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all duration-200 shadow-sm"
                        value={filters.company}
                        onChange={(e) => setFilters({ ...filters, company: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Role"
                        className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all duration-200 shadow-sm"
                        value={filters.role}
                        onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                    />
                     {/* 💡 NEW FILTER: Department */}
                    <input
                        type="text"
                        placeholder="Department"
                        className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all duration-200 shadow-sm"
                        value={filters.dept}
                        onChange={(e) => setFilters({ ...filters, dept: e.target.value })}
                    />
                    {/* 💡 UPDATED: Select Field Styling */}
                    <select
                        className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all duration-200 shadow-sm bg-white appearance-none pr-8" // appearance-none and pr-8 for custom arrow
                        value={filters.type}
                        onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                    >
                        <option value="">All Types</option>
                        <option value="On-Campus">On-Campus</option>
                        <option value="Off-Campus">Off-Campus</option>
                    </select>
                    <input
                        type="number" // Changed to type="number" for proper batch year input
                        placeholder="Batch Year"
                        className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all duration-200 shadow-sm"
                        value={filters.batch}
                        onChange={(e) => setFilters({ ...filters, batch: e.target.value })}
                    />
                     {/* You might want a clear filters button here */}
                     <button 
                        onClick={() => setFilters({ company: "", role: "", type: "", batch: "", dept: "" })}
                        className="ml-auto px-4 py-2 rounded-full bg-indigo-500 text-white font-semibold hover:bg-indigo-600 transition-all duration-200 shadow-md"
                     >
                        Clear Filters
                    </button>
                </div>

                {/* 💡 UPDATED: Post Cards Grid - Responsive columns and gap */}
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                    {filteredPosts.map((post) => (
                        <div key={post.$id}> {/* The div around PostCard is necessary for grid to work */}
                            <PostCard {...post} />
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    );
}

export default Home