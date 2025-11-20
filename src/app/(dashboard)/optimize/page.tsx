'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  optimizeDescriptionForSEO,
  type OptimizeDescriptionForSEOOutput,
} from "@/ai/flows/optimize-description-for-seo";
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
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  productName: z.string().min(2, { message: "Product name must be at least 2 characters." }),
  productDescription: z.string().min(20, { message: "Description must be at least 20 characters." }),
  keywords: z.string().min(3, { message: "Please provide at least one keyword." }),
});

type FormData = z.infer<typeof formSchema>;

export default function OptimizePage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<OptimizeDescriptionForSEOOutput | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: "",
      productDescription: "",
      keywords: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await optimizeDescriptionForSEO(data);
      setResult(response);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "An error occurred.",
        description: "Failed to optimize description. Please try again.",
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

  return (
    <>
      <PageHeader
        title="Optimize for SEO"
        description="Refine your existing product descriptions for better search engine visibility."
      />
      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2 h-fit">
          <CardHeader>
            <CardTitle>Content to Optimize</CardTitle>
            <CardDescription>
              Provide your existing content and keywords to get an SEO-optimized version.
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
                      <FormLabel>Product Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Paste your existing product description here."
                          className="min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="keywords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Keywords</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., office chair, ergonomic seating" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Wand2 className="mr-2 h-4 w-4" />
                  )}
                  Optimize Now
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="lg:col-span-3">
          <Card className="min-h-[600px]">
            <CardHeader>
              <CardTitle>Optimized Content</CardTitle>
              <CardDescription>
                Your SEO-optimized content will appear here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading && (
                <div className="flex flex-col items-center justify-center h-96">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="mt-4 text-muted-foreground">Optimizing your content...</p>
                </div>
              )}
              {!isLoading && !result && (
                <div className="flex flex-col items-center justify-center h-96 text-center border-2 border-dashed rounded-lg">
                  <Wand2 className="h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 text-lg font-medium">Ready to boost your SEO?</p>
                  <p className="text-muted-foreground">Fill out the form to optimize your description.</p>
                </div>
              )}
              {result && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold">Optimized Description</h3>
                    <div className="relative p-4 border rounded-md mt-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 h-7 w-7"
                          onClick={() => handleCopy(result.optimizedDescription)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <p className="whitespace-pre-wrap">{result.optimizedDescription}</p>
                    </div>
                  </div>
                  <Separator />
                   <div>
                    <h3 className="text-lg font-semibold">Title Suggestion</h3>
                    <p className="text-muted-foreground mt-2">{result.titleSuggestion}</p>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="text-lg font-semibold">Meta Description</h3>
                    <p className="text-muted-foreground mt-2">{result.metaDescription}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
