import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";

const meta: Meta = {
  title: "Design System/Shadows",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Complete shadow system including elevation levels, focus states, and depth effects used throughout the Civicship Portal application.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const ShadowExample = ({ 
  name, 
  className, 
  description,
  cssValue 
}: { 
  name: string; 
  className: string;
  description?: string;
  cssValue?: string;
}) => (
  <div className="space-y-3">
    <div className="flex items-center justify-center h-24 bg-white rounded-lg border">
      <div className={`w-16 h-16 bg-white rounded-lg ${className} flex items-center justify-center`}>
        <span className="text-label-xs text-gray-600">{name}</span>
      </div>
    </div>
    <div className="text-center space-y-1">
      <p className="text-label-sm font-medium">{name}</p>
      {cssValue && <p className="text-body-xs text-muted-foreground font-mono">{cssValue}</p>}
      {description && <p className="text-body-xs text-muted-foreground">{description}</p>}
    </div>
  </div>
);

const InteractiveShadowExample = ({ 
  name, 
  baseClassName, 
  hoverClassName,
  description 
}: { 
  name: string; 
  baseClassName: string;
  hoverClassName: string;
  description?: string;
}) => (
  <div className="space-y-3">
    <div className="flex items-center justify-center h-24 bg-white rounded-lg border">
      <div className={`w-20 h-16 bg-white rounded-lg ${baseClassName} ${hoverClassName} flex items-center justify-center cursor-pointer transition-shadow duration-200`}>
        <span className="text-label-xs text-gray-600">Hover me</span>
      </div>
    </div>
    <div className="text-center space-y-1">
      <p className="text-label-sm font-medium">{name}</p>
      {description && <p className="text-body-xs text-muted-foreground">{description}</p>}
    </div>
  </div>
);

export const ElevationLevels: Story = {
  name: "Elevation Levels",
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-title-lg mb-4">Shadow Elevation System</h2>
        <p className="text-body-md text-muted-foreground mb-6">
          Different shadow levels to create depth and hierarchy in the interface.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <ShadowExample 
            name="None"
            className="shadow-none"
            cssValue="none"
            description="No shadow for flat elements"
          />
          
          <ShadowExample 
            name="Small"
            className="shadow-sm"
            cssValue="0 1px 2px 0 rgb(0 0 0 / 0.05)"
            description="Subtle shadow for cards"
          />
          
          <ShadowExample 
            name="Medium"
            className="shadow-md"
            cssValue="0 4px 6px -1px rgb(0 0 0 / 0.1)"
            description="Standard shadow for components"
          />
          
          <ShadowExample 
            name="Large"
            className="shadow-lg"
            cssValue="0 10px 15px -3px rgb(0 0 0 / 0.1)"
            description="Prominent shadow for modals"
          />
          
          <ShadowExample 
            name="Extra Large"
            className="shadow-xl"
            cssValue="0 20px 25px -5px rgb(0 0 0 / 0.1)"
            description="Strong shadow for overlays"
          />
          
          <ShadowExample 
            name="2XL"
            className="shadow-2xl"
            cssValue="0 25px 50px -12px rgb(0 0 0 / 0.25)"
            description="Maximum shadow for floating elements"
          />
          
          <ShadowExample 
            name="Inner"
            className="shadow-inner"
            cssValue="inset 0 2px 4px 0 rgb(0 0 0 / 0.05)"
            description="Inset shadow for pressed states"
          />
          
          <ShadowExample 
            name="Outline"
            className="shadow-none ring-2 ring-blue-500 ring-opacity-50"
            cssValue="0 0 0 2px rgb(59 130 246 / 0.5)"
            description="Focus outline for accessibility"
          />
        </div>
      </div>
    </div>
  ),
};

export const InteractiveShadows: Story = {
  name: "Interactive Shadows",
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-title-lg mb-4">Interactive Shadow States</h2>
        <p className="text-body-md text-muted-foreground mb-6">
          Shadow transitions for hover, focus, and active states.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <InteractiveShadowExample 
            name="Button Hover"
            baseClassName="shadow-sm"
            hoverClassName="hover:shadow-md"
            description="Subtle elevation on hover"
          />
          
          <InteractiveShadowExample 
            name="Card Hover"
            baseClassName="shadow-md"
            hoverClassName="hover:shadow-lg"
            description="Card lift effect"
          />
          
          <InteractiveShadowExample 
            name="Modal Hover"
            baseClassName="shadow-lg"
            hoverClassName="hover:shadow-xl"
            description="Strong elevation change"
          />
          
          <div className="space-y-3">
            <div className="flex items-center justify-center h-24 bg-white rounded-lg border">
              <button className="w-20 h-16 bg-blue-500 text-white rounded-lg shadow-sm hover:shadow-md focus:shadow-lg focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 text-label-xs">
                Focus me
              </button>
            </div>
            <div className="text-center space-y-1">
              <p className="text-label-sm font-medium">Focus State</p>
              <p className="text-body-xs text-muted-foreground">Shadow + ring for accessibility</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-center h-24 bg-white rounded-lg border">
              <button className="w-20 h-16 bg-red-500 text-white rounded-lg shadow-md active:shadow-inner transition-shadow duration-150 text-label-xs">
                Press me
              </button>
            </div>
            <div className="text-center space-y-1">
              <p className="text-label-sm font-medium">Active State</p>
              <p className="text-body-xs text-muted-foreground">Inset shadow when pressed</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-center h-24 bg-white rounded-lg border">
              <div className="w-20 h-16 bg-gray-200 rounded-lg shadow-none text-label-xs flex items-center justify-center text-gray-500">
                Disabled
              </div>
            </div>
            <div className="text-center space-y-1">
              <p className="text-label-sm font-medium">Disabled State</p>
              <p className="text-body-xs text-muted-foreground">No shadow for inactive elements</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const ColoredShadows: Story = {
  name: "Colored Shadows",
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-title-lg mb-4">Colored Shadow Effects</h2>
        <p className="text-body-md text-muted-foreground mb-6">
          Colored shadows for brand elements and special effects.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-center h-24 bg-white rounded-lg border">
              <div className="w-16 h-16 bg-blue-500 rounded-lg shadow-lg shadow-blue-500/25 flex items-center justify-center">
                <span className="text-label-xs text-white">Blue</span>
              </div>
            </div>
            <div className="text-center space-y-1">
              <p className="text-label-sm font-medium">Blue Shadow</p>
              <p className="text-body-xs text-muted-foreground">shadow-blue-500/25</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-center h-24 bg-white rounded-lg border">
              <div className="w-16 h-16 bg-green-500 rounded-lg shadow-lg shadow-green-500/25 flex items-center justify-center">
                <span className="text-label-xs text-white">Green</span>
              </div>
            </div>
            <div className="text-center space-y-1">
              <p className="text-label-sm font-medium">Green Shadow</p>
              <p className="text-body-xs text-muted-foreground">shadow-green-500/25</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-center h-24 bg-white rounded-lg border">
              <div className="w-16 h-16 bg-red-500 rounded-lg shadow-lg shadow-red-500/25 flex items-center justify-center">
                <span className="text-label-xs text-white">Red</span>
              </div>
            </div>
            <div className="text-center space-y-1">
              <p className="text-label-sm font-medium">Red Shadow</p>
              <p className="text-body-xs text-muted-foreground">shadow-red-500/25</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-center h-24 bg-white rounded-lg border">
              <div className="w-16 h-16 bg-purple-500 rounded-lg shadow-lg shadow-purple-500/25 flex items-center justify-center">
                <span className="text-label-xs text-white">Purple</span>
              </div>
            </div>
            <div className="text-center space-y-1">
              <p className="text-label-sm font-medium">Purple Shadow</p>
              <p className="text-body-xs text-muted-foreground">shadow-purple-500/25</p>
            </div>
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
        <h2 className="text-title-lg mb-4">Real-world Shadow Usage</h2>
        
        <div className="space-y-8">
          {/* Card Examples */}
          <div className="space-y-4">
            <h3 className="text-title-md">Card Variations</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <h4 className="text-title-sm mb-2">Basic Card</h4>
                <p className="text-body-sm text-muted-foreground">Uses shadow-sm for subtle elevation</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h4 className="text-title-sm mb-2">Elevated Card</h4>
                <p className="text-body-sm text-muted-foreground">Uses shadow-md for standard elevation</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-lg">
                <h4 className="text-title-sm mb-2">Prominent Card</h4>
                <p className="text-body-sm text-muted-foreground">Uses shadow-lg for strong elevation</p>
              </div>
            </div>
          </div>

          {/* Button Examples */}
          <div className="space-y-4">
            <h3 className="text-title-md">Button States</h3>
            <div className="flex flex-wrap gap-4">
              <button className="px-4 py-2 bg-blue-500 text-white rounded shadow-sm hover:shadow-md transition-shadow">
                Default Button
              </button>
              <button className="px-4 py-2 bg-green-500 text-white rounded shadow-md hover:shadow-lg transition-shadow">
                Primary Button
              </button>
              <button className="px-4 py-2 bg-purple-500 text-white rounded shadow-lg hover:shadow-xl transition-shadow">
                Hero Button
              </button>
              <button className="px-4 py-2 bg-gray-300 text-gray-500 rounded shadow-none cursor-not-allowed">
                Disabled Button
              </button>
            </div>
          </div>

          {/* Modal Example */}
          <div className="space-y-4">
            <h3 className="text-title-md">Modal &amp; Overlay</h3>
            <div className="relative bg-gray-100 p-8 rounded-lg">
              <div className="absolute inset-0 bg-black bg-opacity-25 rounded-lg"></div>
              <div className="relative bg-white p-6 rounded-lg shadow-2xl max-w-md mx-auto">
                <h4 className="text-title-sm mb-2">Modal Dialog</h4>
                <p className="text-body-sm text-muted-foreground mb-4">
                  Uses shadow-2xl for maximum elevation above overlay
                </p>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-blue-500 text-white rounded text-label-sm">Confirm</button>
                  <button className="px-3 py-1 border rounded text-label-sm">Cancel</button>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Example */}
          <div className="space-y-4">
            <h3 className="text-title-md">Navigation</h3>
            <div className="bg-white shadow-sm border-b">
              <div className="px-6 py-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-title-sm">Navigation Bar</h4>
                  <div className="flex gap-4">
                    <a href="#" className="text-label-md hover:text-blue-600">Home</a>
                    <a href="#" className="text-label-md hover:text-blue-600">About</a>
                    <a href="#" className="text-label-md hover:text-blue-600">Contact</a>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-body-xs text-muted-foreground">
              Uses shadow-sm for subtle separation from content
            </p>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const ShadowSystem: Story = {
  name: "Complete Shadow System",
  render: () => (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-display-xl mb-2">Shadow System</h1>
        <p className="text-body-lg text-muted-foreground">
          Complete overview of all shadow effects used throughout the application
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-title-md">Shadow Scale</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded shadow-sm">
              <span className="text-label-sm font-mono">shadow-sm</span>
              <span className="text-body-xs text-muted-foreground">Subtle cards</span>
            </div>
            <div className="flex items-center justify-between p-3 border rounded shadow-md">
              <span className="text-label-sm font-mono">shadow-md</span>
              <span className="text-body-xs text-muted-foreground">Standard components</span>
            </div>
            <div className="flex items-center justify-between p-3 border rounded shadow-lg">
              <span className="text-label-sm font-mono">shadow-lg</span>
              <span className="text-body-xs text-muted-foreground">Prominent elements</span>
            </div>
            <div className="flex items-center justify-between p-3 border rounded shadow-xl">
              <span className="text-label-sm font-mono">shadow-xl</span>
              <span className="text-body-xs text-muted-foreground">Overlays</span>
            </div>
            <div className="flex items-center justify-between p-3 border rounded shadow-2xl">
              <span className="text-label-sm font-mono">shadow-2xl</span>
              <span className="text-body-xs text-muted-foreground">Modals</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-title-md">Usage Guidelines</h2>
          <div className="space-y-3 text-body-sm">
            <div className="p-3 bg-blue-50 rounded">
              <strong>shadow-sm:</strong> Cards, form fields, subtle elevation
            </div>
            <div className="p-3 bg-green-50 rounded">
              <strong>shadow-md:</strong> Buttons, dropdowns, standard components
            </div>
            <div className="p-3 bg-yellow-50 rounded">
              <strong>shadow-lg:</strong> Navigation, prominent cards, tooltips
            </div>
            <div className="p-3 bg-purple-50 rounded">
              <strong>shadow-xl:</strong> Popovers, floating panels, overlays
            </div>
            <div className="p-3 bg-pink-50 rounded">
              <strong>shadow-2xl:</strong> Modals, dialogs, maximum elevation
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <strong>shadow-inner:</strong> Pressed states, inset effects
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};
