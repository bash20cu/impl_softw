import { useState } from "react";
import { loginAction } from "@/lib/login/auth";

export function useLogin() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      setError("Both fields are required.");
      setIsLoading(false);
      return;
    }

    const response = await loginAction(null, formData);

    if (response?.error) {
      setError(response.error);
      setIsLoading(false);
    }
  }

  return { error, isLoading, handleSubmit };
}