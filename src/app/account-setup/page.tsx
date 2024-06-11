"use client";

import React, { useEffect, useRef, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface IsUserSetup {
  message: boolean;
}

const AccountSetup: React.FC = () => {
  const { userId: authId } = useAuth();
  const nameRef = useRef<HTMLInputElement>(null);
  const { user } = useUser();
  const email = user?.emailAddresses[0]?.emailAddress; // TODO: avoid sending address from front end
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserSetup = async () => {
      try {
        const response = await fetch(`/api/isUserSetup?authId=${authId}`);
        if (response.ok) {
          const data = (await response.json()) as IsUserSetup;
          console.log(data.message);
          if (data.message) {
            console.log("push");
            router.push("/dashboard");
          } else {
            setIsLoading(false);
          }
        } else {
          console.error("Error checking user setup:", await response.json());
        }
      } catch (error) {
        console.error("Error checking user setup:", error);
      }
    };

    if (authId) {
      void checkUserSetup();
    }
  }, [authId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const name = nameRef.current?.value || "";
      const response = await fetch("/api/setupUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          authId,
          name,
          email,
        }),
      });

      if (response.ok) {
        // Redirect to the desired page after setup
        router.push("/dashboard");
      } else {
        console.error("Error setting up account:", await response.json());
      }
    } catch (error) {
      console.error("Error setting up account:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="setup-container">
      <h1>Account Setup</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name</label>
          <input id="name" type="text" ref={nameRef} required />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AccountSetup;
