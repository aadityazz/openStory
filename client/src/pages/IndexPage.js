import Post from "../Post";
import {useEffect, useState} from "react";
import {CircularProgress} from "@material-ui/core";

export default function IndexPage() {
  const [posts,setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch('https://openstories.onrender.com/post')
        .then(response => response.json())
        .then(posts => {
          setPosts(posts);
          setLoading(false);
        })
        .catch(error => {
          console.error("Error fetching posts:", error);
          setLoading(false);
        });
  }, []);
  return (
      <>
        {loading ? (
            <>
              <CircularProgress />
              <p>Loading Posts</p>
            </>
        ) : (
            <>
              {posts.length > 0 && posts.map(post => (
                  <Post key={post._id} {...post} />
              ))}
            </>
        )}
      </>
  );
}
