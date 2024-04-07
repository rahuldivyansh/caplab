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
import DashboardLayout from "@/src/components/layouts/Dashboard";
import withAuthPage from "@/src/middlewares/withAuthPage";
import Avatar from "@/src/components/elements/Avatar";
import { useAuth } from "@/src/providers/Auth";
import { REV_ROLES } from "@/src/constants/roles";
import { Pencil, X } from "lucide-react";
import Page from "@/src/components/pages";



const ResetPasswordForm = (props) => {
  const router = useRouter();
  const resetPassword = useFetch({ method: "POST", url: "/api/auth/reset-password" });
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
        toast.error("new Passwords cannot be same as the old password");
        throw new Error("new Passwords cannot be same as the old password");
      }

      const response = await resetPassword.dispatch(body);
      if (response) {
        toast.success("password updated successfully");
        router.push("/dashboard")
      }
      //  
    } catch (error) {
      props.onConfirm(false);
      console.log(error);
      toast.error()
    }
  };
  return (

    <Form onSubmit={handleSubmit}>
      <Layout.Col className="gap-2 items-start">
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
const ResetPasswordBlock = () => {
  const [status, setStatus] = useState(false);
  const [toReset, setToReset] = useState(false);
  const onConfirm = (status) => {
    setStatus(status);
  };
  const toggleReset = () => {
    setToReset(!toReset);
  }
  return <Layout.Col className="gap-4">
    <Layout.Row className="justify-between items-center gap-2">
      <Typography.Heading className="font-semibold">
        Reset Password
      </Typography.Heading>
      <Button onClick={toggleReset} className="btn-icon">{toReset ? <X size={20} /> : <Pencil size={20} />}</Button>
    </Layout.Row>
    {toReset && !status && <ResetPasswordForm onConfirm={onConfirm} />}
  </Layout.Col>

}

const UserInfoBlock = () => {
  const auth = useAuth();
  const name = auth.data?.app_meta?.name;
  const role = auth.data?.app_meta?.role;
  console.log(auth.data)
  return <Layout.Card className="flex flex-col w-full">
    <Avatar seed={name} dimensions={[56, 56]} />
    <Typography.Heading className="font-semibold uppercase">
      {name}
    </Typography.Heading>
    <Typography.Caption className="font-normal">
      {auth?.data?.email}
    </Typography.Caption>
    <Typography.Caption className="font-bold text-primary uppercase">
      {REV_ROLES[role]}
    </Typography.Caption>
  </Layout.Card>
}

const SettingsPage = (props) => {

  return (
    <Page title="Settings">
      <DashboardLayout>
        <Layout.Col className="items-start m-4 gap-4">
          <UserInfoBlock />
          <ResetPasswordBlock />
        </Layout.Col>
      </DashboardLayout>
    </Page>
  );
};

export default SettingsPage;

export const getServerSideProps = withAuthPage(async (ctx) => {
  return {
    props: {
      info: "can be accessed by authenticated users only"
    },
  }
})


