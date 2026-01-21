"use client"


import { useState } from "react";


export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({username, password}),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "An error occurred");
        console.error("API Error:", data);
      } else {
        console.log("User created:", data);
        setError(null);
        setUsername("");
        setPassword("");
        alert("User created successfully!");
      }
    } catch (error) {
      console.error("Request failed:", error);
      setError("Request failed");
    }
  }

  return (
    <div className="min-h-screen text-black items-center text-white w-full flex justify-center">
      <form onSubmit={handleSubmit} className="text-black">
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="username"
          className="text-black"
        />
        <br />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
          className="text-black"
        />
        <br />

        {error && <p>{error}</p>}

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
