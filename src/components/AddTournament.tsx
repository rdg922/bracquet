"use client";

import { useRef } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

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
        <p htmlFor="name">Tournament Name</p>
        <Input name="name" ref={nameRef} required />
      </div>
      <Button>Add Tournament</Button>
    </form>
  );
};

export default AddTournamentForm;
