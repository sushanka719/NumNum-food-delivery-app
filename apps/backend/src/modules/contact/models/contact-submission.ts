import { model } from "@medusajs/framework/utils";

export const ContactSubmission = model.define("contact_submission", {
  id: model.id().primaryKey(),
  first_name: model.text(),
  last_name: model.text(),
  email: model.text(),
  subject: model.text(),
  message: model.text(),
  status: model.text().default("new"), // new | read | replied | archived
});
