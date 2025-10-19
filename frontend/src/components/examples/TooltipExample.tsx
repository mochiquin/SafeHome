"use client"

import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle, Info } from "lucide-react";

export function TooltipExample() {
  return (
    <div className="space-y-4 p-6">
      <h2 className="text-2xl font-bold mb-4">Tooltip Examples</h2>

        {/* Basic Tooltip */}
        <div className="flex items-center space-x-2">
          <span>Hover over the icon for more information:</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm">
                <Info className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>This is a basic tooltip with information</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Tooltip with Rich Content */}
        <div className="flex items-center space-x-2">
          <span>Help tooltip:</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm">
                <HelpCircle className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <div className="space-y-2">
                <p className="font-semibold">Help & Support</p>
                <p className="text-sm">
                  For assistance with your account or services, please contact our support team.
                </p>
                <p className="text-xs text-muted-foreground">
                  Available 24/7 via chat or phone
                </p>
              </div>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Tooltip with Different Sides */}
        <div className="flex justify-center space-x-8">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">Top Tooltip</Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Tooltip on top</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">Right Tooltip</Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Tooltip on right</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">Bottom Tooltip</Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Tooltip on bottom</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">Left Tooltip</Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Tooltip on left</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
  );
}
