"use client";

import { z } from "zod";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
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
} from "./ui/form";
import { DateTimePicker } from "~/components/ui/datetime-picker";

const formSchema = z.object({
  name: z.string().min(2).max(255),
  startTime: z.date(),
  venue: z.string().optional(),
});

const AddTournamentForm = () => {
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const response = await fetch("/api/addTournament", {
      method: "POST",
      body: JSON.stringify({
        ...values,
      }),
    });

    if (response.ok) {
      alert("Tournament added successfully");
    } else {
      alert("Failed to add tournament");
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "My Tournament",
      startTime: new Date(),
    },
  });

  return (
    <div className="pt-6">
      <h2 className="my-6">Add Tournament</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
};

export default AddTournamentForm;
