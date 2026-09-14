import { processEnquiry } from "@/lib/enquiry-mail";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const formData = await request.formData();
  const result = await processEnquiry(formData);
  return Response.json(result);
}
