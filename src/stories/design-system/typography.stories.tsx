import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";

const meta: Meta = {
  title: "Design System/Typography",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Complete typography system including font sizes, line heights, and semantic text styles used throughout the Civicship Portal application.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const TypographyExample = ({ 
  className, 
  children, 
  description,
  cssVar,
  fontSize,
  lineHeight 
}: { 
  className: string; 
  children: React.ReactNode;
  description?: string;
  cssVar?: string;
  fontSize?: string;
  lineHeight?: string;
}) => (
  <div className="space-y-2 p-4 border rounded-lg">
    <div className={className}>{children}</div>
    <div className="text-xs text-muted-foreground space-y-1">
      <p><strong>Class:</strong> {className}</p>
      {cssVar && <p><strong>CSS Variable:</strong> {cssVar}</p>}
      {fontSize && <p><strong>Font Size:</strong> {fontSize}</p>}
      {lineHeight && <p><strong>Line Height:</strong> {lineHeight}</p>}
      {description && <p><strong>Usage:</strong> {description}</p>}
    </div>
  </div>
);

export const DisplaySizes: Story = {
  name: "Display Sizes",
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-title-lg mb-4">Display Typography</h2>
        <div className="space-y-4">
          <TypographyExample 
            className="text-display-xl font-bold"
            cssVar="--font-size-huge (32px)"
            lineHeight="--line-height-xs (100%)"
            description="Largest display text for hero sections and major headings"
          >
            Display XL - Hero Headlines
          </TypographyExample>
          
          <TypographyExample 
            className="text-display-lg font-bold"
            cssVar="--font-size-xxl (28px)"
            lineHeight="--line-height-xs (100%)"
            description="Large display text for section headers"
          >
            Display LG - Section Headers
          </TypographyExample>
          
          <TypographyExample 
            className="text-display-md font-bold"
            cssVar="--font-size-xl (24px)"
            lineHeight="--line-height-sm (140%)"
            description="Medium display text for subsection headers"
          >
            Display MD - Subsection Headers
          </TypographyExample>
          
          <TypographyExample 
            className="text-display-sm font-bold"
            cssVar="--font-size-lg (20px)"
            lineHeight="--line-height-sm (140%)"
            description="Small display text for card titles"
          >
            Display SM - Card Titles
          </TypographyExample>
        </div>
      </div>
    </div>
  ),
};

export const TitleSizes: Story = {
  name: "Title Sizes",
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-title-lg mb-4">Title Typography</h2>
        <div className="space-y-4">
          <TypographyExample 
            className="text-title-lg font-semibold"
            cssVar="--font-size-xl (24px)"
            lineHeight="--line-height-sm (140%)"
            description="Large titles for page headers and main sections"
          >
            Title LG - Page Headers
          </TypographyExample>
          
          <TypographyExample 
            className="text-title-md font-semibold"
            cssVar="--font-size-lg (20px)"
            lineHeight="--line-height-sm (140%)"
            description="Medium titles for component headers"
          >
            Title MD - Component Headers
          </TypographyExample>
          
          <TypographyExample 
            className="text-title-sm font-semibold"
            cssVar="--font-size-md (18px)"
            lineHeight="--line-height-sm (140%)"
            description="Small titles for form sections and cards"
          >
            Title SM - Form Sections
          </TypographyExample>
        </div>
      </div>
    </div>
  ),
};

export const BodySizes: Story = {
  name: "Body Text",
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-title-lg mb-4">Body Typography</h2>
        <div className="space-y-4">
          <TypographyExample 
            className="text-body-lg"
            cssVar="--font-size-lg (20px)"
            lineHeight="--line-height-md (160%)"
            description="Large body text for introductions and important content"
          >
            Body LG - This is large body text used for introductions, important descriptions, and content that needs emphasis. It provides excellent readability for key information.
          </TypographyExample>
          
          <TypographyExample 
            className="text-body-md"
            cssVar="--font-size-md (18px)"
            lineHeight="--line-height-md (160%)"
            description="Standard body text for most content"
          >
            Body MD - This is the standard body text used throughout the application. It's the default choice for paragraphs, descriptions, and general content that users will read regularly.
          </TypographyExample>
          
          <TypographyExample 
            className="text-body-sm"
            cssVar="--font-size-sm (16px)"
            lineHeight="--line-height-md (160%)"
            description="Small body text for secondary content"
          >
            Body SM - This is small body text used for secondary information, captions, and content that supports the main text. It's still readable but takes up less visual space.
          </TypographyExample>
          
          <TypographyExample 
            className="text-body-xs"
            cssVar="--font-size-xs (14px)"
            lineHeight="--line-height-md (160%)"
            description="Extra small body text for fine print and metadata"
          >
            Body XS - This is extra small body text used for fine print, metadata, timestamps, and other supporting information that doesn't need to be prominent.
          </TypographyExample>
        </div>
      </div>
    </div>
  ),
};

export const LabelSizes: Story = {
  name: "Label Text",
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-title-lg mb-4">Label Typography</h2>
        <div className="space-y-4">
          <TypographyExample 
            className="text-label-lg font-medium"
            cssVar="--font-size-md (18px)"
            lineHeight="--line-height-sm (140%)"
            description="Large labels for form sections and important UI elements"
          >
            Label LG - Form Section
          </TypographyExample>
          
          <TypographyExample 
            className="text-label-md font-medium"
            cssVar="--font-size-sm (16px)"
            lineHeight="--line-height-sm (140%)"
            description="Standard labels for form fields and buttons"
          >
            Label MD - Form Field
          </TypographyExample>
          
          <TypographyExample 
            className="text-label-sm font-medium"
            cssVar="--font-size-xs (14px)"
            lineHeight="--line-height-sm (140%)"
            description="Small labels for compact UI elements"
          >
            Label SM - Compact Element
          </TypographyExample>
          
          <TypographyExample 
            className="text-label-xs font-medium"
            cssVar="--font-size-xxs (11px)"
            lineHeight="--line-height-sm (140%)"
            description="Extra small labels for badges and status indicators"
          >
            Label XS - Badge
          </TypographyExample>
        </div>
      </div>
    </div>
  ),
};

export const FontWeights: Story = {
  name: "Font Weights",
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-title-lg mb-4">Font Weight Variations</h2>
        <div className="space-y-4">
          <TypographyExample 
            className="text-body-lg font-light"
            description="Light weight for subtle text"
          >
            Font Light (300) - Subtle and elegant text
          </TypographyExample>
          
          <TypographyExample 
            className="text-body-lg font-normal"
            description="Normal weight for regular text"
          >
            Font Normal (400) - Standard body text weight
          </TypographyExample>
          
          <TypographyExample 
            className="text-body-lg font-medium"
            description="Medium weight for emphasis"
          >
            Font Medium (500) - Emphasized text and labels
          </TypographyExample>
          
          <TypographyExample 
            className="text-body-lg font-semibold"
            description="Semibold weight for headings"
          >
            Font Semibold (600) - Headings and important text
          </TypographyExample>
          
          <TypographyExample 
            className="text-body-lg font-bold"
            description="Bold weight for strong emphasis"
          >
            Font Bold (700) - Strong emphasis and titles
          </TypographyExample>
        </div>
      </div>
    </div>
  ),
};

export const LineHeights: Story = {
  name: "Line Heights",
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-title-lg mb-4">Line Height Variations</h2>
        <div className="space-y-4">
          <TypographyExample 
            className="text-body-md leading-xs"
            cssVar="--line-height-xs (100%)"
            description="Tight line height for headings and display text"
          >
            Line Height XS (100%) - This text uses tight line spacing, which is ideal for headings, display text, and situations where you want to minimize vertical space while maintaining readability.
          </TypographyExample>
          
          <TypographyExample 
            className="text-body-md leading-sm"
            cssVar="--line-height-sm (140%)"
            description="Medium line height for labels and short text"
          >
            Line Height SM (140%) - This text uses medium line spacing, which works well for labels, short paragraphs, and UI elements where you want balanced spacing without too much vertical space.
          </TypographyExample>
          
          <TypographyExample 
            className="text-body-md leading-md"
            cssVar="--line-height-md (160%)"
            description="Comfortable line height for body text and reading"
          >
            Line Height MD (160%) - This text uses comfortable line spacing, which is perfect for body text, long-form content, and any text that users will read extensively. It provides excellent readability and reduces eye strain.
          </TypographyExample>
        </div>
      </div>
    </div>
  ),
};

export const TypographyScale: Story = {
  name: "Complete Typography Scale",
  render: () => (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-display-xl mb-2">Typography Scale</h1>
        <p className="text-body-lg text-muted-foreground">
          Complete overview of all typography styles used throughout the application
        </p>
      </div>
      
      <div className="space-y-6">
        <div>
          <h2 className="text-title-md mb-4">Size Hierarchy</h2>
          <div className="space-y-3">
            <div className="text-display-xl">Display XL (32px) - Hero Headlines</div>
            <div className="text-display-lg">Display LG (28px) - Section Headers</div>
            <div className="text-display-md">Display MD (24px) - Subsection Headers</div>
            <div className="text-display-sm">Display SM (20px) - Card Titles</div>
            <div className="text-title-lg">Title LG (24px) - Page Headers</div>
            <div className="text-title-md">Title MD (20px) - Component Headers</div>
            <div className="text-title-sm">Title SM (18px) - Form Sections</div>
            <div className="text-body-lg">Body LG (20px) - Introduction Text</div>
            <div className="text-body-md">Body MD (18px) - Standard Body Text</div>
            <div className="text-body-sm">Body SM (16px) - Secondary Content</div>
            <div className="text-body-xs">Body XS (14px) - Fine Print</div>
            <div className="text-label-lg">Label LG (18px) - Form Section Labels</div>
            <div className="text-label-md">Label MD (16px) - Form Field Labels</div>
            <div className="text-label-sm">Label SM (14px) - Compact Labels</div>
            <div className="text-label-xs">Label XS (11px) - Badge Labels</div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const UsageExamples: Story = {
  name: "Usage Examples",
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-title-lg mb-4">Real-world Usage Examples</h2>
        
        <div className="space-y-8">
          {/* Article Example */}
          <div className="border rounded-lg p-6">
            <h3 className="text-display-md mb-4">Article Layout</h3>
            <h1 className="text-display-lg mb-2">Community Event: Summer Festival 2024</h1>
            <p className="text-body-sm text-muted-foreground mb-4">Published on July 15, 2024 • 5 min read</p>
            <p className="text-body-lg mb-4">
              Join us for an exciting summer festival featuring local artists, food vendors, and family-friendly activities.
            </p>
            <p className="text-body-md mb-4">
              This year's festival will take place at Central Park and will feature over 50 local vendors, live music performances, and interactive workshops for all ages. The event is designed to bring our community together and celebrate local culture.
            </p>
            <div className="text-label-sm text-muted-foreground">
              Tags: Community, Events, Summer, Festival
            </div>
          </div>

          {/* Form Example */}
          <div className="border rounded-lg p-6">
            <h3 className="text-display-md mb-4">Form Layout</h3>
            <h2 className="text-title-lg mb-2">Event Registration</h2>
            <p className="text-body-md text-muted-foreground mb-6">
              Please fill out the form below to register for the event.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="text-label-md font-medium block mb-2">Full Name</label>
                <div className="border rounded p-2 text-body-sm text-muted-foreground">
                  Enter your full name
                </div>
              </div>
              
              <div>
                <label className="text-label-md font-medium block mb-2">Email Address</label>
                <div className="border rounded p-2 text-body-sm text-muted-foreground">
                  Enter your email
                </div>
                <p className="text-body-xs text-muted-foreground mt-1">
                  We'll use this to send you event updates
                </p>
              </div>
            </div>
          </div>

          {/* Card Example */}
          <div className="border rounded-lg p-6">
            <h3 className="text-display-md mb-4">Card Layout</h3>
            <div className="border rounded-lg p-4">
              <h4 className="text-title-md mb-2">Volunteer Opportunity</h4>
              <p className="text-body-sm text-muted-foreground mb-3">Community Garden • 2 hours</p>
              <p className="text-body-md mb-4">
                Help maintain our community garden by planting new vegetables and flowers.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-label-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                  Available
                </span>
                <span className="text-body-xs text-muted-foreground">
                  5 spots remaining
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};
