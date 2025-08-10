import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/common/Spinner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerUser } from "../api/authApi";
import {
  registerSchema,
  type RegisterFormFields,
} from "../schemas/registerSchema";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    setFocus,
    formState: { errors },
  } = useForm<RegisterFormFields>({
    resolver: zodResolver(registerSchema),
    defaultValues: { username: "", email: "", password: "" },
  });

  // Focus username on mount
  useEffect(() => {
    setFocus("username");
  }, [setFocus]);

  const onSubmit = async (data: RegisterFormFields) => {
    setLoading(true);
    try {
      await registerUser({
        username: data.username,
        email: data.email,
        password: data.password,
      });
      navigate("/");
    } catch (error: any) {
      console.error(error);
      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message;

      // Show backend/general error at the top
      setError("root.serverError", {
        type: "manual",
        message:
          backendMessage ||
          "Could not connect to the server. Please try again later.",
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
        <h2 className="text-xl font-bold mb-6 text-center">Register</h2>

        {errors.root?.serverError?.message && (
          <p className="text-sm text-red-600 mt-0 mb-4 text-center">
            {errors.root.serverError.message}
          </p>
        )}

        <input
          type="text"
          placeholder="Username"
          className="w-full p-2 border border-gray-300 rounded"
          {...register("username")}
        />
        {errors.username && (
          <p className="text-sm text-red-600 mt-1">{errors.username.message}</p>
        )}

        <input
          type="email"
          placeholder="E-mail address"
          className="w-full p-2 mt-4 border border-gray-300 rounded"
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
          Create an account
        </button>

        <div className="mt-4 text-center">
          <span className="text-sm text-gray-700">
            Already have an account?
          </span>{" "}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-blue-700 hover:underline font-medium text-sm"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
}
