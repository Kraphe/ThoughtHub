import Appbar from "../components/Appbar"
import BlogCard from "../components/BlogCard"
import { useBlogs } from '../hooks'
import Shimmer from "../components/Shimmer"



const Blogs = ()=>{

    const { loading, blogs } = useBlogs();
    if (loading) {
      return <div>
        <Appbar/>
        <div className='flex justify-center'>
          <div>
            <Shimmer/>
          </div>
        </div>
      </div>
    }
    return (
        <div>
    <Appbar/>
        <div className='flex justify-center'>
          <div>
          
            {
              //@ts-ignore
                  (blogs.posts).map(blog => 
                <BlogCard
                  key={blog.id}
                  id={blog.id}
                  title={blog.title}
                  content={blog.content}
                  publishedDate={"2nd Feb 2024"} 
                  authorName= {blog.author.name || "Anonymous"} 
                  />)
              }
          </div>
        </div>
        </div>
        
      )

    
}



export default Blogs



   