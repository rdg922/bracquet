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
import { type z } from "zod";
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
import { type tournamentFormSchema } from "./AddTournament";

type TournamentFormValues = z.infer<typeof tournamentFormSchema>;

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
      <h3 className="mb-4">Add Events</h3>
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
                    <SelectItem value="novice">Novice</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
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
                    <SelectItem value="single_elim">
                      Single Elimination
                    </SelectItem>
                    <SelectItem value="double_elim">
                      Double Elimination
                    </SelectItem>
                    <SelectItem value="single_consol">
                      Single Elimination w/ Consolation
                    </SelectItem>
                    <SelectItem value="round_robin">Round Robin</SelectItem>
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
            division: "novice",
            bracketType: "single_elim",
          })
        }
      >
        Add Event
      </Button>
    </div>
  );
};

export default AddEventForm;
