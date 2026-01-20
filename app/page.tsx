"use client"


import { useState } from "react";


export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    fetch("/api/signup", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({username, password}),
    });
  }

  return (
    <div className="min-h-screen bg-black items-center text-white w-full flex justify-center">
      <form onSubmit={handleSubmit}>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="username"
        />
        <br />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
        />
        <br />

        {error && <p>{error}</p>}

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
