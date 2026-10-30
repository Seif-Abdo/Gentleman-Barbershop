import { redirect } from "next/navigation";

export default function AdminLoginRedirectPage() {
  redirect("/portal/login");
}
