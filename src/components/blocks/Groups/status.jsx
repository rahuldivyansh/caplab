import React, { useEffect, useMemo, useRef, useState } from "react";
import Layout from "../../ui/Layout";
import Typography from "../../ui/Typography";
import Button from "../../ui/Button";
import useFetch from "@/src/hooks/general/useFetch";
import Modal from "../../ui/Modal";
import { PlusCircleIcon } from "@heroicons/react/20/solid";
import Form from "../../ui/Form";
import Input from "../../ui/Form/Input";
import { useGroup } from "@/src/providers/Group";
import { toast } from "react-toastify";
import Grid from "../../ui/Layout/Grid";
import CustomEditor from "../../ui/Editor";
import GroupStatusListBoxElement from "../../elements/GroupStatus/list-box";
import { ChevronsUpDown, MoreHorizontal, PlusIcon, Trash, X } from "lucide-react";
import ComboBox from "../../ui/ComboBox";
import Avatar from "../../elements/Avatar";

const COLUMN_TYPES_MAP = {
  "-1": "Backlog",
  "0": "todo",
  "1": "In progress",
  "2": "In Review",
  "3": "Completed",
}

const COLUMN_TYPES = [{ title: "Backlog", type: -1, color: "#ff5555" }, { title: "Todo", type: 0, color: "gray" }, { title: "In progress", type: 1, color: "#009d00" }, { title: "In Review", type: 2, color: "#4343ff" }, { title: "Completed", type: 3, color: "#9e9e00" }];

const AssignMembersBlock = ({ status_id }) => {
  const [addMemberComboBoxOpen, setAddMemberComboBoxOpen] = useState(false)
  const assigneesToAdd = useRef([]);
  const group = useGroup();
  const members = useFetch({ method: "GET", url: `/api/members/${group.id}`, get_autoFetch: true })
  const removeAssignees = useFetch({ method: "DELETE", url: `/api/status/${group.id}/${status_id}/assignees` })
  const addAssignees = useFetch({ method: "POST", url: `/api/status/${group.id}/${status_id}/assignees` })
  const assignees = useFetch({ method: "GET", url: `/api/status/${group.id}/${status_id}/assignees`, get_autoFetch: true })
  const membersEmailToUidMapper = useMemo(() => (members.data?.reduce((acc, curr) => {
    acc[curr.email] = curr.uid;
    return acc;
  }, {})), [members.data])
  const onOptionChange = async (values) => {
    const updatedMembers = values.map((item) => (membersEmailToUidMapper[item.value]))
    if (assignees) {
      assigneesToAdd.current = updatedMembers.filter((member) => !assignees.data.find((assignee) => assignee.uid === member))
    } else {
      assigneesToAdd.current = updatedMembers;
    }
    console.log("assignees to add ", assigneesToAdd.current)
  }
  const onAddAssignees = async () => {
    if (assigneesToAdd.current.length === 0) return;
    const { data, error } = await addAssignees.dispatch({ members: assigneesToAdd.current })
    if (error) {
      toast.error("unable to add assignee(s), please try again later.");
    }
    if (data) console.log(data)
    if (data) {
      assigneesToAdd.current = [];
      await assignees.dispatch();
      setAddMemberComboBoxOpen(false);
    }
  }
  const onDeleteAssignees = async (member) => {
    const { data, error } = await removeAssignees.dispatch({ member })
    if (error) {
      toast.error("unable to remove assignee(s), please try again later.");
    }
    if (data) {
      await assignees.dispatch();
    }
  }
  return <Layout.Col className="dark:text-white gap-2">
    <Layout.Row className="justify-between items-center">
      <Typography.Caption className="uppercase font-bold">assignees</Typography.Caption>
      <Button onClick={() => setAddMemberComboBoxOpen(prev => !prev)} className="btn-icon"><PlusIcon size={20} /></Button>
    </Layout.Row>
    <Layout.Row className="gap-2 flex-wrap">
      {assignees.data && assignees.data.map((assignee) => (
        <Layout.Row key={assignee.uid} className="flex-wrap justify-center items-center gap-1 bg-gray-100 dark:bg-white/5 p-1 rounded-full">
          <Avatar seed={assignee.name} dimensions={[24, 24]} />
          <Typography className="uppercase caption text-[0.3rem] font-bold">{assignee.name}</Typography>
          <Button className="rounded-full p-0 z-0" onClick={() => onDeleteAssignees(assignee.uid)}><X size={16}/></Button>
        </Layout.Row>
      ))}
    </Layout.Row>
    {addMemberComboBoxOpen && members.data && <><ComboBox placeholder="Select Members" list={members.data.map(member => ({ value: member.email, displayValue: member.name }))} onChange={onOptionChange} multiple={true} showValue />
      <Button className="btn-primary" onClick={onAddAssignees} loading={addAssignees.loading}>add</Button>
    </>}

  </Layout.Col>

}

const CurrentTaskActions = ({ currentTask, onStatusChange }) => {
  return <><GroupStatusListBoxElement
    onItemSelect={onStatusChange}
    currentItem={{ title: currentTask.title, id: currentTask.type }}
    ListBoxButton={<Button className="w-full capitalize border dark:hover:bg-white/5 hover:bg-gray-50 text-black dark:text-white dark:border-white/10 justify-between active:scale-100 mb-2">{COLUMN_TYPES_MAP[currentTask.type]}<ChevronsUpDown size={16} /> </Button>}
    list={COLUMN_TYPES.map((COLUMN_TYPE) => ({ title: COLUMN_TYPE.title, id: COLUMN_TYPE.type }))} /></>
};

const CurrentTaskModal = ({ task, setTask, getTasks, setTasks }) => {
  const [currentTask, setCurrentTask] = useState(task);
  const [actionsModalOpen, setActionsModalOpen] = useState(false);
  const group = useGroup();
  const members = useFetch({ method: "GET", url: `/api/members/${group.id}`, get_autoFetch: true })
  const updateTask = useFetch({ method: "PUT", url: `/api/status/${task.group_id}/${task.id}` });
  const [initialState, setInitialState] = useState({ title: task.title, desc: task.desc });
  const onTitleChange = (e) => {
    setInitialState((prev) => ({ ...prev, title: e.target.value }));
  }
  const onDescriptionChange = (value) => {
    setInitialState((prev) => ({ ...prev, desc: value }));
  }
  const onFormSubmit = async (_payload) => {
    const { data, error } = await updateTask.dispatch({ ...initialState });
    if (error) {
      toast.error("unable to update task, please try again later.");
    }
    if (data) {
      setTask(null);
      setTasks((prev) => prev.map((task) => task.id === data.id ? data : task));
    }
  }
  const onStatusChange = async (statusUpdate) => {
    const { data, error } = await updateTask.dispatch({ type: statusUpdate.id });
    if (error) {
      toast.error("unable to update task, please try again later.");
    }
    if (data) {
      setCurrentTask((prev) => ({ ...prev, type: statusUpdate.id }));
      setTasks((prev) => prev.map((task) => task.id === data.id ? data : task));
    }
  }

  const toggleActionsModal = () => setActionsModalOpen(prev => !prev);
  return <Modal open={task !== null} onClose={() => setTask(null)} title="">
    {task && (
      <Grid className="grid-cols-1 md:grid-cols-3 divide-x dark:divide-white/10 h-[80vh] lg:max-w-[1000px]">
        <Layout.Col className="flex-wrap overflow-x-hidden overflow-y-auto md:col-span-2 h-full">
          <Form onSubmit={onFormSubmit}>
            <Layout.Row className="gap-2 items-center px-2">
              <Input className="border-none text-xl sm:text-2xl md:text-3xl font-black w-full dark:text-white" value={initialState.title} name="title" onChange={onTitleChange} />
              <RemoveTaskButton getTasks={getTasks} setTasks={setTasks} taskId={task.id} onModalClose={() => setTask(null)} />
              <Button className="btn-icon flex md:hidden" type="button" onClick={toggleActionsModal}><MoreHorizontal /></Button>
            </Layout.Row>
            <CustomEditor content={initialState.desc} onChange={onDescriptionChange} menuProps={{
              style: {
                position: "sticky",
                top: 0
              }
            }} />
            <Layout.Row className="sticky bottom-0 bg-background-light dark:bg-background-dark  p-2 border-t border-r dark:border-white/10"><Button className="btn-primary" loading={updateTask.loading}>submit</Button></Layout.Row>
          </Form>
        </Layout.Col>
        <Layout.Col className="p-4 gap-2 h-full hidden md:flex">
          <CurrentTaskActions currentTask={currentTask} onStatusChange={onStatusChange} />
          <AssignMembersBlock status_id={task.id} />
        </Layout.Col>
      </Grid>
    )}
    <Modal open={actionsModalOpen} onClose={toggleActionsModal} title="Actions" style={{ zIndex: 3000 }}>
      <Layout.Col className="p-4 gap-2 h-[84vh] w-screen">
        <CurrentTaskActions currentTask={currentTask} onStatusChange={onStatusChange} />
        <AssignMembersBlock status_id={task.id} />
      </Layout.Col>
    </Modal>
  </Modal>
};


const AddTaskModal = ({ taskType, getTasks, setTasks }) => {
  const group = useGroup();
  const [modalOpen, setModalOpen] = useState(false);
  const [desc, setDesc] = useState("");
  const toggleModal = () => setModalOpen(prev => !prev);
  const addTask = useFetch({ method: "POST", url: `/api/status/${group.id}` });
  const onFormSubmit = async (payload) => {
    if (desc.trim() === "") {
      toast.error("task description is required");
      return;
    }
    const { data, error } = await addTask.dispatch({ ...payload, desc: desc, type: taskType, group_id: group.id });
    if (error) {
      toast.error("unable to add task, please try again.");
    }
    if (data) {
      toggleModal();
      setTasks((prev) => [...prev, data]);
    }
  }
  const onChange = (value) => {
    setDesc(value);
  }

  return (
    <>
      <Modal open={modalOpen} onClose={toggleModal} title="Add task">
        <Form onSubmit={onFormSubmit}>
          <Layout.Col className="h-[90vh] overflow-y-auto bg-background-light dark:bg-background-dark min-w-[100vw] sm:min-w-[480px] md:min-w-[640px] lg:min-w-[768px] gap-2">
            <Input name="title" placeholder="Enter title" required className="border-none text-xl sm:text-2xl md:text-3xl font-black dark:text-white" />
            <Layout.Col className="h-[90%]">
              <CustomEditor content="<h1>title</h1><p>some description....</p>" onChange={onChange} menuProps={{
                style: {
                  position: "sticky",
                  top: 0
                }
              }} />
            </Layout.Col>
            <Layout.Row className="sticky bottom-0 bg-background-light dark:bg-background-dark p-2">
              <Button className="btn-primary" loading={addTask.loading}>submit</Button>
            </Layout.Row>
          </Layout.Col>
        </Form>
      </Modal>
      <Button onClick={toggleModal} className="p-0 uppercase font-semibold">Add<PlusCircleIcon width={24} height={24} className="text-primary ml-1" /></Button>
    </>
  );
}

const RemoveTaskButton = ({ getTasks, taskId, onModalClose, setTasks }) => {
  const group = useGroup();
  const removeTask = useFetch({ method: "DELETE", url: `/api/status/${group.id}/${taskId}` });
  const handleRemoveTask = async () => {
    const { data, error } = await removeTask.dispatch();
    if (error) {
      toast.error("unable to remove task, please try again later.");
    }
    if (data) {
      onModalClose()
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    }
  }
  return (
    <Button type="button" onClick={handleRemoveTask} loading={removeTask.loading} className="btn-danger btn-icon dark:text-red-500"><Trash size={16} /></Button>
  );
}

const StatusTypeColumn = ({ title, tasks, type, color, getTasks, setCurrentTask, setTasks, currentDraggedTask, setCurrentDraggedTask }) => {
  const updateTask = useFetch({ method: "PUT", url: `/api/status/${currentDraggedTask?.group_id}/${currentDraggedTask?.id}` });
  const onDragStart = (e, task) => {
    e.dataTransfer.setData("task", JSON.stringify(task));
    setCurrentDraggedTask(task);
  }
  const isTrustedTarget = (e) => {
    const dragTargetIndex = e.target.getAttribute("data-dragTargetIndex");
    return dragTargetIndex && dragTargetIndex !== type;

  }
  const onDrop = async (e) => {
    e.preventDefault();
    if (!currentDraggedTask) return;
    if (currentDraggedTask.type === type) return;
    const { data, error } = await updateTask.dispatch({ type });
    if (error) {
      toast.error("unable to update task, please try again later.");
    }
    if (data) {
      setTasks((prev) => prev.map((task) => {
        if (task.id === currentDraggedTask.id) {
          return { ...task, type };
        }
        return task;
      }));
      setCurrentDraggedTask(null);
      e.target.style.border = "none";
    }
  }
  const onDragOver = (e) => {
    e.preventDefault();
    if (isTrustedTarget(e)) {
      e.target.style.border = "1px solid #1170f8";
    }
  }
  const onDragLeave = (e) => {
    if (isTrustedTarget(e)) {
      e.target.style.border = "none";
    }
  }
  return (
    <Layout.Card className="flex-1 flex flex-col gap-2 rounded w-[76vw] sm:w-[320px]" onDrop={onDrop} onDragLeave={onDragLeave} onDragOver={onDragOver} data-dragTargetIndex={type}>
      <Layout.Row className="justify-between items-center">
        <Typography.Caption className="uppercase font-semibold" style={{ color }}>{title}</Typography.Caption>
        <AddTaskModal taskType={type} getTasks={getTasks} setTasks={setTasks} />
      </Layout.Row>
      {tasks && tasks.map((task) => (
        <Layout.Card
          className="cursor-pointer overflow-hidden"
          draggable
          key={task.id}
          onDragStart={(e) => onDragStart(e, task)}
          onClick={() => setCurrentTask(task)}
        >
          <Typography className="font-semibold capitalize text-sm line-clamp-1">{task.title}</Typography>
        </Layout.Card>
      ))}
    </Layout.Card>

  );
};

const DashboardGroupsStatusBlock = () => {
  const group = useGroup();
  const tasks = useFetch({
    url: `/api/status/${group.id}`,
    method: "GET",
    get_autoFetch: true,
  });
  const [currentDraggedTask, setCurrentDraggedTask] = useState(null);
  const [currentTask, setCurrentTask] = useState(null);
  return (
    <Layout.Row className="p-2 items-start gap-2 grid-cols-1 sm:grid-cols-3 md:grid-cols-4 h-screen outline-none">
      {currentTask && <CurrentTaskModal task={currentTask} setTask={setCurrentTask} getTasks={tasks.dispatch} setTasks={tasks.setData} />}
      <Layout.Row className="flex-nowrap gap-2 items-start">
        {!tasks.loading && COLUMN_TYPES.map((column) => (
          <StatusTypeColumn
            key={column.type}
            title={column.title}
            tasks={tasks.data !== null && tasks.data.filter((task) => task.type == column.type)}
            type={column.type}
            color={column.color}
            setTasks={tasks.setData}
            getTasks={tasks.dispatch}
            setCurrentTask={setCurrentTask}
            currentDraggedTask={currentDraggedTask}
            setCurrentDraggedTask={setCurrentDraggedTask}
          />
        ))}
      </Layout.Row>
    </Layout.Row>
  );
};

export default DashboardGroupsStatusBlock;
