import React from 'react';
import type{ User } from '../models/User';

type Props = {
  users: User[];
};

const UserView: React.FC<Props> = ({ users }) => (
  <div>
    <h2>User List</h2>
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name} — {user.email}</li>
      ))}
    </ul>
  </div>
);

export default UserView;
