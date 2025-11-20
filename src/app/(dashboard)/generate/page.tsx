'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  generateProductDescription,
  type GenerateProductDescriptionOutput,
} from "@/ai/flows/generate-product-description";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  productName: z.string().min(2, { message: "Product name must be at least 2 characters." }),
  productFeatures: z.string().min(10, { message: "Please list at least one feature." }),
  productBenefits: z.string().optional(),
  targetAudience: z.string().optional(),
  keywords: z.string().optional(),
  tone: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function GeneratePage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerateProductDescriptionOutput | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: "",
      productFeatures: "",
      productBenefits: "",
      targetAudience: "",
      keywords: "",
      tone: "professional",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await generateProductDescription(data);
      setResult(response);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "An error occurred.",
        description: "Failed to generate product description. Please try again.",
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
        title="Generate Description"
        description="Create compelling, SEO-optimized descriptions from basic product information."
      />
      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2 h-fit">
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
            <CardDescription>
              Fill in the details below to generate a new product description.
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
                  name="productFeatures"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Key Features</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., Adjustable lumbar support, breathable mesh, 4D armrests"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="productBenefits"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Benefits (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Reduces back pain, improves posture" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="targetAudience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Audience (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Professionals, remote workers" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="keywords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SEO Keywords (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., office chair, ergonomic seating" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="tone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tone</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a tone" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="friendly">Friendly</SelectItem>
                          <SelectItem value="humorous">Humorous</SelectItem>
                          <SelectItem value="luxury">Luxury</SelectItem>
                        </SelectContent>
                      </Select>
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
                  Generate
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="lg:col-span-3">
          <Card className="min-h-[600px]">
            <CardHeader>
              <CardTitle>Generated Content</CardTitle>
              <CardDescription>
                Your AI-powered descriptions will appear here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading && (
                <div className="flex flex-col items-center justify-center h-96">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="mt-4 text-muted-foreground">Generating your content...</p>
                </div>
              )}
              {!isLoading && !result && (
                 <div className="flex flex-col items-center justify-center h-96 text-center border-2 border-dashed rounded-lg">
                  <Wand2 className="h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 text-lg font-medium">Ready to create magic?</p>
                  <p className="text-muted-foreground">Fill out the form to generate your description.</p>
                </div>
              )}
              {result && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold">Title Suggestion</h3>
                    <p className="text-muted-foreground">{result.titleSuggestion}</p>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="text-lg font-semibold">Meta Description</h3>
                    <p className="text-muted-foreground">{result.metaDescription}</p>
                  </div>
                  <Separator />
                  <Tabs defaultValue="website">
                    <TabsList>
                      <TabsTrigger value="website">Website</TabsTrigger>
                      <TabsTrigger value="amazon">Amazon</TabsTrigger>
                      <TabsTrigger value="social">Social Media</TabsTrigger>
                      <TabsTrigger value="email">Email</TabsTrigger>
                    </TabsList>
                    <TabsContent value="website" className="mt-4">
                      <div className="relative p-4 border rounded-md">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 h-7 w-7"
                          onClick={() => handleCopy(result.productDescription)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <p className="whitespace-pre-wrap">{result.productDescription}</p>
                      </div>
                    </TabsContent>
                    <TabsContent value="amazon" className="mt-4">
                      <div className="relative p-4 border rounded-md">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 h-7 w-7"
                          onClick={() => handleCopy(result.productDescription.replace(/\n/g, '\n- '))}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <p className="whitespace-pre-wrap">- {result.productDescription.replace(/\n/g, '\n- ')}</p>
                      </div>
                    </TabsContent>
                    <TabsContent value="social" className="mt-4">
                       <div className="relative p-4 border rounded-md">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 h-7 w-7"
                           onClick={() => handleCopy(`${result.productDescription}\n\n#${form.getValues('productName').replace(/\s/g, '')} #${form.getValues('keywords')?.split(',')[0]?.trim() || 'Product'}`)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <p className="whitespace-pre-wrap">{result.productDescription}</p>
                        <p className="mt-4 font-semibold text-primary">
                          #{form.getValues('productName').replace(/\s/g, '')} #{form.getValues('keywords')?.split(',')[0]?.trim() || 'Product'}
                        </p>
                      </div>
                    </TabsContent>
                    <TabsContent value="email" className="mt-4">
                       <div className="relative p-4 border rounded-md">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 h-7 w-7"
                          onClick={() => handleCopy(`Hi [Customer Name],\n\nCheck out our new ${form.getValues('productName')}!\n\n${result.productDescription}\n\nShop now!`)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <p className="whitespace-pre-wrap">
                          Hi [Customer Name],<br/><br/>
                          Check out our new {form.getValues('productName')}!<br/><br/>
                          {result.productDescription}<br/><br/>
                          Shop now!
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
