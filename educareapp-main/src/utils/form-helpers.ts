
import { SelectItem } from "@/components/ui/select";
import React from "react";

/**
 * Ensures that select items never have empty string values
 * by providing safe defaults
 */
export const ensureSelectValue = <T extends string>(
  value: T | undefined | null | "", 
  defaultValue: T
): T => {
  if (value === undefined || value === null || value === "") {
    return defaultValue;
  }
  return value;
};

/**
 * Safe select option types with descriptive names
 */
export type AssignedToRole = 'teacher' | 'coordinator' | 'specialist' | 'parent' | 'team';
export type StatusType = 'pending' | 'in_progress' | 'completed' | 'archived';
export type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent';
export type DetailLevel = 'concise' | 'detailed' | 'comprehensive';
export type ToneStyle = 'supportive' | 'formal' | 'technical';

/**
 * Default values for form selects
 */
export const DEFAULT_VALUES = {
  assignedToRole: 'teacher' as AssignedToRole,
  status: 'pending' as StatusType,
  priority: 'medium' as PriorityLevel,
  detailLevel: 'detailed' as DetailLevel,
  tone: 'formal' as ToneStyle
};

/**
 * Helper function to create option elements with safe defaults
 */
export const createSelectOptions = <T extends string>(
  options: {value: T, label: string}[],
  currentValue: T | string | undefined | null,
  defaultValue: T
): React.ReactNode[] => {
  const safeValue = ensureSelectValue(currentValue as T, defaultValue);
  
  return options.map(option => 
    React.createElement(SelectItem, {
      key: option.value,
      value: option.value
    }, option.label)
  );
};
