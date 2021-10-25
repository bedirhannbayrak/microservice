import { Link } from 'react-router-dom';
import './card.css';

const Card = () => {
  return (
    <li className='card'>
      <img
        src='https://images.unsplash.com/photo-1611916656173-875e4277bea6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwxNDU4OXwwfDF8cmFuZG9tfHx8fHx8fHw&ixlib=rb-1.2.1&q=80&w=400'
        alt=''
      />
      <h3>
        <Link to='#'>A Super Wonderful Headline</Link>
      </h3>
      <p>Lorem ipsum sit dolor amit</p>
    </li>
  );
};

export default Card;
