import { getProvidersByEnvironment } from "@/lib/loginProviderRoute";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getProvidersByEnvironment());
}
