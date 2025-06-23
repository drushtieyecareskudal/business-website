"use client";

import { useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function UploadTestPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    status?: number;
    statusText?: string;
    data?: unknown;
    success?: boolean;
    error?: string;
  } | null>(null);

  // Auth credentials for API calls
  const getAuthHeader = () => {
    const credentials = "admin:admin123";
    const base64Credentials = btoa(credentials);
    return {
      Authorization: `Basic ${base64Credentials}`,
    };
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const testUpload = async () => {
    if (!file) {
      setResult({ error: "No file selected" });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      console.log("Testing upload:", file.name, file.size, file.type);

      const response = await fetch("/admin/api/upload", {
        method: "POST",
        headers: getAuthHeader(),
        body: formData,
      });

      const data = await response.json();
      console.log("Response:", response.status, data);

      setResult({
        status: response.status,
        statusText: response.statusText,
        data: data,
        success: response.ok,
      });
    } catch (error) {
      console.error("Upload error:", error);
      setResult({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setLoading(false);
    }
  };

  const testAPI = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/admin/api/test-upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify({ test: true }),
      });

      const data = await response.json();
      console.log("API Test Response:", response.status, data);

      setResult({
        status: response.status,
        statusText: response.statusText,
        data: data,
        success: response.ok,
      });
    } catch (error) {
      console.error("API test error:", error);
      setResult({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Upload API Test</h1>

      <Card className="p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">File Upload Test</h2>

        <div className="space-y-4">
          <Input type="file" accept="image/*" onChange={handleFileChange} />

          {file && (
            <p className="text-sm text-gray-600">
              Selected: {file.name} ({file.size} bytes, {file.type})
            </p>
          )}

          <div className="flex space-x-2">
            <Button onClick={testUpload} disabled={!file || loading}>
              {loading ? "Testing..." : "Test Upload"}
            </Button>

            <Button onClick={testAPI} disabled={loading} variant="outline">
              {loading ? "Testing..." : "Test API"}
            </Button>
          </div>
        </div>
      </Card>

      {result && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Result</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </Card>
      )}
    </div>
  );
}
