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
import { toast } from "react-toastify";

const SettingsChangeOwner = ({ groupId }) => {
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
      router.push("/dashboard/groups");
    }
  };

  return (
    <>
      <Modal open={modalOpen} onClose={onModalClose} title="Change Owner" >
        <Layout.Col className="gap-4 p-4 h-screen lg:min-w-[500px]">
          <CustomComboBox
            showValue
            placeholder="Select Teacher"
            list={availableTeachers().map((member) => ({
              value: member.email,
              displayValue: member.name,
            }))}
            onChange={onOptionChange}
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
      <Layout.Col className="gap-2">
        <Layout.Row className="justify-between flex-wrap items-center">
          <Typography className="font-semibold">Change Ownership</Typography>
          <Button
            className="btn-danger"
            loading={changeOwner.loading}
            onClick={onModalClose}
          >
            Change Ownership
          </Button>
        </Layout.Row>
        <Typography.Caption className="text-red-500">
          Change the ownership of the group to another teacher.This will remove you from the project.
        </Typography.Caption>
      </Layout.Col>
    </>
  );
};

const Wrapper = ({ children }) => {
  ;
  return (
    <Layout.Col className="p-4 gap-2 ">
      {children}
    </Layout.Col>
  );
};
const SettingsTabListBLock = (props) => {
  const tabItems = [
    {
      tab: "general",
    }
  ];
  return (
    <Layout.Card className="flex flex-col gap-2 w-full md:w-1/4">
      <Typography.Heading className="font-semibold">Options</Typography.Heading>
      <Tab.List className="flex flex-col divide-dark_secondary gap-2">
        {tabItems.map((item) => (
          <Tab
            key={item.tab}
            className="rounded-md cursor-pointer hover:bg-dark_decondary  transition capitalize"
            as={Layout.Col}
          >
            {({ selected }) => (
              <Typography.Caption
                className={
                  selected
                    ? "bg-primary/10 text-primary p-2 rounded-md"
                    : "p-2 rounded-md"
                }
              >
                {item.tab}
              </Typography.Caption>
            )}
          </Tab>
        ))}
      </Tab.List>
    </Layout.Card>
  );
};

const SettingsRemoveGroup = ({ groupId }) => {
  const router = useRouter();
  const deleteGroup = useFetch({
    method: "DELETE",
    url: `/api/settings/${groupId}/delete`,
  });
  const [modalOpen, setModalOpen] = useState(false);
  const handleOnClick = () => {
    setModalOpen((prev) => !prev);
  };
  const handleDeleteGroup = async () => {
    const { data, error } = await deleteGroup.dispatch();
    if (error) {
      toast.error("Error deleting group");
    }
    if (data) {
      handleOnClick();
      router.push("/dashboard/groups");
      toast.success("Group deleted");
    }
  };

  return (
    <Layout.Col className="gap-2">
      <Layout.Row className="justify-between items-center flex-wrap">
        <Typography className="font-semibold">Delete Group</Typography>
        <Button
          className="btn-danger"
          loading={deleteGroup.loading}
          onClick={handleOnClick}
        >
          Delete group
        </Button>
        <Modal open={modalOpen} onClose={handleOnClick} title="Delete group">
          <Layout.Col>
            <Layout.Col className="p-4">
              <p>Are you sure you want to delete this group?</p>
            </Layout.Col>
            <Layout.Row className=" p-4 gap-2">
              <Button
                className="btn-danger flex-1"
                onClick={handleDeleteGroup}
              >
                Delete Group
              </Button>
              <Button className="btn-primary flex-1" onClick={handleOnClick}>
                Cancel
              </Button>
            </Layout.Row>
          </Layout.Col>
        </Modal>
      </Layout.Row>
      <Typography.Caption className="text-red-500">
        This action is irreversible.
      </Typography.Caption>
    </Layout.Col>
  );
};

const GroupGeneralSettings = ({ groupId }) => {
  return (
    <Layout.Col className="gap-4">
      <Typography.Heading className="font-semibold">General Settings</Typography.Heading>
      <Layout.Col className="gap-2">
        <Typography.Heading className="text-red-500 ">Danger zone</Typography.Heading>
        <Layout.Col className="bg-red-50 dark:bg-transparent p-2 rounded gap-4">
          <SettingsChangeOwner groupId={groupId} />
          <SettingsRemoveGroup groupId={groupId} />
        </Layout.Col>
      </Layout.Col>
    </Layout.Col>
  );
}

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
        <Layout.Container className="mt-2 flex flex-col gap-4 h-screen">
          <Tab.Group defaultIndex={defaultValue}>
            <Layout.Row className="gap-2 items-start flex-wrap">
              <SettingsTabListBLock />
              <Layout.Card className="flex-1">
                <Tab.Panels>
                  <Tab.Panel className="outline-none">
                    <GroupGeneralSettings groupId={groupId} />
                  </Tab.Panel>
                </Tab.Panels>
              </Layout.Card>
            </Layout.Row>
          </Tab.Group>
        </Layout.Container>
      </>
    );
  }
};

export default GroupSettingsBlock;
