import Avatar from "@/src/components/elements/Avatar";
import EmptyElement from "@/src/components/elements/Empty";
import { LoaderElement } from "@/src/components/elements/Loaders";
import Button from "@/src/components/ui/Button";
import CustomComboBox from "@/src/components/ui/ComboBox";
import Layout from "@/src/components/ui/Layout";
import Modal from "@/src/components/ui/Modal";
import Typography from "@/src/components/ui/Typography";
import { ROLES } from "@/src/constants/roles";
import useFetch from "@/src/hooks/general/useFetch";
import { useAuth } from "@/src/providers/Auth";
import { useGroup } from "@/src/providers/Group";
import { TrashIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/router";
import { set } from "nprogress";
import React, { useEffect, useMemo, useRef, useState } from "react";

const AddMemberBlock = ({ groupId, getMembers }) => {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [currentValue, setCurrentValue] = useState({});
  const ownerToChange = useRef([]);
  const teachers = useFetch({
    method: "GET",
    url: `/api/settings/${groupId}`,
    get_autoFetch: true,
  });
  const changeOwner = useFetch({
    method: "PUT",
    url: `/api/settings/${groupId}`,
  });
  const availableTeachers = () => {
    if (!teachers.data) return [];
    if (Array.isArray(teachers.data) && teachers.data.length == 0) return [];
    return teachers.data;
  };

  const onModalClose = () => {
    setModalOpen((prev) => !prev);
  };
  const onOptionChange = (values) => {
    // console.log(values);
    ownerToChange.current = values;
  };
  const handleChangeOwner = async () => {
    if (ownerToChange.current == {}) return;
    const emailToUidMapper = teachers.data.reduce((acc, curr) => {
      acc[curr.email] = curr.uid;
      return acc;
    }, {});
    const updatedTeacher = emailToUidMapper[ownerToChange.current.value];
    console.log(updatedTeacher);
    const { data, error } = await changeOwner.dispatch({
      teacher: updatedTeacher,
    });
    if (error) {
      console.log(error);
      return;
    }
    if (data) {
      onModalClose();
      router.reload();
    }
  };

  return (
    <>
      <Modal open={modalOpen} onClose={onModalClose}>
        <Layout.Col className="gap-4 p-4 h-screen lg:min-w-[500px]">
          <CustomComboBox
            placeholder="Select Teacher"
            list={availableTeachers().map((member) => ({
              value: member.email,
              displayValue: member.name,
            }))}
            onChange={onOptionChange}
            value={currentValue}
          />
          <Button
            className="btn-primary"
            loading={changeOwner.loading}
            onClick={handleChangeOwner}
          >
            Change
          </Button>
        </Layout.Col>
      </Modal>
      <Button
        className="btn-primary"
        loading={changeOwner.loading}
        onClick={onModalClose}
      >
        Change Ownership
      </Button>
    </>
  );
};

const Wrapper = ({ children, groupId, getMembers, members }) => {
  const auth = useAuth();
  const ALLOWED_ROLES = [ROLES.TEACHER];
  const role = auth.data?.app_meta?.role;
  return (
    <Layout.Col className="p-4 gap-2 min-h-screen">
      {ALLOWED_ROLES.includes(role) && (
        <Layout.Col className="sm:items-end">
          <AddMemberBlock
            groupId={groupId}
            getMembers={getMembers}
            members={members}
          />
        </Layout.Col>
      )}
      {children}
    </Layout.Col>
  );
};

const GroupSettingsBlock = ({ groupId }) => {
  const group = useGroup();
  const auth = useAuth();
  const { id: currentUserId } = auth.data;
  console.log("grp owner: " + group.owner);
  console.log("current user: " + currentUserId);
  if (currentUserId !== group.owner) {
    console.log("this is working1")
    return (
      <Wrapper groupId={groupId}>
        Members are not authorized to change anything
      </Wrapper>
    );
  } else {
    console.log("this is working2")
    return <Wrapper groupId={groupId}></Wrapper>;
  }
};

export default GroupSettingsBlock;
