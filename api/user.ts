import { authAxios } from "./axios";

interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export const User = {
  find: async (emailAddress, userId): Promise<ApiResponse> => {
    return authAxios({
      method: "get",
      url: `${process.env.BACKEND_URL}/api/users`,
      params: {
        email: emailAddress || undefined,
        id: userId || undefined,
      },
    })
      .then(({ data }) => {
        return { success: true, data: data };
      })
      .catch((err) => {
        return { error: err.response.data.error };
      });
  },
  updateProfile: async ( user ): Promise<ApiResponse> => {
    return authAxios({
      method: "put",
      url: `${process.env.BACKEND_URL}/api/user`,
      data: {
        first_name: user?.firstname,
        last_name: user?.last_name,
        dob: user?.birthday,
        gender: user?.gender,
        country: user?.country,
        primary_phone: user?.telephone
      }
    }).then(({ data }) => {
      return { success: true, data: data };
    })
      .catch((err) => {
      return {error: err?.response?.data?.error}
    })
  }
};
