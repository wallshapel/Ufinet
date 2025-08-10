// src/pages/Login.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../api/loginApi";
import Spinner from "../components/common/Spinner";
import { loginSchema, type LoginFormFields } from "../schemas/loginSchema";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    setFocus,
    formState: { errors },
  } = useForm<LoginFormFields>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  // Focus email on mount
  useEffect(() => {
    setFocus("email");
  }, [setFocus]);

  const onSubmit = async (data: LoginFormFields) => {
    setLoading(true);
    try {
      const token = await loginUser({ email: data.email, password: data.password });
      login(token);
      navigate("/books");
    } catch (error: any) {
      const backendMessage = error?.response?.data?.message || error?.response?.data?.error;
      // Map backend error to a form-level error (top of the form)
      setError("root.serverError", {
        type: "manual",
        message: backendMessage || "An unexpected error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 text-blue-900">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-xl font-bold mb-6 text-center">Login</h2>

        {errors.root?.serverError?.message && (
          <p className="text-center text-red-600 text-sm mb-4">
            {errors.root.serverError.message}
          </p>
        )}

        <input
          type="email"
          placeholder="E-mail address"
          className="w-full p-2 border border-gray-300 rounded"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
        )}

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mt-4 border border-gray-300 rounded"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full mt-6 font-semibold py-2 rounded ${
            loading
              ? "bg-blue-300 cursor-not-allowed text-white"
              : "bg-blue-700 hover:bg-blue-800 text-white"
          }`}
        >
          Sign in
        </button>

        <div className="mt-4 text-center">
          <span className="text-sm text-gray-700">Don't have an account?</span>{" "}
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="text-blue-700 hover:underline font-medium text-sm"
          >
            Sign up
          </button>
        </div>
      </form>
    </div>
  );
}
