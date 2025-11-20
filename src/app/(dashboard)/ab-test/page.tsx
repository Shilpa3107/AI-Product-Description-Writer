'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  generateABTestingVariants,
  type GenerateABTestingVariantsOutput,
} from "@/ai/flows/generate-ab-testing-variants";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Wand2, Copy } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const formSchema = z.object({
  productName: z.string().min(2, { message: "Product name must be at least 2 characters." }),
  productDescription: z.string().min(20, { message: "Base description must be at least 20 characters." }),
  keyFeatures: z.string().min(10, { message: "Please list at least one feature." }),
  targetAudience: z.string().min(3, { message: "Target audience is required." }),
  numberOfVariants: z.number().min(2).max(5),
});

type FormData = z.infer<typeof formSchema>;

export default function ABTestPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerateABTestingVariantsOutput | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: "",
      productDescription: "",
      keyFeatures: "",
      targetAudience: "",
      numberOfVariants: 3,
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await generateABTestingVariants(data);
      setResult(response);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "An error occurred.",
        description: "Failed to generate A/B test variants. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard!",
    });
  };

  const variantCount = form.watch("numberOfVariants");

  return (
    <>
      <PageHeader
        title="A/B Testing Variants"
        description="Generate multiple versions of a description to test and find the best performer."
      />
      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2 h-fit">
          <CardHeader>
            <CardTitle>Base Product Information</CardTitle>
            <CardDescription>
              Provide the core details to generate testing variants.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="productName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Ergonomic Office Chair" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="productDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Base Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Your core product description."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="keyFeatures"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Key Features</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Adjustable lumbar support, breathable mesh" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="targetAudience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Audience</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Professionals, remote workers" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="numberOfVariants"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Variants: {variantCount}</FormLabel>
                      <FormControl>
                        <Slider
                          defaultValue={[field.value]}
                          min={2}
                          max={5}
                          step={1}
                          onValueChange={(value) => field.onChange(value[0])}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Wand2 className="mr-2 h-4 w-4" />
                  )}
                  Generate Variants
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="lg:col-span-3">
          <Card className="min-h-[600px]">
            <CardHeader>
              <CardTitle>Generated Variants</CardTitle>
              <CardDescription>
                Your A/B test variants will appear here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading && (
                <div className="flex flex-col items-center justify-center h-96">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="mt-4 text-muted-foreground">Generating variants...</p>
                </div>
              )}
              {!isLoading && !result && (
                <div className="flex flex-col items-center justify-center h-96 text-center border-2 border-dashed rounded-lg">
                  <Wand2 className="h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 text-lg font-medium">Ready to run some tests?</p>
                  <p className="text-muted-foreground">Fill out the form to generate description variants.</p>
                </div>
              )}
              {result && (
                <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
                  {result.descriptionVariants.map((variant, index) => (
                    <AccordionItem value={`item-${index}`} key={index}>
                      <AccordionTrigger className="font-semibold">Variant {index + 1}</AccordionTrigger>
                      <AccordionContent>
                         <div className="relative p-4 border rounded-md bg-background">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute top-2 right-2 h-7 w-7"
                              onClick={() => handleCopy(variant)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <p className="whitespace-pre-wrap">{variant}</p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
