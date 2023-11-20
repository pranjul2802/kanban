import React, { useState, useEffect } from 'react';
import Card from './Card';
import { PiWifiHighBold } from "react-icons/pi";
import { GrWifiMedium } from "react-icons/gr";
import { PiWifiLowFill } from "react-icons/pi";
import { FaRegStopCircle } from "react-icons/fa";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { MdOutlineDoNotDisturbAlt } from "react-icons/md";
import { TbProgressBolt } from "react-icons/tb";
import { IoIosDoneAll } from "react-icons/io";
import { FaBackwardFast } from "react-icons/fa6";
import { IoAdd } from "react-icons/io5";
import { MdOutlineSmartDisplay } from "react-icons/md";
const priorityNames = {
  4: 'Urgent',
  3: 'High ',
  2: 'Medium',
  1: 'Low',
  0: 'No priority',
};

const priorityIcons = {
  4: { icon: <FaRegStopCircle /> },
  3: { icon: <PiWifiHighBold /> },
  2: { icon: <GrWifiMedium /> },
  1: { icon: <PiWifiLowFill />},
  0: { icon: <MdOutlineDoNotDisturbAlt /> },
};

const statusIcons = {
  'Todo': { icon: <IoIosDoneAll /> },
  'In progress': { icon: <TbProgressBolt /> },  
  'Backlog': { icon: <FaBackwardFast /> },
};

const Board = () => {
  const defaultGroupingOption = 'status'; // Default grouping by status
  const defaultSortingOption = 'priority';
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [groupingOption, setGroupingOption] = useState(
    localStorage.getItem('groupingOption') || defaultGroupingOption
  );
  const [sortingOption, setSortingOption] = useState(
    localStorage.getItem('sortingOption') || defaultSortingOption
  );
  const [displayOptionsVisible, setDisplayOptionsVisible] = useState(false);

  const handleDisplayClick = () => {
    setDisplayOptionsVisible(!displayOptionsVisible);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.quicksell.co/v1/internal/frontend-assignment');
        const data = await response.json();
        setTickets(data.tickets);
        setUsers(data.users);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
      
    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem('groupingOption', groupingOption);
    localStorage.setItem('sortingOption', sortingOption);
  }, [groupingOption, sortingOption]);

  const handleGroupByChange = (event) => {
    setGroupingOption(event.target.value);
  };

  const handleSortByChange = (event) => {
    setSortingOption(event.target.value);
  };
  const groupTickets = () => {
    if (groupingOption === 'status') {
      return groupTicketsByStatus();
    } else if (groupingOption === 'user') {
      return groupTicketsByUser();
    } else if (groupingOption === 'priority') {
      return groupTicketsByPriority();
    }
    return {};
  };

  const groupTicketsByStatus = () => {
    return tickets.reduce((groups, ticket) => {
      const { status } = ticket;
      groups[status] = groups[status] || [];
      groups[status].push(ticket);
      return groups;
    }, {});
  };
  

  const groupTicketsByUser = () => {
    return tickets.reduce((groups, ticket) => {
      const user = users.find(user => user.id === ticket.userId);
      if (user) {
        const userName = user.name;
        groups[userName] = groups[userName] || [];
        groups[userName].push(ticket);
      }
      return groups;
    }, {});
  };
  

  const groupTicketsByPriority = () => {
    return tickets.reduce((groups, ticket) => {
      const priorityName = priorityNames[ticket.priority];
      groups[priorityName] = groups[priorityName] || [];
      groups[priorityName].push(ticket);
      return groups;
    }, {});
  };
  

  // Logic for sorting tickets within each group
  const sortTickets = (groupedTickets) => {
    const sortedTickets = {};
  
    Object.keys(groupedTickets).forEach(key => {
      sortedTickets[key] = groupedTickets[key].sort((a, b) => {
        if (sortingOption === 'priority') {
          return b.priority - a.priority;
        } else if (sortingOption === 'title') {
          return a.title.localeCompare(b.title);
        }
        return 0; // Default case, no sorting
      });
    });
  
    return sortedTickets;
  };
  
  const sortTicketsByPriority = (groupedTickets) => {
    return Object.keys(groupedTickets).reduce((sortedTickets, key) => {
      sortedTickets[key] = groupedTickets[key].sort((a, b) => b.priority - a.priority);
      return sortedTickets;
    }, {});
  };
  
  const sortTicketsByTitle = (groupedTickets) => {
    return Object.keys(groupedTickets).reduce((sortedTickets, key) => {
      sortedTickets[key] = groupedTickets[key].sort((a, b) => a.title.localeCompare(b.title));
      return sortedTickets;
    }, {});
  };
  

  const groupedTickets = groupTickets();
  const sortedAndGroupedTickets = sortTickets(groupedTickets);

  return (
    <div className="board">
      <div className="dropdown">
      <button onClick={handleDisplayClick}><MdOutlineSmartDisplay />&nbsp;Display:</button><br></br>
        {displayOptionsVisible && (
          <div>
            <select id="displayOption" value={groupingOption} onChange={handleGroupByChange}>
              <span> </span><option value="status">Status</option>
              <option value="user"> User</option>
              <option value="priority">Priority</option>
            </select>
            <br></br>
            <select id="sortingOption" value={sortingOption} onChange={handleSortByChange}>
              <option value="priority">Priority</option>
              <option value="title">Title</option>
            </select>
          </div>
        )}
      </div>

      {Object.entries(sortedAndGroupedTickets).map(([group, groupTickets]) => (
  <div key={group} className="column">
  <div style={{ display: 'flex', alignItems: 'center' }}>
  <h3>{group} {groupTickets.length}</h3>
  <div style={{ marginLeft: '140px' }}>
    <IoAdd />&nbsp;&nbsp;&nbsp;<HiOutlineDotsHorizontal />
  </div>
</div>

    {groupTickets.map(ticket => (
      <div key={ticket.id} className="ticket">
        {/* Conditionally render icons based on the selected grouping option */}
        {groupingOption === 'priority' && priorityIcons[ticket.priority] && (
          <div>
            <span className="priority-icon">{priorityIcons[ticket.priority].icon}</span>
            <span>{priorityIcons[ticket.priority].name}</span>
          </div>
        )}
        {groupingOption === 'status' && statusIcons[ticket.status] && (
          <div>
            <span className="status-icon">{statusIcons[ticket.status].icon}</span>
            <span>{ticket.status}</span>
          </div>
        )}
        <Card ticket={ticket} />
      </div>
    ))}
  </div>
))}
    </div>
  );
};

export default Board;