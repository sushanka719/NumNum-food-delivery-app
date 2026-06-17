import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk";
import { createContactSubmissionStep, CreateContactSubmissionInput } from "./steps/create-contact-submission";

export const createContactSubmissionWorkflow = createWorkflow(
  "create-contact-submission",
  function (input: CreateContactSubmissionInput) {
    const submission = createContactSubmissionStep(input);
    return new WorkflowResponse(submission);
  }
);
