import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BaseQueryApi, FetchArgs } from "@reduxjs/toolkit/query";
import { User } from "@clerk/nextjs/server";
import { Clerk } from "@clerk/clerk-js";
import { toast } from "sonner";
import { createTransaction } from "../../../server/src/controllers/transactionController";
import { get } from "http";
import { updateCourse } from "../../../server/src/controllers/courseController";
//Custom Base Query
const customBaseQuery = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: any
) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: async (headers) => {
      const token = await window.Clerk?.session?.getToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  });
  try {
    const result: any = await baseQuery(args, api, extraOptions);
    if (result.error) {
      const errorData = result.error.data;
      const errorMessage =
        errorData?.message ||
        result.error.status.toString() ||
        "An error occurred";
      toast.error(`Error ${errorMessage}`);
    }

    const isMutationRequest =
      (args as FetchArgs).method && (args as FetchArgs).method !== "GET";

    if (isMutationRequest) {
      const successMessage = result.data?.message;
      if (successMessage) {
        toast.success(successMessage);
      }
    }

    if (result.data) result.data = result.data.data;
    else if (result.error?.status === 204 || result.meta?.response?.status)
      return { data: null };
    return result;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An error occurred";
    return {
      error: { status: "FETCH_ERROR ", error: errorMessage },
    };
  }
};

export const api = createApi({
  baseQuery: customBaseQuery,
  reducerPath: "api",
  tagTypes: ["Courses", "Users"],
  endpoints: (builder) => ({
    /*
    User Clerk
    **/
    updateUser: builder.mutation<
      User,
      Partial<User> & {
        userId: string;
      }
    >({
      query: ({ userId, ...updatedUser }) => ({
        url: `/users/clerk/${userId}`,
        method: "PUT",
        body: updatedUser,
      }),
      invalidatesTags: ["Users"],
    }),

    /*
    Courses
    **/

    getCourses: builder.query<Course[], { category?: string }>({
      query: ({ category }) => ({
        url: `/courses`,
        params: { category },
      }),
      providesTags: ["Courses"],
    }),
    getCourse: builder.query<Course, string>({
      query: (id) => `/courses/${id}`,
      providesTags: (result, error, id) => [{ type: "Courses", id }],
    }),

    createCourse: builder.mutation<
      Course,
      {
        teacherId: string;
        teacherName: string;
      }
    >({
      query: (body) => ({
        url: `/courses`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Courses"],
    }),

    updateCourse: builder.mutation<
      Course,
      { courseId: string; formData: FormData }
    >({
      query: ({ courseId, formData }) => ({
        url: `/courses/${courseId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: (result, error, { courseId }) => [
        { type: "Courses", id: courseId },
      ],
    }),

    deleteCourse: builder.mutation<void, string>({
      query: (courseId) => ({
        url: `/courses/${courseId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Courses"],
    }),

    /*
    Stripe
    **/

    createStripePaymentIntent: builder.mutation<
      { clientSecret: string },
      { amount: number }
    >({
      query: ({ amount }) => ({
        url: `/transactions/stripe/payment-intent`,
        method: "POST",
        body: { amount },
      }),
    }),

    /*
    Transactions
    **/

    createTransaction: builder.mutation<Transaction, Partial<Transaction>>({
      query: (transaction) => ({
        url: `/transactions`,
        method: "POST",
        body: transaction,
      }),
    }),

    getTransactions: builder.query<Transaction[], string>({
      query: (userId: string) => ({
        url: `/transactions?userId=${userId}`,
      }),
    }),
  }),
});

// Export the auto-generated hooks
export const {
  useUpdateUserMutation,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useGetCoursesQuery,
  useGetCourseQuery,
  useGetTransactionsQuery,
  useCreateTransactionMutation,
  useCreateStripePaymentIntentMutation,
} = api;
