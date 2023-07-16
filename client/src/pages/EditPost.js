import {useEffect, useState} from "react";
import {Navigate, useParams} from "react-router-dom";
import Editor from '../Editor';
import {toast, ToastContainer} from "react-toastify";

export default function EditPost() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    fetch(`https://openstories.onrender.com/post/${id}`)
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
      summary,
      content,
      id,
    };
    try {
      const response = await fetch(`https://openstories.onrender.com/post/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include',
      });
      if (response.ok) {
        setRedirect(true);
        toast.success('Post Updated!')
      }
    } catch (error) {
      console.error(error);
      toast.error('Post is not Updated!')
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
        <ToastContainer/>
      </div>
  );
}

