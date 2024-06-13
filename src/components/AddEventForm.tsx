"use client";

import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { z } from "zod";
import {
  type Control,
  useFieldArray,
  type ControllerRenderProps,
} from "react-hook-form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

const eventSchema = z.object({
  name: z.string().min(2).max(256),
  eventType: z.enum([
    "m_single",
    "m_double",
    "w_single",
    "w_double",
    "x_double",
  ]),
  division: z.enum(["Novice", "Intermediate", "Open"]),
  bracketType: z.enum([
    "Single Elimination",
    "Double Elimination",
    "Single Elimination w/ Consolation",
    "Round Robin",
  ]),
});

const formSchema = z.object({
  name: z.string().min(2).max(255),
  startTime: z.date(),
  venue: z.string().optional(),
  events: z.array(eventSchema),
});

type TournamentFormValues = z.infer<typeof formSchema>;

interface AddEventFormProps {
  control: Control<TournamentFormValues>;
}

const AddEventForm: React.FC<AddEventFormProps> = ({ control }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "events",
  });

  return (
    <div>
      <h2>Add Events</h2>
      {fields.map((field, index) => (
        <div key={field.id} className="space-y-4 py-4">
          <FormField
            control={control}
            name={`events.${index}.name`}
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                TournamentFormValues,
                `events.${number}.name`
              >;
            }) => (
              <FormItem>
                <FormLabel>Event Name</FormLabel>
                <FormControl>
                  <Input placeholder="Event name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`events.${index}.eventType`}
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                TournamentFormValues,
                `events.${number}.eventType`
              >;
            }) => (
              <FormItem>
                <FormLabel>Event Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an event type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="m_single">Men&apos;s Singles</SelectItem>
                    <SelectItem value="w_single">
                      Women&apos;s Singles
                    </SelectItem>
                    <SelectItem value="m_double">Men&apos;s Doubles</SelectItem>
                    <SelectItem value="w_double">
                      Women&apos;s Doubles
                    </SelectItem>
                    <SelectItem value="x_double">Mixed Doubles</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`events.${index}.division`}
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                TournamentFormValues,
                `events.${number}.division`
              >;
            }) => (
              <FormItem>
                <FormLabel>Division</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Division type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Novice">Novice</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Open">Open</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`events.${index}.bracketType`}
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                TournamentFormValues,
                `events.${number}.bracketType`
              >;
            }) => (
              <FormItem>
                <FormLabel>Bracket Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Bracket type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Single Elimination">
                      Single Elimination
                    </SelectItem>
                    <SelectItem value="Double Elimination">
                      Double Elimination
                    </SelectItem>
                    <SelectItem value="Single Elimination w/ Consolation">
                      Single Elimination w/ Consolation
                    </SelectItem>
                    <SelectItem value="Round Robin">Round Robin</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="button" onClick={() => remove(index)}>
            Remove Event
          </Button>
        </div>
      ))}
      <Button
        type="button"
        onClick={() =>
          append({
            name: "",
            eventType: "m_single",
            division: "Novice",
            bracketType: "Single Elimination",
          })
        }
      >
        Add Event
      </Button>
    </div>
  );
};

export default AddEventForm;
