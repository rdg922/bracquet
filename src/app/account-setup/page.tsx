"use client";

import React, { useEffect, useRef, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { accountSetupFormSchema } from "./accountSetupFormSchema";
import { onSubmitAction } from "./onSubmitAction";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { useFormState } from "react-dom";

interface IsUserSetup {
  message: boolean;
}

type AccountSetupFormData = {
  name: string;
  phoneNumber: string;
  email: string;
};

const AccountSetup: React.FC = () => {
  const { userId } = useAuth();
  const { user } = useUser();
  const email = user?.emailAddresses[0]?.emailAddress;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const [state, formAction] = useFormState(onSubmitAction, { message: "" });

  const form = useForm<AccountSetupFormData>({
    resolver: zodResolver(accountSetupFormSchema),
    defaultValues: {
      name: "",
      phoneNumber: "",
      email: email ?? "",
    },
  });

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (email) {
      form.setValue("email", email);
    }
  }, [email, form]);

  useEffect(() => {
    const checkUserSetup = async () => {
      try {
        const response = await fetch(`/api/isUserSetup?userId=${userId}`);
        if (response.ok) {
          const data = (await response.json()) as IsUserSetup;
          if (data.message) {
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

    if (userId) {
      void checkUserSetup();
    }
  }, [userId, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (state?.redirect) {
    router.push(state.redirect);
  }

  return (
    <main className="pt-6">
      <h2 className="my-6">Account Setup</h2>
      <Form {...form}>
        {state?.message !== "" && !state.issues && (
          <div className="text-red-500">{state.message}</div>
        )}
        {state?.issues && (
          <div className="text-red-500">
            <ul>
              {state.issues.map((issue) => (
                <li key={issue} className="flex gap-1">
                  <X fill="red" />
                  {issue}
                </li>
              ))}
            </ul>
          </div>
        )}
        <form
          ref={formRef}
          action={formAction}
          onSubmit={async (evt) => {
            evt.preventDefault();
            void form.handleSubmit((values) => {
              const formData = new FormData();
              for (const key in values) {
                formData.append(
                  key,
                  values[key as keyof typeof values].toString(),
                );
              }
              formAction(formData);
            })(evt);
          }}
          className="space-y-8"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="Your phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <input type="hidden" {...form.register("email")} />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </main>
  );
};

export default AccountSetup;
