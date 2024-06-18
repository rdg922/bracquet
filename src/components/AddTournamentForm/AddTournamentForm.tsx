"use client";

import { X } from "lucide-react";
import { type z } from "zod";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { useFormState } from "react-dom";
import { useRef } from "react";
import { DateTimePicker } from "~/components/ui/datetime-picker";
import AddEventForm from "./AddEventForm"; // Import the AddEventForm component
import { tournamentFormSchema } from "./tournamentFormSchema";
import { onSubmitAction } from "./onSubmitAction";

const AddTournamentForm = () => {
  const [state, formAction] = useFormState(onSubmitAction, { message: "" });

  const form = useForm<z.infer<typeof tournamentFormSchema>>({
    resolver: zodResolver(tournamentFormSchema),
    defaultValues: {
      name: "My Tournament",
      startTime: new Date(),
      events: [],
    },
  });

  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div className="pt-6">
      <h2 className="my-6">Add Tournament</h2>
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
                if (key === "events") {
                  formData.append(key, JSON.stringify(values[key]));
                } else {
                  formData.append(
                    key,
                    values[key as keyof typeof values]!.toString(),
                  );
                }
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
                  <Input placeholder="Tournament name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="datetime">Tournament Start Time</FormLabel>
                <FormControl>
                  <DateTimePicker
                    granularity="second"
                    jsDate={field.value}
                    onJsDateChange={field.onChange}
                  />
                </FormControl>
                <FormDescription>
                  This is separate from the times of your events
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="venue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Venue</FormLabel>
                <FormControl>
                  <Input placeholder="Venue Location" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <AddEventForm control={form.control} />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
};

export default AddTournamentForm;
