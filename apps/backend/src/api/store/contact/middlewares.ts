import { defineMiddlewares, validateAndTransformBody } from "@medusajs/framework/http";
import { z } from "@medusajs/framework/zod";

export const ContactSubmissionSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  email: z.string().email(),
  subject: z.string().min(1),
  message: z.string().min(1),
});

export type ContactSubmissionSchemaType = z.infer<typeof ContactSubmissionSchema>;

export default defineMiddlewares({
  routes: [
    {
      matcher: "/store/contact",
      method: "POST",
      middlewares: [validateAndTransformBody(ContactSubmissionSchema)],
    },
  ],
});
