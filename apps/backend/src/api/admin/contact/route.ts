import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { CONTACT_MODULE } from "../../../modules/contact";
import ContactModuleService from "../../../modules/contact/service";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const contactService = req.scope.resolve<ContactModuleService>(CONTACT_MODULE);

  const [submissions, count] = await contactService.listAndCountContactSubmissions(
    {},
    { order: { created_at: "DESC" } }
  );

  res.json({ submissions, count });
};
