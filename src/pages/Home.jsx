import { useState } from "react";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import Input from "../components/common/Input";

export default function Home() {
  const [count, setCount] = useState(0);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Welcome to Your App
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          This is a universal React + Tailwind boilerplate. Customize it for
          your project needs!
        </p>
      </div>

      {/* Example Components */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-2xl font-semibold mb-4">Button Examples</h2>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="success">Success</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="outline">Outline</Button>
          </div>
        </Card>

        <Card>
          <h2 className="text-2xl font-semibold mb-4">Counter Example</h2>
          <div className="text-center space-y-4">
            <p className="text-4xl font-bold text-blue-600">{count}</p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => setCount(count - 1)}>Decrease</Button>
              <Button onClick={() => setCount(0)} variant="secondary">
                Reset
              </Button>
              <Button onClick={() => setCount(count + 1)}>Increase</Button>
            </div>
          </div>
        </Card>

        <Card className="md:col-span-2">
          <h2 className="text-2xl font-semibold mb-4">Form Example</h2>
          <div className="space-y-4 max-w-md">
            <Input label="Name" placeholder="Enter your name" />
            <Input label="Email" type="email" placeholder="Enter your email" />
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
            />
            <Button className="w-full">Submit</Button>
          </div>
        </Card>
      </div>

      {/* Instructions */}
      <Card>
        <h2 className="text-2xl font-semibold mb-4">🚀 Getting Started</h2>
        <div className="prose max-w-none">
          <ol className="space-y-2 text-gray-700">
            <li>Understand your backend APIs</li>
            <li>
              Create service files in{" "}
              <code className="bg-gray-100 px-2 py-1 rounded">
                src/services/
              </code>
            </li>
            <li>
              Build feature components in{" "}
              <code className="bg-gray-100 px-2 py-1 rounded">
                src/components/features/
              </code>
            </li>
            <li>
              Create pages in{" "}
              <code className="bg-gray-100 px-2 py-1 rounded">src/pages/</code>
            </li>
            <li>
              Update routes in{" "}
              <code className="bg-gray-100 px-2 py-1 rounded">App.jsx</code>
            </li>
          </ol>
        </div>
      </Card>
    </div>
  );
}
