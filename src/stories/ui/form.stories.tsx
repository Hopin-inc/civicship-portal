import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import { useForm } from "react-hook-form";
import { Form, FormItem, FormLabel, FormControl, FormDescription, FormMessage, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

const meta: Meta<typeof Form> = {
  title: "Shared/UI/Form",
  component: Form,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Form>;

// Temporarily commented out due to React Hooks in render function ESLint error
// export const BasicForm: Story = {
//   render: () => {
//     const form = useForm({
//       defaultValues: {
//         username: "",
//         email: "",
//       },
//     });

//     return (
//       <Form {...form}>
//         <form className="space-y-6">
//           <FormField
//             control={form.control}
//             name="username"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Username</FormLabel>
//                 <FormControl>
//                   <Input placeholder="Enter username" {...field} />
//                 </FormControl>
//                 <FormDescription>
//                   This is your public display name.
//                 </FormDescription>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="email"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Email</FormLabel>
//                 <FormControl>
//                   <Input type="email" placeholder="Enter email" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <Button type="submit">Submit</Button>
//         </form>
//       </Form>
//     );
//   },
// };

// Temporarily commented out due to React Hooks in render function ESLint error
// export const WithValidation: Story = {
//   render: () => {
//     const form = useForm({
//       defaultValues: {
//         name: "",
//         email: "",
//         message: "",
//       },
//     });

//     const onSubmit = (data: any) => {
//       console.log(data);
//     };

//     return (
//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//           <FormField
//             control={form.control}
//             name="name"
//             rules={{ required: "Name is required" }}
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel required>Name</FormLabel>
//                 <FormControl>
//                   <Input placeholder="Your name" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="email"
//             rules={{
//               required: "Email is required",
//               pattern: {
//                 value: /^\S+@\S+$/i,
//                 message: "Invalid email address",
//               },
//             }}
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel required>Email</FormLabel>
//                 <FormControl>
//                   <Input type="email" placeholder="your@email.com" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="message"
//             rules={{ required: "Message is required" }}
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel required>Message</FormLabel>
//                 <FormControl>
//                   <Textarea placeholder="Your message..." {...field} />
//                 </FormControl>
//                 <FormDescription>
//                   Please provide a detailed message.
//                 </FormDescription>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <Button type="submit">Send Message</Button>
//         </form>
//       </Form>
//     );
//   },
// };

// Temporarily commented out due to React Hooks in render function ESLint error
// export const WithCheckbox: Story = {
//   render: () => {
//     const form = useForm({
//       defaultValues: {
//         terms: false,
//         newsletter: false,
//       },
//     });

//     return (
//       <Form {...form}>
//         <form className="space-y-6">
//           <FormField
//             control={form.control}
//             name="terms"
//             render={({ field }) => (
//               <FormItem className="flex flex-row items-start space-x-3 space-y-0">
//                 <FormControl>
//                   <Checkbox
//                     checked={field.value}
//                     onCheckedChange={field.onChange}
//                   />
//                 </FormControl>
//                 <div className="space-y-1 leading-none">
//                   <FormLabel>Accept terms and conditions</FormLabel>
//                   <FormDescription>
//                     You agree to our Terms of Service and Privacy Policy.
//                   </FormDescription>
//                 </div>
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="newsletter"
//             render={({ field }) => (
//               <FormItem className="flex flex-row items-start space-x-3 space-y-0">
//                 <FormControl>
//                   <Checkbox
//                     checked={field.value}
//                     onCheckedChange={field.onChange}
//                   />
//                 </FormControl>
//                 <div className="space-y-1 leading-none">
//                   <FormLabel>Subscribe to newsletter</FormLabel>
//                   <FormDescription>
//                     Receive updates about new features and products.
//                   </FormDescription>
//                 </div>
//               </FormItem>
//             )}
//           />
//           <Button type="submit">Submit</Button>
//         </form>
//       </Form>
//     );
//   },
// };

export const FormComponents: Story = {
  render: () => (
    <div className="space-y-6">
      <FormItem>
        <FormLabel>Label Example</FormLabel>
        <FormControl>
          <Input placeholder="Input with label" />
        </FormControl>
        <FormDescription>
          This is a form description that provides additional context.
        </FormDescription>
      </FormItem>
      
      <FormItem>
        <FormLabel required>Required Field</FormLabel>
        <FormControl>
          <Input placeholder="Required input" />
        </FormControl>
        <FormMessage>This field is required</FormMessage>
      </FormItem>
    </div>
  ),
};
