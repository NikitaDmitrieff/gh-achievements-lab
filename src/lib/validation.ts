import type { CreateTaskInput, UpdateTaskInput, TaskStatus, TaskPriority } from "@/types";

const VALID_STATUSES: TaskStatus[] = ["todo", "in_progress", "done", "archived"];
const VALID_PRIORITIES: TaskPriority[] = ["low", "medium", "high", "urgent"];
const MAX_TITLE_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 2000;
const MAX_TAG_LENGTH = 50;
const MAX_TAGS = 10;

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

export function validateCreateTask(input: unknown): ValidationResult {
  const errors: ValidationError[] = [];

  if (!input || typeof input !== "object") {
    return { valid: false, errors: [{ field: "body", message: "Request body must be a JSON object" }] };
  }

  const data = input as Record<string, unknown>;

  if (!data.title || typeof data.title !== "string") {
    errors.push({ field: "title", message: "Title is required and must be a string" });
  } else if (data.title.trim().length === 0) {
    errors.push({ field: "title", message: "Title cannot be empty" });
  } else if (data.title.length > MAX_TITLE_LENGTH) {
    errors.push({ field: "title", message: `Title must be ${MAX_TITLE_LENGTH} characters or less` });
  }

  if (data.description !== undefined && data.description !== null) {
    if (typeof data.description !== "string") {
      errors.push({ field: "description", message: "Description must be a string" });
    } else if (data.description.length > MAX_DESCRIPTION_LENGTH) {
      errors.push({ field: "description", message: `Description must be ${MAX_DESCRIPTION_LENGTH} characters or less` });
    }
  }

  if (data.status !== undefined) {
    if (!VALID_STATUSES.includes(data.status as TaskStatus)) {
      errors.push({ field: "status", message: `Status must be one of: ${VALID_STATUSES.join(", ")}` });
    }
  }

  if (data.priority !== undefined) {
    if (!VALID_PRIORITIES.includes(data.priority as TaskPriority)) {
      errors.push({ field: "priority", message: `Priority must be one of: ${VALID_PRIORITIES.join(", ")}` });
    }
  }

  if (data.tags !== undefined) {
    if (!Array.isArray(data.tags)) {
      errors.push({ field: "tags", message: "Tags must be an array" });
    } else {
      if (data.tags.length > MAX_TAGS) {
        errors.push({ field: "tags", message: `Maximum ${MAX_TAGS} tags allowed` });
      }
      for (const tag of data.tags) {
        if (typeof tag !== "string") {
          errors.push({ field: "tags", message: "Each tag must be a string" });
          break;
        }
        if (tag.length > MAX_TAG_LENGTH) {
          errors.push({ field: "tags", message: `Each tag must be ${MAX_TAG_LENGTH} characters or less` });
          break;
        }
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

export function validateUpdateTask(input: unknown): ValidationResult {
  const errors: ValidationError[] = [];

  if (!input || typeof input !== "object") {
    return { valid: false, errors: [{ field: "body", message: "Request body must be a JSON object" }] };
  }

  const data = input as Record<string, unknown>;

  const hasFields = ["title", "description", "status", "priority", "tags"].some(
    (field) => data[field] !== undefined,
  );

  if (!hasFields) {
    errors.push({ field: "body", message: "At least one field must be provided for update" });
  }

  if (data.title !== undefined) {
    if (typeof data.title !== "string") {
      errors.push({ field: "title", message: "Title must be a string" });
    } else if (data.title.trim().length === 0) {
      errors.push({ field: "title", message: "Title cannot be empty" });
    } else if (data.title.length > MAX_TITLE_LENGTH) {
      errors.push({ field: "title", message: `Title must be ${MAX_TITLE_LENGTH} characters or less` });
    }
  }

  if (data.description !== undefined && data.description !== null) {
    if (typeof data.description !== "string") {
      errors.push({ field: "description", message: "Description must be a string" });
    } else if (data.description.length > MAX_DESCRIPTION_LENGTH) {
      errors.push({ field: "description", message: `Description must be ${MAX_DESCRIPTION_LENGTH} characters or less` });
    }
  }

  if (data.status !== undefined) {
    if (!VALID_STATUSES.includes(data.status as TaskStatus)) {
      errors.push({ field: "status", message: `Status must be one of: ${VALID_STATUSES.join(", ")}` });
    }
  }

  if (data.priority !== undefined) {
    if (!VALID_PRIORITIES.includes(data.priority as TaskPriority)) {
      errors.push({ field: "priority", message: `Priority must be one of: ${VALID_PRIORITIES.join(", ")}` });
    }
  }

  if (data.tags !== undefined) {
    if (!Array.isArray(data.tags)) {
      errors.push({ field: "tags", message: "Tags must be an array" });
    } else {
      if (data.tags.length > MAX_TAGS) {
        errors.push({ field: "tags", message: `Maximum ${MAX_TAGS} tags allowed` });
      }
      for (const tag of data.tags) {
        if (typeof tag !== "string") {
          errors.push({ field: "tags", message: "Each tag must be a string" });
          break;
        }
        if (tag.length > MAX_TAG_LENGTH) {
          errors.push({ field: "tags", message: `Each tag must be ${MAX_TAG_LENGTH} characters or less` });
          break;
        }
      }
    }
  }

  return { valid: errors.length === 0, errors };
}
