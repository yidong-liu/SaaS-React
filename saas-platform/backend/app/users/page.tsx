import React from 'react';

async function getUsers() {
  const backendUrl =
    (process.env as { NEXT_PUBLIC_BACKEND_URL?: string }).NEXT_PUBLIC_BACKEND_URL ||
    'http://localhost:3001';
  const res = await fetch(`${backendUrl}/api/users`);
  return res.json();
}

export default async function UsersPage() {
  const users = await getUsers();
  return React.createElement(
    'main',
    { style: { padding: 16 } },
    React.createElement('h1', null, 'Users'),
    React.createElement('pre', null, JSON.stringify(users, null, 2))
  );
}
