import React, { useEffect, useState } from 'react'
import appwriteService from "../appwrite/config";
import { Container, PostCard } from '../components'

function Home() {
    const [posts, setPosts] = useState([])
    const [filters, setFilters] = useState({ company: "", role: "", type: "", batch: "" })

    useEffect(() => {
        appwriteService.getPosts().then((posts) => {
            if (posts) setPosts(posts.documents)
        })
    }, [])

    const filteredPosts = posts.filter(post => {
        return (
            (filters.company ? post.companyName?.toLowerCase().includes(filters.company.toLowerCase()) : true) &&
            (filters.role ? post.role?.toLowerCase().includes(filters.role.toLowerCase()) : true) &&
            (filters.type ? post.placementType === filters.type : true) &&
            (filters.batch ? String(post.batchYear) === filters.batch : true)
        )
    })

    return (
        
        <div className='w-full py-8'>
            <Container>
                {/* ✅ Filter Controls */}
                <div className="flex flex-wrap gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="Filter by Company"
                        className="border p-2 rounded"
                        value={filters.company}
                        onChange={(e) => setFilters({ ...filters, company: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Filter by Role"
                        className="border p-2 rounded"
                        value={filters.role}
                        onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                    />
                    <select
                        className="border p-2 rounded"
                        value={filters.type}
                        onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                    >
                        <option value="">All Types</option>
                        <option value="On-Campus">On-Campus</option>
                        <option value="Off-Campus">Off-Campus</option>
                    </select>
                    <input
                        type="number"
                        placeholder="Batch Year"
                        className="border p-2 rounded"
                        value={filters.batch}
                        onChange={(e) => setFilters({ ...filters, batch: e.target.value })}
                    />
                </div>

                {/* ✅ Post Cards */}
                <div className='flex flex-wrap'>
                    {filteredPosts.length > 0 ? (
                        filteredPosts.map((post) => (
                            <div key={post.$id} className='p-2 w-1/4'>
                                <PostCard {...post} />
                            </div>
                        ))
                    ) : (
                        <p className="text-center w-full">No posts found for given filters.</p>
                    )}
                </div>
            </Container>
        </div>
    )
}

export default Home
