import { sendAdminRecovery } from "@/lib/admin-recover";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST() {
  try {
    const result = await sendAdminRecovery();
    return Response.json(result);
  } catch {
    return Response.json({
      ok: false,
      error: "The password could not be emailed.",
    });
  }
}

