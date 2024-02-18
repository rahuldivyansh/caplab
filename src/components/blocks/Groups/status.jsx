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

const COLUMN_TYPES = [{ title: "Backlog", type: -1, color: "#ff5555" }, { title: "In progress", type: 0, color: "#009d00" }, { title: "In Review", type: 1, color: "#4343ff" }, { title: "Completed", type: 2, color: "#9e9e00" }];

const AddTaskModal = ({ taskType, getTasks }) => {
  const group = useGroup();
  const [modalOpen, setModalOpen] = useState(false);
  const toggleModal = () => setModalOpen(prev => !prev);
  const addTask = useFetch({ method: "POST", url: `/api/status/${group.id}` });
  const onFormSubmit = async (payload) => {
    const { data, error } = await addTask.dispatch({ ...payload, type: taskType, group_id: group.id });
    if (error) {
      toast.error("unable to add task, please try again later.");
    }
    if (data) {
      toggleModal();
      await getTasks()

    }
  }
  return (
    <>
      <Modal open={modalOpen} onClose={toggleModal} title="Add task">
        <Form onSubmit={onFormSubmit}>
          <Layout.Col className="items-start h-[90vh] sm:min-w-[480px] md:min-w-[640px] lg:min-w-[768px] p-4 gap-2">
            <Typography.Title className="font-semibold">Add task</Typography.Title>
            <Input name="title" placeholder="Enter title" required />
            <Input name="desc" placeholder="Enter description" required />
            <Button className="btn-primary" loading={addTask.loading}>submit</Button>
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
    <Layout.Card className="flex-1 rounded w-[360px]">
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
            <Typography className="font-semibold capitalize text-xs text-gray-600 line-clamp-1">{task.desc}</Typography>
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
      <Modal open={currentTask !== null} onClose={() => setCurrentTask(null)}>
        {currentTask && (
          <Grid className="grid-cols-1 md:grid-cols-3 divide-x h-[90vh] lg:min-w-[1000px]">
            <Layout.Col className="p-4 flex-wrap overflow-x-hidden overflow-y-auto md:col-span-2">
              <Typography.Title className="font-semibold capitalize line-clamp-1 break-all">{currentTask.title}</Typography.Title>
              <Typography.Body className="break-all">{currentTask.desc}</Typography.Body>
            </Layout.Col>
            <Layout.Col className="p-4 gap-2 h-full">
              <Typography.Caption className="uppercase text-gray-700 font-semibold">actions</Typography.Caption>
              <RemoveTaskButton getTasks={tasks.dispatch} taskId={currentTask.id} onModalClose={() => setCurrentTask(null)} />
              <ListBox
                status_id={currentTask.id}
                group_id={currentTask.group_id}
                currentTodo={currentTask}
                getTask={tasks.dispatch}
                onModalClose={() => setCurrentTask(null)}
              />
            </Layout.Col>
          </Grid>
        )}
      </Modal>
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
