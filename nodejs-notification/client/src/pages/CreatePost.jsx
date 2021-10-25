import React, { useState } from 'react';
import { createPost } from '../api';
import { useAuth } from '../context/AuthContext';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { user, socketId } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const post = await createPost({
        title,
        content,
        user_id: user.id,
        socket_id: socketId,
      });
      console.log(post);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className='login'>
      <h2>Create Post</h2>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          name='title'
          placeholder='title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          rows='4'
          cols='50'
          placeholder='content'
          onChange={(e) => setContent(e.target.value)}
        />
        <input type='submit' value='Create' />
      </form>
    </div>
  );
};

export default CreatePost;
