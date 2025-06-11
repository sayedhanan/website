// src/components/TestCodeTabs.tsx
'use client';

export default function TestCodeTabs() {
  const testData = [
    {
      label: 'Python',
      language: 'python',
      code: `def hello():
    print("Hello World")
    return "test"`
    },
    {
      label: 'JavaScript',
      language: 'javascript',
      code: `function hello() {
    console.log("Hello World");
    return "test";
}`
    }
  ];

  return (
    <div className="p-4 border border-blue-500">
      <h3>Test Component</h3>
      <div className="bg-gray-900 text-white p-4 mt-2">
        <pre>
          <code>{testData[0].code}</code>
        </pre>
      </div>
    </div>
  );
}