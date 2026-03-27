import { useEffect, useState } from "react"

import { postClient } from "../clients/api"

import Post from "../components/Post"

  function Feed() {

    const [posts, setPosts] = useState([])
     const [title, setTitle] = useState('')
    const  [body, setBody] = useState('')
    console.log(posts)

    useEffect(() => {
        async function getData() {
            try {
                // get our posts from db
                const { data } = await postClient.get('/')
                
                // save that in component's state
                setPosts(data)

            } catch (err) {
                console.log(err.response.data)
            }
        }
        getData()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            // make a POST request to create the post (based off the state: title and body)
            const { data } = await postClient.post('/', { title, body })
        
            // add the new post to our state
            setPosts([data, ...posts])

            // reset the form 
            setTitle('')
            setBody('')

        } catch(err) {
            console.log(err)
        }
    }

    return (
        <div>

            <h1>Feed Page</h1>

            <form onSubmit={handleSubmit}>
                <h2>Leave a post here:</h2>
                <label htmlFor="title">Title:</label>
                <input 
                    type="text" 
                    id="title"
                    required={true}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <br />
                <label htmlFor="body">Body:</label>
                <textarea 
                    type="text" 
                    id="body"
                    required={true}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                />
                <br />
                <button>Submit</button>
            </form>

            
            {posts.map(post => 
                <Post 
                    post={post} 
                    key={post._id} 
                />
            )}
        </div>
    )
}

export default Feed