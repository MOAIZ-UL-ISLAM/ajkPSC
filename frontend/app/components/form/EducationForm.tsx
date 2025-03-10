"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { useToast } from "@/components/ui/use-toast";
import {
  educationSchema,
  type EducationFormValues,
} from "@/lib/jobsvalidator";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  
  updateEducationalDetails,
} from "@/store/features/jobs/jobSlice";

const EDUCATION_LEVELS = [
  "matric",
  "intermediate",
  "BS",
  "Mphil",
  "PhD",
] as const;

export default function EducationForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  // const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentEducation, setCurrentEducation] = useState<null | any>(null);

  const applicationId = useAppSelector((state) => state.form.applicationId);
  const educations = useAppSelector((state) => state.form.educationalDetails);
  const loading = useAppSelector((state) => state.form.loading);

  const form = useForm<EducationFormValues>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      level: "matric",
      instituteName: "",
      attendedFrom: "",
      attendedTill: "",
      boardOrUniversityName: "",
      obtainedMarks: "",
      totalMarks: "",
    },
  });

  const handleAddNew = () => {
    form.reset();
    setCurrentEducation(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (education: any) => {
    setCurrentEducation(education);
    form.reset({
      level: education.level,
      instituteName: education.instituteName,
      attendedFrom: education.attendedFrom,
      attendedTill: education.attendedTill,
      boardOrUniversityName: education.boardOrUniversityName,
      obtainedMarks: education.obtainedMarks,
      totalMarks: education.totalMarks,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    const updatedEducations = educations.filter((edu) => edu.id !== id);
    dispatch(updateEducationalDetails(updatedEducations));
    toast({
      title: "Education deleted",
      description: "Education record has been removed successfully.",
    });
  };

  const onSubmit = async (data: EducationFormValues) => {
    try {
      if (currentEducation) {
        // Update existing education
        const updatedEducations = educations.map((edu) =>
          edu.id === currentEducation.id ? { ...data, id: edu.id } : edu
        );
        dispatch(updateEducationalDetails(updatedEducations));
        toast({
          title: "Education updated",
          description: "Education record has been updated successfully.",
        });
      } else {
        // Add new education
        if (applicationId) {
          await dispatch(
            addEducation({ applicationId, data: { ...data, id: Date.now() } })
          ).unwrap();
          toast({
            title: "Education added",
            description: "New education record has been added successfully.",
          });
        }
      }
      setIsDialogOpen(false);
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save education details. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleNext = () => {
    if (educations.length === 0) {
      toast({
        title: "Education required",
        description: "Please add at least one education record to continue.",
        variant: "destructive",
      });
      return;
    }
    router.push("/experience");
  };

  return (
    <div className="min-h-screen p-4 py-10">
      <Card className="border-0 shadow-none max-w-[800px] mx-auto">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl">Education</CardTitle>
          <CardDescription>Add your educational background</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex justify-end">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleAddNew}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Education
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>
                    {currentEducation ? "Edit Education" : "Add Education"}
                  </DialogTitle>
                  <DialogDescription>
                    Fill in the details of your education
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="level"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Education Level</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select education level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {EDUCATION_LEVELS.map((level) => (
                                <SelectItem key={level} value={level}>
                                  {level}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="instituteName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Institute Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter institute name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="attendedFrom"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Attended From</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="attendedTill"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Attended Till</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="boardOrUniversityName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Board/University</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter board/university name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="obtainedMarks"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Obtained Marks</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="totalMarks"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Total Marks</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <DialogFooter>
                      <Button type="submit" disabled={loading}>
                        {loading
                          ? "Saving..."
                          : currentEducation
                          ? "Update"
                          : "Add"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          {educations.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <GraduationCap className="mb-2 h-10 w-10 text-muted-foreground/50" />
              <h3 className="mb-1 text-lg font-medium">No education added</h3>
              <p className="text-sm text-muted-foreground">
                Click the "Add Education" button to add your educational
                background
              </p>
            </div>
          ) : (
            <AnimatePresence>
              <div className="space-y-4">
                {educations.map((education) => (
                  <motion.div
                    key={education.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                    className="rounded-lg border bg-card p-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">
                          {education.instituteName}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {education.level} - {education.boardOrUniversityName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(
                            education.attendedFrom
                          ).toLocaleDateString()}{" "}
                          -{" "}
                          {new Date(
                            education.attendedTill
                          ).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Marks: {education.obtainedMarks}/
                          {education.totalMarks}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(education)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDelete(education.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          )}
        </CardContent>
        <CardFooter>
          <div className="flex justify-between">
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
            <Button onClick={handleNext}>Next</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
