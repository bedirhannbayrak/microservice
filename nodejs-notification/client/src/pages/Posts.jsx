import React, { useEffect, useState } from 'react';
import { getPosts } from '../api';
import Card from '../components/card/Card';

const Posts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const { posts } = await getPosts();
        setPosts(posts);
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  return (
    <ul className='card-wrapper'>
      {posts?.map((post, idx) => (
        <Card key={idx} post={post} />
      ))}
    </ul>
  );
};

export default Posts;
