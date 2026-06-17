import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { createContactSubmissionWorkflow } from "../../../workflows/create-contact-submission";
import { ContactSubmissionSchemaType } from "./middlewares";

export const POST = async (
  req: MedusaRequest<ContactSubmissionSchemaType>,
  res: MedusaResponse
) => {
  const { result } = await createContactSubmissionWorkflow(req.scope).run({
    input: req.validatedBody,
  });

  res.status(201).json({ submission: result });
};
