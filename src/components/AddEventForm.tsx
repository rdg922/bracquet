"use client";

import { useFieldArray, type Control } from "react-hook-form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

const AddEventForm = ({ control }: { control: Control }) => {
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
            render={({ field }) => (
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
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field?.value}
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
                    <SelectItem value="m_double">
                      Mens&apos;s Doubles
                    </SelectItem>
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
            render={({ field }) => (
              <FormItem>
                <FormLabel>Division</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field?.value}
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
            render={({ field }) => (
              <FormItem>
                <FormLabel>Division</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field?.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Bracket type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Single Eliminiation">
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
          append({ name: "", type: "", division: "", bracketType: "" })
        }
      >
        Add Event
      </Button>
    </div>
  );
};

export default AddEventForm;
