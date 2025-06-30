"use client";

import { useForm, useFieldArray, Controller, Control, UseFormRegister, FormState } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Trash2, ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import React from "react";

const pollQuestionSchema = z.object({
  question_content: z.string().min(1, "Question content is required."),
  options: z.array(z.string().min(1, "Option cannot be empty.")).min(2, "At least 2 options are required."),
  timeInSeconds: z.coerce.number().int().min(5, "Time must be at least 5 seconds."),
  correct_option: z.coerce.number().int().min(0, "A correct option must be selected."),
  points: z.coerce.number().min(0, "Points cannot be negative."),
}).refine(data => data.correct_option < data.options.length, {
    message: "Selected correct option is out of bounds.",
    path: ["correct_option"],
});

const pollSchema = z.object({
  poll_id: z.string().min(1, "Poll ID is required."),
  poll_name: z.string().min(1, "Poll name is required."),
  username: z.string().min(1, "Username is required."),
  question_set: z.array(pollQuestionSchema).min(1, "At least one question is required."),
});

type PollFormValues = z.infer<typeof pollSchema>;


const QuestionItem = ({
  control,
  index,
  remove,
  questionCount,
  register,
  formState,
}: {
  control: Control<PollFormValues>;
  index: number;
  remove: (index: number) => void;
  questionCount: number;
  register: UseFormRegister<PollFormValues>;
  formState: FormState<PollFormValues>;
}) => {
  const { fields: optionFields, append: appendOption, remove: removeOption } = useFieldArray({
    control,
    name: `question_set.${index}.options`,
  });

  return (
    <Card className="relative pt-8">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
        onClick={() => remove(index)}
        disabled={questionCount <= 1}
      >
        <Trash2 className="h-4 w-4" />
        <span className="sr-only">Remove Question</span>
      </Button>
      <CardHeader>
        <CardTitle>Question {index + 1}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor={`question_set.${index}.question_content`}>Question Text</Label>
          <Textarea
            id={`question_set.${index}.question_content`}
            {...register(`question_set.${index}.question_content`)}
          />
          {formState.errors.question_set?.[index]?.question_content && (
            <p className="text-sm text-destructive mt-1">
              {formState.errors.question_set?.[index]?.question_content?.message}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <Label>Options & Correct Answer</Label>
          <Controller
            name={`question_set.${index}.correct_option`}
            control={control}
            render={({ field: radioField }) => (
              <RadioGroup
                onValueChange={(value) => radioField.onChange(parseInt(value, 10))}
                value={String(radioField.value)}
                className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-2"
              >
                {optionFields.map((item, optionIndex) => (
                  <div key={item.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={String(optionIndex)} id={`q${index}-opt${optionIndex}`} />
                    <div className="flex-1 flex items-center gap-2">
                      <Input
                        {...register(`question_set.${index}.options.${optionIndex}`)}
                        placeholder={`Option ${optionIndex + 1}`}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="shrink-0 text-muted-foreground hover:text-destructive"
                        onClick={() => removeOption(optionIndex)}
                        disabled={optionFields.length <= 2}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove Option</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            )}
          />
          <Button type="button" variant="outline" size="sm" onClick={() => appendOption("")}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Option
          </Button>
          {formState.errors.question_set?.[index]?.options && (
            <p className="text-sm text-destructive mt-1">
              {formState.errors.question_set[index]?.options?.message || 'Each option must not be empty.'}
            </p>
          )}
          {formState.errors.question_set?.[index]?.correct_option && (
            <p className="text-sm text-destructive mt-1">
              {formState.errors.question_set[index]?.correct_option?.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`question_set.${index}.timeInSeconds`}>Time (seconds)</Label>
            <Input
              id={`question_set.${index}.timeInSeconds`}
              type="number"
              {...register(`question_set.${index}.timeInSeconds`)}
            />
            {formState.errors.question_set?.[index]?.timeInSeconds && (
              <p className="text-sm text-destructive mt-1">
                {formState.errors.question_set?.[index]?.timeInSeconds?.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor={`question_set.${index}.points`}>Points</Label>
            <Input
              id={`question_set.${index}.points`}
              type="number"
              {...register(`question_set.${index}.points`)}
            />
            {formState.errors.question_set?.[index]?.points && (
              <p className="text-sm text-destructive mt-1">
                {formState.errors.question_set?.[index]?.points?.message}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};


export default function CreateQuizPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();

  const form = useForm<PollFormValues>({
    resolver: zodResolver(pollSchema),
    defaultValues: {
      poll_id: "",
      poll_name: "",
      username: user?.username || "",
      question_set: [
        {
          question_content: "",
          options: ["", ""],
          timeInSeconds: 30,
          correct_option: 0,
          points: 100,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "question_set",
  });

  const onSubmit = async (data: PollFormValues) => {
     if (!user || !user.token) {
        toast({
            title: "Authentication Error",
            description: "You must be logged in to create a quiz.",
            variant: "destructive",
        });
        return;
    }

    const payload = {
      ...data,
      status: true,
      username: user.username,
      question_set: data.question_set.map(q => ({
        ...q,
        question_id: `q_${Math.random().toString(36).substr(2, 9)}`,
      })),
    };

    try {
      const response = await fetch('http://localhost:8851/user/api/savePoll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Server responded with an error.' }));
        throw new Error(errorData.message || 'Failed to save quiz.');
      }

      toast({
        title: "Quiz Saved!",
        description: `Quiz "${data.poll_name}" has been created.`,
      });
      router.push('/polls');

    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Could not connect to the server.",
        variant: "destructive",
      });
    }
  };
  
  React.useEffect(() => {
    if (!form.getValues("poll_id")) {
        const generatedPollId = Math.floor(10000000 + Math.random() * 90000000).toString();
        form.setValue("poll_id", generatedPollId);
    }
    if (user?.username) {
        form.setValue("username", user.username);
    }
  }, [user, form]);

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-background to-secondary p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="absolute top-6 left-6">
          <Button asChild variant="outline" size="sm">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 py-12">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-3xl">Create a New Quiz</CardTitle>
              <CardDescription>Fill in the details for your poll and add your questions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="poll_name">Poll Name</Label>
                  <Input id="poll_name" {...form.register("poll_name")} placeholder="My Awesome Quiz" />
                   {form.formState.errors.poll_name && <p className="text-sm text-destructive mt-1">{form.formState.errors.poll_name.message}</p>}
                </div>
                 <div>
                  <Label htmlFor="poll_id">Poll ID</Label>
                  <Input id="poll_id" {...form.register("poll_id")} disabled />
                   {form.formState.errors.poll_id && <p className="text-sm text-destructive mt-1">{form.formState.errors.poll_id.message}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {fields.map((field, index) => (
            <QuestionItem
              key={field.id}
              control={form.control}
              index={index}
              remove={remove}
              questionCount={fields.length}
              register={form.register}
              formState={form.formState}
            />
          ))}
          
          <div className="flex justify-between items-center">
             <Button
                type="button"
                variant="outline"
                onClick={() =>
                  append({
                    question_content: "",
                    options: ["", ""],
                    timeInSeconds: 30,
                    correct_option: 0,
                    points: 100,
                  })
                }
             >
                <PlusCircle className="mr-2 h-4 w-4" /> Add Question
             </Button>

             <Button type="submit" size="lg" disabled={form.formState.isSubmitting}>
                <Save className="mr-2 h-4 w-4" />
                {form.formState.isSubmitting ? "Saving..." : "Save Quiz"}
             </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
