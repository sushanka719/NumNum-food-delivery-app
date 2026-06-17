import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { CONTACT_MODULE } from "../../modules/contact";
import ContactModuleService from "../../modules/contact/service";

export type CreateContactSubmissionInput = {
  first_name: string;
  last_name: string;
  email: string;
  subject: string;
  message: string;
};

export const createContactSubmissionStep = createStep(
  "create-contact-submission-step",
  async (input: CreateContactSubmissionInput, { container }) => {
    const contactService = container.resolve<ContactModuleService>(CONTACT_MODULE);
    const submission = await contactService.createContactSubmissions(input);
    return new StepResponse(submission, submission.id);
  },
  async (id: string, { container }) => {
    const contactService = container.resolve<ContactModuleService>(CONTACT_MODULE);
    await contactService.deleteContactSubmissions(id);
  }
);
