"use client";

import { useRef } from "react";

const AddTournamentForm = () => {
  const nameRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (nameRef.current) {
      const response = await fetch("/api/addTournament", {
        method: "POST",
        body: JSON.stringify({ name: nameRef.current.value }),
      });

      if (response.ok) {
        alert("Tournament added successfully");
      } else {
        alert("Failed to add tournament");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="mb-2">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-300"
        >
          Tournament Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          ref={nameRef}
          className="mt-1 block w-full rounded-md border-gray-300 text-black shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>
      <button
        type="submit"
        className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        Add Tournament
      </button>
    </form>
  );
};

export default AddTournamentForm;
