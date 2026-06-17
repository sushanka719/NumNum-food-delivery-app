import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { CONTACT_MODULE } from "../../../../modules/contact";
import ContactModuleService from "../../../../modules/contact/service";

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params;
  const { status } = req.body as { status: string };

  const contactService = req.scope.resolve<ContactModuleService>(CONTACT_MODULE);
  const submission = await contactService.updateContactSubmissions({ id, status });

  res.json({ submission });
};
