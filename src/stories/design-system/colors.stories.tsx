import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";

const meta: Meta = {
  title: "Design System/Colors",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Complete color palette including semantic colors, brand colors, status colors, and the full Tailwind color spectrum used throughout the Civicship Portal application.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const ColorSwatch = ({ 
  name, 
  className, 
  cssVar, 
  description 
}: { 
  name: string; 
  className: string; 
  cssVar?: string;
  description?: string;
}) => (
  <div className="space-y-2">
    <div className={`h-16 w-full rounded-lg border ${className} flex items-end p-2`}>
      <span className="text-xs font-mono bg-black/20 text-white px-1 rounded">
        {cssVar || className}
      </span>
    </div>
    <div>
      <p className="text-label-sm font-medium">{name}</p>
      {description && <p className="text-body-xs text-muted-foreground">{description}</p>}
    </div>
  </div>
);

export const SemanticColors: Story = {
  name: "Semantic Colors",
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-title-lg mb-4">Primary & Secondary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <ColorSwatch 
            name="Primary" 
            className="bg-primary text-primary-foreground" 
            cssVar="--primary"
            description="Main brand color for buttons and links"
          />
          <ColorSwatch 
            name="Primary Hover" 
            className="bg-primary-hover text-primary-foreground" 
            cssVar="--primary-hover"
            description="Hover state for primary elements"
          />
          <ColorSwatch 
            name="Secondary" 
            className="bg-secondary text-secondary-foreground border" 
            cssVar="--secondary"
            description="Secondary actions and backgrounds"
          />
          <ColorSwatch 
            name="Secondary Hover" 
            className="bg-secondary-hover text-secondary-foreground" 
            cssVar="--secondary-hover"
            description="Hover state for secondary elements"
          />
        </div>
      </div>

      <div>
        <h2 className="text-title-lg mb-4">Feedback Colors</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <ColorSwatch 
            name="Success" 
            className="bg-success text-success-foreground" 
            cssVar="--success"
            description="Success states and positive feedback"
          />
          <ColorSwatch 
            name="Warning" 
            className="bg-warning text-warning-foreground" 
            cssVar="--warning"
            description="Warning states and caution"
          />
          <ColorSwatch 
            name="Danger" 
            className="bg-danger text-danger-foreground" 
            cssVar="--danger"
            description="Error states and destructive actions"
          />
          <ColorSwatch 
            name="Destructive" 
            className="bg-destructive text-destructive-foreground" 
            cssVar="--destructive"
            description="Destructive actions like delete"
          />
        </div>
      </div>

      <div>
        <h2 className="text-title-lg mb-4">Neutral Colors</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <ColorSwatch 
            name="Background" 
            className="bg-background text-foreground border" 
            cssVar="--background"
            description="Main background color"
          />
          <ColorSwatch 
            name="Foreground" 
            className="bg-foreground text-background" 
            cssVar="--foreground"
            description="Main text color"
          />
          <ColorSwatch 
            name="Muted" 
            className="bg-muted text-muted-foreground" 
            cssVar="--muted"
            description="Muted backgrounds and subtle elements"
          />
          <ColorSwatch 
            name="Accent" 
            className="bg-accent text-accent-foreground" 
            cssVar="--accent"
            description="Accent color for highlights"
          />
        </div>
      </div>
    </div>
  ),
};

export const BrandColors: Story = {
  name: "Brand Colors",
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-title-lg mb-4">Social Media Brands</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <ColorSwatch 
            name="LINE" 
            className="bg-[hsl(var(--brand-line))] text-white" 
            cssVar="--brand-line"
            description="LINE messaging platform"
          />
          <ColorSwatch 
            name="Facebook" 
            className="bg-[hsl(var(--brand-facebook))] text-white" 
            cssVar="--brand-facebook"
            description="Facebook social platform"
          />
          <ColorSwatch 
            name="Twitter" 
            className="bg-[hsl(var(--brand-twitter))] text-white" 
            cssVar="--brand-twitter"
            description="Twitter social platform"
          />
          <ColorSwatch 
            name="Instagram" 
            className="bg-[hsl(var(--brand-instagram))] text-white" 
            cssVar="--brand-instagram"
            description="Instagram social platform"
          />
        </div>
      </div>
    </div>
  ),
};

export const StatusColors: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-title-lg mb-4">Reservation & Activity Status</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <ColorSwatch 
            name="Pending" 
            className="bg-status-pending text-status-pending-foreground" 
            cssVar="--status-pending"
            description="Awaiting approval or processing"
          />
          <ColorSwatch 
            name="Approved" 
            className="bg-status-approved text-status-approved-foreground" 
            cssVar="--status-approved"
            description="Approved and confirmed"
          />
          <ColorSwatch 
            name="Rejected" 
            className="bg-status-rejected text-status-rejected-foreground" 
            cssVar="--status-rejected"
            description="Rejected or declined"
          />
          <ColorSwatch 
            name="Completed" 
            className="bg-status-completed text-status-completed-foreground" 
            cssVar="--status-completed"
            description="Successfully completed"
          />
          <ColorSwatch 
            name="Cancelled" 
            className="bg-status-cancelled text-status-cancelled-foreground" 
            cssVar="--status-cancelled"
            description="Cancelled by user or system"
          />
        </div>
      </div>
    </div>
  ),
};

export const CategoryColors: Story = {
  name: "Category Colors",
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-title-lg mb-4">Content Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <ColorSwatch 
            name="Event" 
            className="bg-[hsl(var(--category-event))] text-white" 
            cssVar="--category-event"
            description="Events and activities"
          />
          <ColorSwatch 
            name="Opportunity" 
            className="bg-[hsl(var(--category-opportunity))] text-white" 
            cssVar="--category-opportunity"
            description="Volunteer opportunities"
          />
          <ColorSwatch 
            name="Article" 
            className="bg-[hsl(var(--category-article))] text-white" 
            cssVar="--category-article"
            description="Articles and blog posts"
          />
          <ColorSwatch 
            name="Place" 
            className="bg-[hsl(var(--category-place))] text-white" 
            cssVar="--category-place"
            description="Locations and venues"
          />
          <ColorSwatch 
            name="Default" 
            className="bg-[hsl(var(--category-default))] text-white" 
            cssVar="--category-default"
            description="Default category color"
          />
        </div>
      </div>
    </div>
  ),
};

export const TailwindColors: Story = {
  name: "Tailwind Color Palette",
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-title-lg mb-4">Blue Spectrum</h2>
        <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
          <ColorSwatch name="50" className="bg-blue-50 text-blue-900" cssVar="blue-50" />
          <ColorSwatch name="100" className="bg-blue-100 text-blue-900" cssVar="blue-100" />
          <ColorSwatch name="200" className="bg-blue-200 text-blue-900" cssVar="blue-200" />
          <ColorSwatch name="300" className="bg-blue-300 text-blue-900" cssVar="blue-300" />
          <ColorSwatch name="400" className="bg-blue-400 text-white" cssVar="blue-400" />
          <ColorSwatch name="500" className="bg-blue-500 text-white" cssVar="blue-500" />
          <ColorSwatch name="600" className="bg-blue-600 text-white" cssVar="blue-600" />
          <ColorSwatch name="700" className="bg-blue-700 text-white" cssVar="blue-700" />
          <ColorSwatch name="800" className="bg-blue-800 text-white" cssVar="blue-800" />
          <ColorSwatch name="900" className="bg-blue-900 text-white" cssVar="blue-900" />
        </div>
      </div>

      <div>
        <h2 className="text-title-lg mb-4">Green Spectrum</h2>
        <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
          <ColorSwatch name="50" className="bg-green-50 text-green-900" cssVar="green-50" />
          <ColorSwatch name="100" className="bg-green-100 text-green-900" cssVar="green-100" />
          <ColorSwatch name="200" className="bg-green-200 text-green-900" cssVar="green-200" />
          <ColorSwatch name="300" className="bg-green-300 text-green-900" cssVar="green-300" />
          <ColorSwatch name="400" className="bg-green-400 text-white" cssVar="green-400" />
          <ColorSwatch name="500" className="bg-green-500 text-white" cssVar="green-500" />
          <ColorSwatch name="600" className="bg-green-600 text-white" cssVar="green-600" />
          <ColorSwatch name="700" className="bg-green-700 text-white" cssVar="green-700" />
          <ColorSwatch name="800" className="bg-green-800 text-white" cssVar="green-800" />
          <ColorSwatch name="900" className="bg-green-900 text-white" cssVar="green-900" />
        </div>
      </div>

      <div>
        <h2 className="text-title-lg mb-4">Red Spectrum</h2>
        <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
          <ColorSwatch name="50" className="bg-red-50 text-red-900" cssVar="red-50" />
          <ColorSwatch name="100" className="bg-red-100 text-red-900" cssVar="red-100" />
          <ColorSwatch name="200" className="bg-red-200 text-red-900" cssVar="red-200" />
          <ColorSwatch name="300" className="bg-red-300 text-red-900" cssVar="red-300" />
          <ColorSwatch name="400" className="bg-red-400 text-white" cssVar="red-400" />
          <ColorSwatch name="500" className="bg-red-500 text-white" cssVar="red-500" />
          <ColorSwatch name="600" className="bg-red-600 text-white" cssVar="red-600" />
          <ColorSwatch name="700" className="bg-red-700 text-white" cssVar="red-700" />
          <ColorSwatch name="800" className="bg-red-800 text-white" cssVar="red-800" />
          <ColorSwatch name="900" className="bg-red-900 text-white" cssVar="red-900" />
        </div>
      </div>

      <div>
        <h2 className="text-title-lg mb-4">Gray Spectrum</h2>
        <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
          <ColorSwatch name="50" className="bg-gray-50 text-gray-900 border" cssVar="gray-50" />
          <ColorSwatch name="100" className="bg-gray-100 text-gray-900" cssVar="gray-100" />
          <ColorSwatch name="200" className="bg-gray-200 text-gray-900" cssVar="gray-200" />
          <ColorSwatch name="300" className="bg-gray-300 text-gray-900" cssVar="gray-300" />
          <ColorSwatch name="400" className="bg-gray-400 text-white" cssVar="gray-400" />
          <ColorSwatch name="500" className="bg-gray-500 text-white" cssVar="gray-500" />
          <ColorSwatch name="600" className="bg-gray-600 text-white" cssVar="gray-600" />
          <ColorSwatch name="700" className="bg-gray-700 text-white" cssVar="gray-700" />
          <ColorSwatch name="800" className="bg-gray-800 text-white" cssVar="gray-800" />
          <ColorSwatch name="900" className="bg-gray-900 text-white" cssVar="gray-900" />
        </div>
      </div>
    </div>
  ),
};

export const AllColors: Story = {
  name: "Complete Color System",
  render: () => (
    <div className="space-y-12">
      <div className="text-center">
        <h1 className="text-display-lg mb-2">Civicship Portal Color System</h1>
        <p className="text-body-lg text-muted-foreground">
          Complete overview of all colors used throughout the application
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h2 className="text-title-md">Semantic Colors</h2>
          <div className="grid grid-cols-2 gap-3">
            <ColorSwatch name="Primary" className="bg-primary text-primary-foreground" />
            <ColorSwatch name="Secondary" className="bg-secondary text-secondary-foreground border" />
            <ColorSwatch name="Success" className="bg-success text-success-foreground" />
            <ColorSwatch name="Warning" className="bg-warning text-warning-foreground" />
            <ColorSwatch name="Danger" className="bg-danger text-danger-foreground" />
            <ColorSwatch name="Muted" className="bg-muted text-muted-foreground" />
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-title-md">Status Colors</h2>
          <div className="grid grid-cols-2 gap-3">
            <ColorSwatch name="Pending" className="bg-status-pending text-white" />
            <ColorSwatch name="Approved" className="bg-status-approved text-white" />
            <ColorSwatch name="Rejected" className="bg-status-rejected text-white" />
            <ColorSwatch name="Completed" className="bg-status-completed text-white" />
            <ColorSwatch name="Cancelled" className="bg-status-cancelled text-white" />
          </div>
        </div>
      </div>
    </div>
  ),
};
