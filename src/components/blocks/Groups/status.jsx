import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../ui/Layout";
import Typography from "../../ui/Typography";
import Button from "../../ui/Button";
import useFetch from "@/src/hooks/general/useFetch";
import Modal from "../../ui/Modal";
import ListBox from "../../ui/ListBox";
import { PlusCircleIcon } from "@heroicons/react/20/solid";
import Form from "../../ui/Form";
import Input from "../../ui/Form/Input";
import { useGroup } from "@/src/providers/Group";
import { toast } from "react-toastify";
import Grid from "../../ui/Layout/Grid";
import CustomEditor from "../../ui/Editor";

const COLUMN_TYPES = [{ title: "Backlog", type: -1, color: "#ff5555" }, { title: "In progress", type: 0, color: "#009d00" }, { title: "In Review", type: 1, color: "#4343ff" }, { title: "Completed", type: 2, color: "#9e9e00" }];

const CurrentTaskModal = ({ task, setTask, getTasks }) => {
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
      await getTasks();
    }
  }
  return <Modal open={task !== null} onClose={() => setTask(null)} title="">
    {task && (
      <Grid className="grid-cols-1 md:grid-cols-3 divide-x dark:divide-white/10 h-[90vh] lg:max-w-[1000px]">
        <Layout.Col className="flex-wrap overflow-x-hidden overflow-y-auto md:col-span-2 h-full">
          <Form onSubmit={onFormSubmit}>
            <Input className="border-none text-xl sm:text-2xl md:text-3xl font-black w-full dark:text-white" value={initialState.title} name="title" onChange={onTitleChange} />
            <CustomEditor content={initialState.desc} onChange={onDescriptionChange} />
            <Layout.Row className="sticky bottom-0 bg-background-light dark:bg-background-dark  p-2 border-t border-r dark:border-white/10"><Button className="btn-primary" loading={updateTask.loading}>submit</Button></Layout.Row>
          </Form>
        </Layout.Col>
        <Layout.Col className="p-4 gap-2 h-full">
          <Typography.Caption className="uppercase text-gray-700 font-semibold">actions</Typography.Caption>
          <RemoveTaskButton getTasks={getTasks} taskId={task.id} onModalClose={() => setTask(null)} />
          <ListBox
            status_id={task.id}
            group_id={task.group_id}
            currentTodo={task}
            getTask={getTasks}
            onModalClose={() => setTask(null)}
          />
        </Layout.Col>
      </Grid>
    )}
  </Modal>
};


const AddTaskModal = ({ taskType, getTasks }) => {
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
      toast.error("unable to add task, please try again later.");
    }
    if (data) {
      toggleModal();
      await getTasks()

    }
  }
  const onChange = (value) => {
    setDesc(value);
  }
  return (
    <>
      <Modal open={modalOpen} onClose={toggleModal} title="Add task">
        <Form onSubmit={onFormSubmit}>
          <Layout.Col className=" h-[90vh] overflow-y-auto bg-background-light dark:bg-background-dark min-w-[100vw] sm:min-w-[480px] md:min-w-[640px] lg:min-w-[768px] gap-2">
            <Input name="title" placeholder="Enter title" required className="border-none text-xl sm:text-2xl md:text-3xl font-black dark:text-white" />
            <Layout.Col className="h-[90%]">
              <CustomEditor content="<h1>title</h1><p>some description....</p>" onChange={onChange} />
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

const RemoveTaskButton = ({ getTasks, taskId, onModalClose }) => {
  const group = useGroup();
  const removeTask = useFetch({ method: "DELETE", url: `/api/status/${group.id}/${taskId}` });
  const handleRemoveTask = async () => {
    const { data, error } = await removeTask.dispatch();
    if (error) {
      toast.error("unable to remove task, please try again later.");
    }
    if (data) {
      onModalClose()
      await getTasks()
    }
  }
  return (
    <Button onClick={handleRemoveTask} loading={removeTask.loading} className="uppercase font-semibold bg-red-500 text-white">Remove</Button>
  );
}

const StatusTypeColumn = ({ title, tasks, type, color, getTasks, setCurrentTask }) => {

  return (
    <Layout.Card className="flex-1 rounded w-[76vw] sm:w-[320px]">
      <Layout.Col className="gap-2">
        <Layout.Row className="justify-between items-center">
          <Typography.Caption className="uppercase font-semibold" style={{ color }}>{title}</Typography.Caption>
          <AddTaskModal taskType={type} getTasks={getTasks} />
        </Layout.Row>
        {tasks && tasks.map((task) => (
          <Layout.Card
            className="cursor-pointer overflow-hidden"
            key={task.id}
            onClick={() => setCurrentTask(task)}
          >
            <Typography className="font-semibold capitalize text-sm line-clamp-1">{task.title}</Typography>
          </Layout.Card>
        ))}
      </Layout.Col>
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
  const removeTask = useFetch({ method: "DELETE", url: `/api/status/${group.id}` });
  const [currentTask, setCurrentTask] = useState(null);
  return (
    <Layout.Row className="p-2 items-start gap-2 grid-cols-1 sm:grid-cols-3 md:grid-cols-4 h-screen outline-none">
      {currentTask && <CurrentTaskModal task={currentTask} setTask={setCurrentTask} getTasks={tasks.dispatch} />}
      <Layout.Row className="flex-nowrap gap-2 items-start">
        {!tasks.loading && COLUMN_TYPES.map((column) => (
          <StatusTypeColumn
            key={column.type}
            title={column.title}
            tasks={tasks.data !== null && tasks.data.filter((task) => task.type == column.type)}
            type={column.type}
            color={column.color}
            getTasks={tasks.dispatch}
            setCurrentTask={setCurrentTask}
          />
        ))}
      </Layout.Row>
    </Layout.Row>
  );
};

export default DashboardGroupsStatusBlock;
