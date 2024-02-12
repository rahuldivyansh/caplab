import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import useFetch from "../general/useFetch";
import { useQuery } from "@/src/providers/Query";
import { passwordRecoveryValidator } from "@/src/utils/url/validators/query";

const useLogin = () => {
  const query = useQuery();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const init = useFetch({
    method: "GET",
    url: "/api/auth",
    get_autoFetch: true,
  });

  const loginWithEmailAndPassword = async (payload) => {
    try {
      setLoading(true);
      const res = await axios.post("/api/auth/login", payload);
      const responseData = await res.data;
      if (res.status === 200) {
        setData(responseData);
        toast("successfully logged in", { type: "success" });
        router.push("/dashboard");
      } else {
        throw responseData;
      }
    } catch (error) {
      console.log(error);
      setError(error.response?.data);
      toast(error.response?.data.message, { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (init.data) {
      setData(init.data);
    }
  }, [init.data]);

  useEffect(() => {
    const watchAuthQueries = async () => {
      try {
        if (query?.type === "recovery" && passwordRecoveryValidator(query)) {
          router.push(`/forgot-password?access_token=${query.access_token}&refresh_token=${query.refresh_token}`);
          return;
        }
      } catch (error) {}
    };
    if (query) watchAuthQueries();
  }, [query]);

  return {
    data,
    init,
    loading,
    error,
    loginWithEmailAndPassword,
  };
};

export default useLogin;
