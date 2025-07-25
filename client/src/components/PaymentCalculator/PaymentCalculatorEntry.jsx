"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function PaymentCalculatorEntry({ formData, handleChange, numberOfPlans = 3 }) {
  // Determine which plans are available
  const isPlan1Available = formData.financing === "Available";
  const isPlan2Available = formData.financingTwo === "Available";
  const isPlan3Available = formData.financingThree === "Available";

  return (
    <Card className="border border-gray-200 shadow-sm rounded-lg">
      <CardContent className="space-y-6">
        {/* Top Section: General Financing Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Purchase Price */}
          <div>
            <Label className="text-sm font-semibold text-gray-700">
              Purchase Price
            </Label>
            <Input
              type="text"
              placeholder="Enter purchase price"
              name="purchasePrice"
              value={formData.purchasePrice}
              onChange={handleChange}
              className="w-full border-gray-300 focus:border-[#D4A017] focus:ring-1 focus:ring-[#D4A017] rounded-md"
            />
          </div>
          {/* Financed Price */}
          <div>
            <Label className="text-sm font-semibold text-gray-700">
              Financed Price
            </Label>
            <Input
              type="text"
              placeholder="Enter financed price"
              name="financedPrice"
              value={formData.financedPrice}
              onChange={handleChange}
              className="w-full border-gray-300 focus:border-[#D4A017] focus:ring-1 focus:ring-[#D4A017] rounded-md"
            />
          </div>
          {/* Tax */}
          <div>
            <Label className="text-sm font-semibold text-gray-700">
              Tax
            </Label>
            <Input
              type="text"
              placeholder="Enter tax amount"
              name="tax"
              value={formData.tax}
              onChange={handleChange}
              className="w-full border-gray-300 focus:border-[#D4A017] focus:ring-1 focus:ring-[#D4A017] rounded-md"
            />
          </div>
        </div>

        {/* Next Row: HOA Fee, Service Fee, and Term */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Label className="text-sm font-semibold text-gray-700">
              HOA Fee
            </Label>
            <Input
              type="text"
              placeholder="Enter HOA Fee"
              name="hoaMonthly"
              value={formData.hoaMonthly}
              onChange={handleChange}
              className="w-full border-gray-300 focus:border-[#D4A017] focus:ring-1 focus:ring-[#D4A017] rounded-md"
            />
          </div>
          <div>
            <Label className="text-sm font-semibold text-gray-700">
              Service Fee
            </Label>
            <Input
              type="text"
              placeholder="Enter service fee"
              name="serviceFee"
              value={formData.serviceFee}
              onChange={handleChange}
              className="w-full border-gray-300 focus:border-[#D4A017] focus:ring-1 focus:ring-[#D4A017] rounded-md"
            />
          </div>
          <div>
            <Label className="text-sm font-semibold text-gray-700">
              Term (months)
            </Label>
            <Input
              type="text"
              placeholder="Enter term in months"
              name="term"
              value={formData.term}
              onChange={handleChange}
              className="w-full border-gray-300 focus:border-[#D4A017] focus:ring-1 focus:ring-[#D4A017] rounded-md"
            />
          </div>
        </div>

        {/* Payment Plans Section */}
        <div className="space-y-6">
          {/* Plan One */}
          <div className={`border-t pt-4 ${!isPlan1Available ? 'opacity-50' : ''}`}>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Plan One {!isPlan1Available ? '(Disabled)' : ''}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-semibold text-gray-700">
                  Down Payment Option 1
                </Label>
                <Input
                  type="text"
                  placeholder="Enter down payment 1"
                  name="downPaymentOne"
                  value={formData.downPaymentOne}
                  onChange={handleChange}
                  disabled={!isPlan1Available}
                  className={`w-full focus:border-[#D4A017] focus:ring-1 focus:ring-[#D4A017] rounded-md ${
                    !isPlan1Available ? 'bg-gray-100 border-gray-200' : 'border-gray-300'
                  }`}
                />
              </div>
              <div>
                <Label className="text-sm font-semibold text-gray-700">
                  Monthly Payment Option 1
                </Label>
                <Input
                  type="text"
                  placeholder="Enter monthly payment 1"
                  name="monthlyPaymentOne"
                  value={formData.monthlyPaymentOne}
                  onChange={handleChange}
                  disabled={!isPlan1Available}
                  className={`w-full focus:border-[#D4A017] focus:ring-1 focus:ring-[#D4A017] rounded-md ${
                    !isPlan1Available ? 'bg-gray-100 border-gray-200' : 'border-gray-300'
                  }`}
                />
              </div>
              <div>
                <Label className="text-sm font-semibold text-gray-700">
                  Interest Rate Option 1 (%)
                </Label>
                <Input
                  type="text"
                  placeholder="Enter interest rate option 1"
                  name="interestOne"
                  value={formData.interestOne}
                  onChange={handleChange}
                  disabled={!isPlan1Available}
                  className={`w-full focus:border-[#D4A017] focus:ring-1 focus:ring-[#D4A017] rounded-md ${
                    !isPlan1Available ? 'bg-gray-100 border-gray-200' : 'border-gray-300'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Plan Two */}
          <div className={`border-t pt-4 ${!isPlan2Available ? 'opacity-50' : ''}`}>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Plan Two {!isPlan2Available ? '(Disabled)' : ''}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-semibold text-gray-700">
                  Down Payment Option 2
                </Label>
                <Input
                  type="text"
                  placeholder="Enter down payment 2"
                  name="downPaymentTwo"
                  value={formData.downPaymentTwo}
                  onChange={handleChange}
                  disabled={!isPlan2Available}
                  className={`w-full focus:border-[#D4A017] focus:ring-1 focus:ring-[#D4A017] rounded-md ${
                    !isPlan2Available ? 'bg-gray-100 border-gray-200' : 'border-gray-300'
                  }`}
                />
              </div>
              <div>
                <Label className="text-sm font-semibold text-gray-700">
                  Monthly Payment Option 2
                </Label>
                <Input
                  type="text"
                  placeholder="Enter monthly payment 2"
                  name="monthlyPaymentTwo"
                  value={formData.monthlyPaymentTwo}
                  onChange={handleChange}
                  disabled={!isPlan2Available}
                  className={`w-full focus:border-[#D4A017] focus:ring-1 focus:ring-[#D4A017] rounded-md ${
                    !isPlan2Available ? 'bg-gray-100 border-gray-200' : 'border-gray-300'
                  }`}
                />
              </div>
              <div>
                <Label className="text-sm font-semibold text-gray-700">
                  Interest Rate Option 2 (%)
                </Label>
                <Input
                  type="text"
                  placeholder="Enter interest rate option 2"
                  name="interestTwo"
                  value={formData.interestTwo}
                  onChange={handleChange}
                  disabled={!isPlan2Available}
                  className={`w-full focus:border-[#D4A017] focus:ring-1 focus:ring-[#D4A017] rounded-md ${
                    !isPlan2Available ? 'bg-gray-100 border-gray-200' : 'border-gray-300'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Plan Three */}
          <div className={`border-t pt-4 ${!isPlan3Available ? 'opacity-50' : ''}`}>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Plan Three {!isPlan3Available ? '(Disabled)' : ''}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-semibold text-gray-700">
                  Down Payment Option 3
                </Label>
                <Input
                  type="text"
                  placeholder="Enter down payment 3"
                  name="downPaymentThree"
                  value={formData.downPaymentThree}
                  onChange={handleChange}
                  disabled={!isPlan3Available}
                  className={`w-full focus:border-[#D4A017] focus:ring-1 focus:ring-[#D4A017] rounded-md ${
                    !isPlan3Available ? 'bg-gray-100 border-gray-200' : 'border-gray-300'
                  }`}
                />
              </div>
              <div>
                <Label className="text-sm font-semibold text-gray-700">
                  Monthly Payment Option 3
                </Label>
                <Input
                  type="text"
                  placeholder="Enter monthly payment 3"
                  name="monthlyPaymentThree"
                  value={formData.monthlyPaymentThree}
                  onChange={handleChange}
                  disabled={!isPlan3Available}
                  className={`w-full focus:border-[#D4A017] focus:ring-1 focus:ring-[#D4A017] rounded-md ${
                    !isPlan3Available ? 'bg-gray-100 border-gray-200' : 'border-gray-300'
                  }`}
                />
              </div>
              <div>
                <Label className="text-sm font-semibold text-gray-700">
                  Interest Rate Option 3 (%)
                </Label>
                <Input
                  type="text"
                  placeholder="Enter interest rate option 3"
                  name="interestThree"
                  value={formData.interestThree}
                  onChange={handleChange}
                  disabled={!isPlan3Available}
                  className={`w-full focus:border-[#D4A017] focus:ring-1 focus:ring-[#D4A017] rounded-md ${
                    !isPlan3Available ? 'bg-gray-100 border-gray-200' : 'border-gray-300'
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}