import React from 'react';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { PiCircleDuotone } from 'react-icons/pi';

const Card = ({ ticket }) => {
  const renderTag = () => {
    if (ticket.tag && ticket.tag.length > 0) {
      return (
        <div className="tag">
          <PiCircleDuotone />
          {ticket.tag[0]}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card">
      <div className="card-header">
        <h4>{ticket.id}</h4>
        <HiOutlineDotsHorizontal />
      </div>
      <div className="card-body">
        <p>{ticket.title}</p>
        {renderTag()}
      </div>
    </div>
  );
};

export default Card;
