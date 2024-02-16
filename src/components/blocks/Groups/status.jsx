import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Layout from "../../ui/Layout";
import Typography from "../../ui/Typography";
import Button from "../../ui/Button";
import useFetch from "@/src/hooks/general/useFetch";
import Modal from "../../ui/Modal";

const DashboardGroupsStatusBlock = () => {
  const router = useRouter();
  const { id: group_id } = router.query;
  const [tasks, setTasks] = useState([]);
  const task = useFetch({
    url: `/api/status/${group_id}`,
    method: "GET",
    get_autoFetch: true,
  });
  const [currentTodo, setCurrentTodo] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get(`/api/status/${group_id}`);
      const data = await response.data;
      setTasks(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCardClick = (group_id, task) => {
    setCurrentTodo(task);
  };

  return (
    <Layout.Row className="p-3 justify-between space-x-2 bg-gray-50">
      <Modal open={currentTodo !== null} onClose={() => setCurrentTodo(null)}>
        {currentTodo && <>{currentTodo.title}</>}
      </Modal>
      <Layout.Card className="flex-grow ">
        <Layout.Col>
          <Typography.Heading className="text-red-800">
            Backlog
          </Typography.Heading>
          {tasks
            .filter((task) => task.type == -1)
            .map((task) => (
              <Layout.Card
                className="m-1 cursor-pointer"
                key={task.id}
                onClick={() => handleCardClick(task.group_id, task)}
              >
                <h4>{task.title}</h4>
                <h5>{task.desc}</h5>
              </Layout.Card>
            ))}
        </Layout.Col>
      </Layout.Card>
      <Layout.Card className="flex-grow bg-yellow-200">
        <Layout.Col>
          <Typography.Heading className="text-green-800">
            In Progress
          </Typography.Heading>
          {tasks
            .filter((task) => task.type == 0)
            .map((task) => (
              <Layout.Card
                className="m-1 cursor-pointer"
                key={task.id}
                onClick={() => handleCardClick(task.group_id, task)}
              >
                <h4>{task.title}</h4>
                <h5>{task.desc}</h5>
              </Layout.Card>
            ))}
        </Layout.Col>
      </Layout.Card>
      <Layout.Card className="flex-grow bg-purple-200">
        <Layout.Col>
          <Typography.Heading className="text-orange-800">
            In Review
          </Typography.Heading>
          {tasks
            .filter((task) => task.type == 1)
            .map((task) => (
              <Layout.Card
                className="m-1 cursor-pointer"
                key={task.id}
                onClick={() => handleCardClick(task.group_id, task)}
              >
                <h4>{task.title}</h4>
                <h5>{task.desc}</h5>
              </Layout.Card>
            ))}
        </Layout.Col>
      </Layout.Card>
      <Layout.Card className="flex-grow bg-green-200">
        <Layout.Col>
          <Typography.Heading className="text-blue-800">
            Completed
          </Typography.Heading>
          {tasks
            .filter((task) => task.type == 2)
            .map((task) => (
              <Layout.Card
                className="m-1 cursor-pointer"
                key={task.id}
                onClick={() => handleCardClick(task.group_id, task)}
              >
                <h4>{task.title}</h4>
                <h5>{task.desc}</h5>
              </Layout.Card>
            ))}
        </Layout.Col>
      </Layout.Card>
    </Layout.Row>
  );
};

export default DashboardGroupsStatusBlock;
