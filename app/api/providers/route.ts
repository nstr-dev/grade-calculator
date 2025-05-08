import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export async function GET() {
  const oidcEnabled = Boolean(
    process.env.CUSTOM_OAUTH_CLIENT_ID &&
      process.env.CUSTOM_OAUTH_SECRET &&
      process.env.CUSTOM_OAUTH_WELLKNOWN_URL &&
      process.env.CUSTOM_OAUTH_NAME
  );
  const oidcButtonName = process.env.CUSTOM_OAUTH_NAME;
  const googleEnabled = Boolean(
    process.env.GOOGLE_ID && process.env.GOOGLE_SECRET
  );
  const githubEnabled = Boolean(
    process.env.GITHUB_ID && process.env.GITHUB_SECRET
  );
  const discordEnabled = Boolean(
    process.env.DISCORD_ID && process.env.DISCORD_SECRET
  );
  const selfhosted = Boolean(
    process.env.SELFHOSTED && process.env.SELFHOSTED === "1"
  );
  const noAuth = Boolean(
    process.env.NO_AUTH &&
      (process.env.NO_AUTH === "true" || process.env.NO_AUTH === "1")
  );
  const mockUrl = process.env.MOCK_OAUTH_WELLKNOWN_URL;

  return NextResponse.json({
    oidcEnabled,
    oidcButtonName,
    googleEnabled,
    githubEnabled,
    discordEnabled,
    selfhosted,
    noAuth,
    mockUrl,
  });
}
