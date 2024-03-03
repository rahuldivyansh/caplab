import Button from "@/src/components/ui/Button";
import CustomComboBox from "@/src/components/ui/ComboBox";
import Layout from "@/src/components/ui/Layout";
import Modal from "@/src/components/ui/Modal";
import { ROLES } from "@/src/constants/roles";
import useFetch from "@/src/hooks/general/useFetch";
import { useAuth } from "@/src/providers/Auth";
import { useGroup } from "@/src/providers/Group";
import { Tab } from "@headlessui/react";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Typography from "../../ui/Typography";

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
      //   redirect("/dashboard/groups");
      router.push("/dashboard/groups");
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
        <Layout.Col className="sm:items-start">
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
const SettingsTabListBLock = (props) => {
  const tabItems = [
    {
      tab: "Owner",
    },
    { tab: "remove" },
  ];
  return (
    <Layout.Card className="md:w-1/3 flex flex-col gap-2">
      <Typography.Heading className="font-semibold">Options</Typography.Heading>
      <Tab.List className="flex flex-col divide-dark_secondary gap-2">
        {tabItems.map(item => <Tab key={item.tab} className="rounded-md cursor-pointer hover:bg-dark_decondary transition capitalize" as={Layout.Col}>
          {({selected})=>(<Typography.Caption className={selected ?"bg-dark_secondary p-2 rounded-md":"p-2 rounded-md"}>{item.tab}</Typography.Caption>)}
          </Tab>)}
      </Tab.List>
    </Layout.Card>
  );
};
const SettingsChangeOwner = ({groupId}) => {
  return <Tab.Panel as={Layout.Col} className="gap-2">
    <Typography.Heading>Change Owner</Typography.Heading>
    <p className="bg-red">*this action will remove you from the group</p>
    <Wrapper groupId={groupId}></Wrapper>
  </Tab.Panel>;
};
const SettingsRemoveGroup = (props) => {
  return <></>;
};

const GroupSettingsBlock = ({ groupId }) => {
  const group = useGroup();
  const auth = useAuth();
  const { id: currentUserId } = auth.data;
  const router = useRouter();
  const defaultValue = useMemo(() => {
    const tabs = {
      owner: 0,
      remove: 1,
    };
    if (!router.query?.tab) return 0;
    if (!Object.keys(tabs).includes(router.query.tab)) return 0;
    return tabs[router.query.tab];
  }, []);
  if (currentUserId !== group.owner) {
    return (
      <Wrapper groupId={groupId}>
        Members are not authorized to change anything
      </Wrapper>
    );
  } else {
    return (
      <>
        <Layout.Container className="max-w-4x1 py-8 mt-12 flex flex-col gap4">
          <Tab.Group defaultIndex={defaultValue}>
            <Layout.Col className="w-full md:flex-row gap-4">
              <SettingsTabListBLock />
              <Layout.Card className="md:w-2/3">
                <Tab.Panels>
                  <SettingsChangeOwner groupId={groupId}/>
                  <SettingsRemoveGroup />
                </Tab.Panels>
              </Layout.Card>
            </Layout.Col>
          </Tab.Group>
        </Layout.Container>
      </>
    );
  }
};

export default GroupSettingsBlock;
