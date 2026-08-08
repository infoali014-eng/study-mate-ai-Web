import { redirect } from "next/navigation";

export default function RootChatRedirect() {
  redirect("/dashboard/chat");
}
