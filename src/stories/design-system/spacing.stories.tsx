import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";

const meta: Meta = {
  title: "Design System/Spacing",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Complete spacing system including margins, padding, gaps, and layout spacing used throughout the Civicship Portal application.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const SpacingExample = ({ 
  size, 
  className, 
  description,
  pixels 
}: { 
  size: string; 
  className: string;
  description?: string;
  pixels: string;
}) => (
  <div className="space-y-2">
    <div className="flex items-center space-x-4">
      <div className="w-16 text-label-sm font-mono">{size}</div>
      <div className="w-16 text-label-xs text-muted-foreground">{pixels}</div>
      <div className="flex-1">
        <div className="bg-blue-100 border border-blue-300 rounded">
          <div className={`bg-blue-500 h-4 ${className}`}></div>
        </div>
      </div>
    </div>
    {description && (
      <p className="text-body-xs text-muted-foreground ml-36">{description}</p>
    )}
  </div>
);

const PaddingExample = ({ 
  size, 
  className, 
  description,
  pixels 
}: { 
  size: string; 
  className: string;
  description?: string;
  pixels: string;
}) => (
  <div className="space-y-2">
    <div className="flex items-center space-x-4">
      <div className="w-16 text-label-sm font-mono">{size}</div>
      <div className="w-16 text-label-xs text-muted-foreground">{pixels}</div>
      <div className="flex-1">
        <div className={`bg-blue-100 border border-blue-300 rounded ${className}`}>
          <div className="bg-blue-500 h-8 rounded text-white text-center text-label-xs leading-8">
            Content
          </div>
        </div>
      </div>
    </div>
    {description && (
      <p className="text-body-xs text-muted-foreground ml-36">{description}</p>
    )}
  </div>
);

const GapExample = ({ 
  size, 
  className, 
  description,
  pixels 
}: { 
  size: string; 
  className: string;
  description?: string;
  pixels: string;
}) => (
  <div className="space-y-2">
    <div className="flex items-center space-x-4">
      <div className="w-16 text-label-sm font-mono">{size}</div>
      <div className="w-16 text-label-xs text-muted-foreground">{pixels}</div>
      <div className="flex-1">
        <div className={`flex ${className}`}>
          <div className="bg-blue-500 h-8 w-16 rounded text-white text-center text-label-xs leading-8">1</div>
          <div className="bg-blue-500 h-8 w-16 rounded text-white text-center text-label-xs leading-8">2</div>
          <div className="bg-blue-500 h-8 w-16 rounded text-white text-center text-label-xs leading-8">3</div>
        </div>
      </div>
    </div>
    {description && (
      <p className="text-body-xs text-muted-foreground ml-36">{description}</p>
    )}
  </div>
);

export const MarginScale: Story = {
  name: "Margin Scale",
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-title-lg mb-4">Margin Spacing</h2>
        <p className="text-body-md text-muted-foreground mb-6">
          Margin values used for spacing elements from their surroundings.
        </p>
        <div className="space-y-4">
          <SpacingExample size="m-0" className="m-0" pixels="0px" description="No margin" />
          <SpacingExample size="m-px" className="m-px" pixels="1px" description="1px margin for fine borders" />
          <SpacingExample size="m-0.5" className="m-0.5" pixels="2px" description="Minimal margin" />
          <SpacingExample size="m-1" className="m-1" pixels="4px" description="Extra small margin" />
          <SpacingExample size="m-1.5" className="m-1.5" pixels="6px" description="Small margin" />
          <SpacingExample size="m-2" className="m-2" pixels="8px" description="Small margin for tight layouts" />
          <SpacingExample size="m-2.5" className="m-2.5" pixels="10px" description="Medium-small margin" />
          <SpacingExample size="m-3" className="m-3" pixels="12px" description="Medium margin for components" />
          <SpacingExample size="m-3.5" className="m-3.5" pixels="14px" description="Medium-large margin" />
          <SpacingExample size="m-4" className="m-4" pixels="16px" description="Standard margin for cards and sections" />
          <SpacingExample size="m-5" className="m-5" pixels="20px" description="Large margin for separation" />
          <SpacingExample size="m-6" className="m-6" pixels="24px" description="Extra large margin" />
          <SpacingExample size="m-8" className="m-8" pixels="32px" description="Section margin" />
          <SpacingExample size="m-10" className="m-10" pixels="40px" description="Large section margin" />
          <SpacingExample size="m-12" className="m-12" pixels="48px" description="Page section margin" />
          <SpacingExample size="m-16" className="m-16" pixels="64px" description="Major section margin" />
        </div>
      </div>
    </div>
  ),
};

export const PaddingScale: Story = {
  name: "Padding Scale",
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-title-lg mb-4">Padding Spacing</h2>
        <p className="text-body-md text-muted-foreground mb-6">
          Padding values used for internal spacing within elements.
        </p>
        <div className="space-y-4">
          <PaddingExample size="p-0" className="p-0" pixels="0px" description="No padding" />
          <PaddingExample size="p-px" className="p-px" pixels="1px" description="1px padding for fine spacing" />
          <PaddingExample size="p-0.5" className="p-0.5" pixels="2px" description="Minimal padding" />
          <PaddingExample size="p-1" className="p-1" pixels="4px" description="Extra small padding for badges" />
          <PaddingExample size="p-1.5" className="p-1.5" pixels="6px" description="Small padding" />
          <PaddingExample size="p-2" className="p-2" pixels="8px" description="Small padding for buttons" />
          <PaddingExample size="p-2.5" className="p-2.5" pixels="10px" description="Medium-small padding" />
          <PaddingExample size="p-3" className="p-3" pixels="12px" description="Medium padding for form fields" />
          <PaddingExample size="p-3.5" className="p-3.5" pixels="14px" description="Medium-large padding" />
          <PaddingExample size="p-4" className="p-4" pixels="16px" description="Standard padding for cards" />
          <PaddingExample size="p-5" className="p-5" pixels="20px" description="Large padding for containers" />
          <PaddingExample size="p-6" className="p-6" pixels="24px" description="Extra large padding" />
          <PaddingExample size="p-8" className="p-8" pixels="32px" description="Section padding" />
          <PaddingExample size="p-10" className="p-10" pixels="40px" description="Large section padding" />
          <PaddingExample size="p-12" className="p-12" pixels="48px" description="Page padding" />
          <PaddingExample size="p-16" className="p-16" pixels="64px" description="Major section padding" />
        </div>
      </div>
    </div>
  ),
};

export const GapScale: Story = {
  name: "Gap Scale",
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-title-lg mb-4">Gap Spacing</h2>
        <p className="text-body-md text-muted-foreground mb-6">
          Gap values used for spacing between flex and grid items.
        </p>
        <div className="space-y-4">
          <GapExample size="gap-0" className="gap-0" pixels="0px" description="No gap" />
          <GapExample size="gap-px" className="gap-px" pixels="1px" description="1px gap for fine separation" />
          <GapExample size="gap-0.5" className="gap-0.5" pixels="2px" description="Minimal gap" />
          <GapExample size="gap-1" className="gap-1" pixels="4px" description="Extra small gap" />
          <GapExample size="gap-1.5" className="gap-1.5" pixels="6px" description="Small gap" />
          <GapExample size="gap-2" className="gap-2" pixels="8px" description="Small gap for tight layouts" />
          <GapExample size="gap-2.5" className="gap-2.5" pixels="10px" description="Medium-small gap" />
          <GapExample size="gap-3" className="gap-3" pixels="12px" description="Medium gap for form elements" />
          <GapExample size="gap-3.5" className="gap-3.5" pixels="14px" description="Medium-large gap" />
          <GapExample size="gap-4" className="gap-4" pixels="16px" description="Standard gap for components" />
          <GapExample size="gap-5" className="gap-5" pixels="20px" description="Large gap for separation" />
          <GapExample size="gap-6" className="gap-6" pixels="24px" description="Extra large gap" />
          <GapExample size="gap-8" className="gap-8" pixels="32px" description="Section gap" />
          <GapExample size="gap-10" className="gap-10" pixels="40px" description="Large section gap" />
          <GapExample size="gap-12" className="gap-12" pixels="48px" description="Page section gap" />
          <GapExample size="gap-16" className="gap-16" pixels="64px" description="Major section gap" />
        </div>
      </div>
    </div>
  ),
};

export const SpaceScale: Story = {
  name: "Space Scale",
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-title-lg mb-4">Space-Y Scale</h2>
        <p className="text-body-md text-muted-foreground mb-6">
          Vertical spacing between stacked elements using space-y utilities.
        </p>
        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <h4 className="text-title-sm mb-2">space-y-1 (4px)</h4>
            <div className="space-y-1">
              <div className="bg-blue-500 h-6 rounded text-white text-center text-label-xs leading-6">Item 1</div>
              <div className="bg-blue-500 h-6 rounded text-white text-center text-label-xs leading-6">Item 2</div>
              <div className="bg-blue-500 h-6 rounded text-white text-center text-label-xs leading-6">Item 3</div>
            </div>
          </div>
          
          <div className="border rounded-lg p-4">
            <h4 className="text-title-sm mb-2">space-y-2 (8px)</h4>
            <div className="space-y-2">
              <div className="bg-green-500 h-6 rounded text-white text-center text-label-xs leading-6">Item 1</div>
              <div className="bg-green-500 h-6 rounded text-white text-center text-label-xs leading-6">Item 2</div>
              <div className="bg-green-500 h-6 rounded text-white text-center text-label-xs leading-6">Item 3</div>
            </div>
          </div>
          
          <div className="border rounded-lg p-4">
            <h4 className="text-title-sm mb-2">space-y-4 (16px)</h4>
            <div className="space-y-4">
              <div className="bg-purple-500 h-6 rounded text-white text-center text-label-xs leading-6">Item 1</div>
              <div className="bg-purple-500 h-6 rounded text-white text-center text-label-xs leading-6">Item 2</div>
              <div className="bg-purple-500 h-6 rounded text-white text-center text-label-xs leading-6">Item 3</div>
            </div>
          </div>
          
          <div className="border rounded-lg p-4">
            <h4 className="text-title-sm mb-2">space-y-6 (24px)</h4>
            <div className="space-y-6">
              <div className="bg-red-500 h-6 rounded text-white text-center text-label-xs leading-6">Item 1</div>
              <div className="bg-red-500 h-6 rounded text-white text-center text-label-xs leading-6">Item 2</div>
              <div className="bg-red-500 h-6 rounded text-white text-center text-label-xs leading-6">Item 3</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const LayoutExamples: Story = {
  name: "Layout Examples",
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-title-lg mb-4">Real-world Layout Examples</h2>
        
        <div className="space-y-8">
          {/* Card Layout */}
          <div className="border rounded-lg">
            <h3 className="text-title-md p-4 border-b">Card Layout (p-4, space-y-3)</h3>
            <div className="p-4 space-y-3">
              <h4 className="text-title-sm">Event Title</h4>
              <p className="text-body-sm text-muted-foreground">Event description with proper spacing</p>
              <div className="flex items-center gap-2">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-label-xs">Tag 1</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-label-xs">Tag 2</span>
              </div>
            </div>
          </div>

          {/* Form Layout */}
          <div className="border rounded-lg">
            <h3 className="text-title-md p-4 border-b">Form Layout (p-6, space-y-4)</h3>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-label-md font-medium">Name</label>
                <div className="border rounded p-3 text-body-sm text-muted-foreground">Enter your name</div>
              </div>
              <div className="space-y-2">
                <label className="text-label-md font-medium">Email</label>
                <div className="border rounded p-3 text-body-sm text-muted-foreground">Enter your email</div>
              </div>
              <div className="flex gap-3 pt-2">
                <button className="bg-blue-500 text-white px-4 py-2 rounded text-label-md">Submit</button>
                <button className="border px-4 py-2 rounded text-label-md">Cancel</button>
              </div>
            </div>
          </div>

          {/* Grid Layout */}
          <div className="border rounded-lg">
            <h3 className="text-title-md p-4 border-b">Grid Layout (p-4, gap-4)</h3>
            <div className="p-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-100 p-3 rounded text-center text-label-sm">Item 1</div>
                <div className="bg-gray-100 p-3 rounded text-center text-label-sm">Item 2</div>
                <div className="bg-gray-100 p-3 rounded text-center text-label-sm">Item 3</div>
                <div className="bg-gray-100 p-3 rounded text-center text-label-sm">Item 4</div>
                <div className="bg-gray-100 p-3 rounded text-center text-label-sm">Item 5</div>
                <div className="bg-gray-100 p-3 rounded text-center text-label-sm">Item 6</div>
              </div>
            </div>
          </div>

          {/* Navigation Layout */}
          <div className="border rounded-lg">
            <h3 className="text-title-md p-4 border-b">Navigation Layout (px-6, py-3, gap-6)</h3>
            <div className="px-6 py-3">
              <div className="flex items-center gap-6">
                <div className="text-title-sm font-semibold">Logo</div>
                <div className="flex gap-4">
                  <a href="#" className="text-label-md hover:text-blue-600">Home</a>
                  <a href="#" className="text-label-md hover:text-blue-600">About</a>
                  <a href="#" className="text-label-md hover:text-blue-600">Contact</a>
                </div>
                <div className="ml-auto">
                  <button className="bg-blue-500 text-white px-3 py-1.5 rounded text-label-sm">Sign In</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const SpacingSystem: Story = {
  name: "Complete Spacing System",
  render: () => (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-display-xl mb-2">Spacing System</h1>
        <p className="text-body-lg text-muted-foreground">
          Complete overview of all spacing values used throughout the application
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-title-md">Common Spacing Values</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 border rounded">
              <span className="text-label-sm font-mono">0</span>
              <span className="text-body-xs text-muted-foreground">0px</span>
            </div>
            <div className="flex items-center justify-between p-2 border rounded">
              <span className="text-label-sm font-mono">1</span>
              <span className="text-body-xs text-muted-foreground">4px</span>
            </div>
            <div className="flex items-center justify-between p-2 border rounded">
              <span className="text-label-sm font-mono">2</span>
              <span className="text-body-xs text-muted-foreground">8px</span>
            </div>
            <div className="flex items-center justify-between p-2 border rounded">
              <span className="text-label-sm font-mono">3</span>
              <span className="text-body-xs text-muted-foreground">12px</span>
            </div>
            <div className="flex items-center justify-between p-2 border rounded">
              <span className="text-label-sm font-mono">4</span>
              <span className="text-body-xs text-muted-foreground">16px</span>
            </div>
            <div className="flex items-center justify-between p-2 border rounded">
              <span className="text-label-sm font-mono">6</span>
              <span className="text-body-xs text-muted-foreground">24px</span>
            </div>
            <div className="flex items-center justify-between p-2 border rounded">
              <span className="text-label-sm font-mono">8</span>
              <span className="text-body-xs text-muted-foreground">32px</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-title-md">Usage Guidelines</h2>
          <div className="space-y-3 text-body-sm">
            <div className="p-3 bg-blue-50 rounded">
              <strong>4px (1):</strong> Minimal spacing for badges and tight layouts
            </div>
            <div className="p-3 bg-green-50 rounded">
              <strong>8px (2):</strong> Small spacing for buttons and form elements
            </div>
            <div className="p-3 bg-yellow-50 rounded">
              <strong>12px (3):</strong> Medium spacing for component internal spacing
            </div>
            <div className="p-3 bg-purple-50 rounded">
              <strong>16px (4):</strong> Standard spacing for cards and containers
            </div>
            <div className="p-3 bg-pink-50 rounded">
              <strong>24px (6):</strong> Large spacing for section separation
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <strong>32px (8):</strong> Extra large spacing for major sections
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};
