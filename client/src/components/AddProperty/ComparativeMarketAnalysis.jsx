"use client";

import React, { useState, useCallback } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import RichTextEditor from "@/components/RichTextEditor/RichTextEditor";
import { File, FilePlus, Trash2, FileText } from "lucide-react";

export default function ComparativeMarketAnalysis({ 
  formData, 
  handleChange, 
  handleCmaFileUpload,
  handleRemoveCmaFile,
  existingCmaFile
}) {
  const [pdfFile, setPdfFile] = useState(null);
  
  // Handle CMA toggle
  const handleCmaToggle = (checked) => {
    handleChange({ 
      target: { 
        name: "hasCma", 
        value: checked 
      } 
    });
  };

  // Handle CMA data (rich text)
  const handleCmaDataChange = (value) => {
    // Directly update the formData state instead of using handleChange
    setFormData(prev => ({
      ...prev,
      cmaData: value
    }));
  };

  // Handle PDF file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if file is a PDF
      if (file.type !== 'application/pdf') {
        alert('Please upload a PDF file');
        return;
      }
      
      // Check file size (limit to 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size should not exceed 10MB');
        return;
      }
      
      setPdfFile(file);
      handleCmaFileUpload(file);
    }
  };

  // Remove selected file
  const handleRemoveFile = () => {
    setPdfFile(null);
    handleCmaFileUpload(null);
    
    // Reset the file input
    const fileInput = document.getElementById('cma-file-input');
    if (fileInput) fileInput.value = '';
  };

  return (
    <Card className="border border-gray-200 shadow-sm rounded-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-800 flex items-center">
          <FileText className="w-6 h-6 mr-2 text-[#324c48]" />
          Comparative Market Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* CMA Toggle */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div className="space-y-0.5">
            <Label className="text-base font-semibold text-gray-700">Include CMA</Label>
            <p className="text-sm text-gray-500">
              Add comparative market analysis data and document
            </p>
          </div>
          <Switch
            checked={formData.hasCma}
            onCheckedChange={handleCmaToggle}
            aria-label="Toggle CMA"
          />
        </div>

        {/* CMA Content (shown only when hasCma is true) */}
        {formData.hasCma && (
          <>
            {/* Rich Text Editor for CMA Data */}
            <div className="space-y-2">
              <Label className="text-base font-semibold text-gray-700">
                Market Analysis Details
              </Label>
              <RichTextEditor
                value={formData.cmaData || ""}
                onChange={handleCmaDataChange}
                placeholder="Enter comparative market analysis details here..."
                className="border border-gray-300 w-full min-h-[200px]"
              />
              <p className="text-xs text-gray-500">
                Provide detailed information about comparable properties, market trends, and value justification.
              </p>
            </div>

            {/* PDF Upload */}
            <div className="space-y-2">
              <Label className="text-base font-semibold text-gray-700">
                Upload CMA Document (PDF)
              </Label>
              
              {/* File input and selected file display */}
              <div className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 transition-all hover:bg-gray-100">
                {pdfFile ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <File className="h-8 w-8 text-[#324c48]" />
                      <div>
                        <p className="text-sm font-medium truncate max-w-xs">
                          {pdfFile.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <Badge variant="outline" className="bg-[#324c48]/10 text-[#324c48] border-[#324c48]/20">
                        PDF
                      </Badge>
                    </div>
                    <Button 
                      type="button"
                      variant="ghost" 
                      size="sm"
                      onClick={handleRemoveFile}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-4">
                    <FilePlus className="h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 mb-3">
                      PDF up to 10MB
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('cma-file-input').click()}
                      className="text-[#324c48] border-[#324c48]"
                    >
                      Select File
                    </Button>
                    <input 
                      id="cma-file-input"
                      type="file" 
                      accept=".pdf" 
                      onChange={handleFileChange}
                      className="hidden" 
                    />
                  </div>
                )}
              </div>
              
              {formData.cmaFilePath && !pdfFile && (
                <div className="mt-2 flex items-center justify-between py-2 px-3 bg-blue-50 border border-blue-100 rounded-md">
                  <p className="text-xs text-blue-600 flex items-center">
                    <File className="h-3 w-3 mr-1" />
                    Existing CMA document is attached
                  </p>
                  {handleRemoveCmaFile && (
                    <Button 
                      type="button"
                      variant="ghost" 
                      size="sm"
                      onClick={handleRemoveCmaFile}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )}
              
              <p className="text-xs text-gray-500">
                Upload a PDF document containing the full comparative market analysis report.
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}