import React, { useState } from "react";
import Button from "@/src/components/ui/Button";
import Form from "@/src/components/ui/Form";
import Input from "@/src/components/ui/Form/Input";
import Layout from "@/src/components/ui/Layout";
import Typography from "@/src/components/ui/Typography";
import useFetch from "@/src/hooks/general/useFetch";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { CustomError } from "@/src/utils/errors";
import { StatusCodes } from "http-status-codes";

const ResetPasswordForm = (props) => {
  const router = useRouter();
  const resetPassword = useFetch({
    method: "POST",
    url: "/api/auth/reset-password",
  });
  const handleSubmit = async (body) => {
    try {
      if (body.newPassword !== body.confirmPassword) {
        toast.error("Passwords do not match");
        throw new CustomError(
          "password does not match",
          StatusCodes.BAD_REQUEST
        );
      }
      if (body.newPassword === body.oldPassword) {
        toast.error("new Password cannot be same as the old password");
        throw new Error("new Password cannot be same as the old password");
      }
      const response = await resetPassword.dispatch(body);
      if (response) {
        toast.success("password updated successfully");
        router.push("/dashboard");
      }
      //
    } catch (error) {
      console.log(error);
      toast.error();
    }
  };
  return (
    <Form onSubmit={handleSubmit}>
      <Layout.Col className="gap-2">
        <Input
          type="password"
          name="oldPassword"
          placeholder="Enter old password"
          required
        />
        <Input
          type="password"
          name="newPassword"
          placeholder="Enter new password"
          required
        />
        <Input
          type="password"
          name="confirmPassword"
          placeholder="Confirm new password password"
          required
        />
        <Button className="btn-primary" loading={resetPassword.loading}>
          Submit
        </Button>
      </Layout.Col>
    </Form>
  );
};

const ResetPasswordPage = (props) => {
  const [status, setStatus] = useState(false);
  const onConfirm = (status) => {
    setStatus(status);
  };
  return (
    <Layout.Container className="max-w-sm h-full fixed inset-0">
      <Layout.Col className="justify-center h-full">
        <Layout.Card className="flex flex-col gap-4">
          <Layout.Col>
            <Typography.Heading className="font-semibold">
              Reset Password
            </Typography.Heading>

            {props.auth && (
              <Typography.Caption className="font-normal">
                Enter your new password.
              </Typography.Caption>
            )}
          </Layout.Col>
          {!props.auth && (
            <ResetPasswordForm  />
          )}
        </Layout.Card>
      </Layout.Col>
    </Layout.Container>
  );
};

export default ResetPasswordPage;
