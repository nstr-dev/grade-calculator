import { SignInPageComponent } from "@/components/pages/signin";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <>
      <meta name="robots" content="noindex,nofollow" />
      <Suspense>
        <SignInPageComponent />
      </Suspense>
    </>
  );
}
