import {useEffect, useState} from "react";
import {Navigate, useParams} from "react-router-dom";
import Editor from '../Editor';

export default function EditPost() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:4000/post/${id}`)
        .then(response => response.json())
        .then(postInfo => {
          setTitle(postInfo.title);
          setContent(postInfo.content);
          setSummary(postInfo.summary);
        })
        .catch(error => console.error(error));
  }, [id]);

  async function updatePost(ev) {
    ev.preventDefault();
    const data = {
      title, // Add the title to the data
      summary,
      content,
      id,
    };
    try {
      const response = await fetch(`http://localhost:4000/post/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include',
      });
      if (response.ok) {
        setRedirect(true);
      }
    } catch (error) {
      console.error(error);
    }
  }

  if (redirect) {
    return <Navigate to={`/post/${id}`} />;
  }

  return (
      <div>
        <form onSubmit={updatePost}>
          <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(ev) => setTitle(ev.target.value)}
          />
          <input
              type="text"
              placeholder="Summary"
              value={summary}
              onChange={(ev) => setSummary(ev.target.value)}
          />
          <Editor onChange={setContent} value={content} />
          <button style={{ marginTop: '5px' }}>Update post</button>
        </form>
      </div>
  );
}
