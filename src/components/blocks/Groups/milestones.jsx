import React, { useMemo, useState } from 'react'
import Layout from '../../ui/Layout';
import Form from '../../ui/Form';
import Modal from '../../ui/Modal';
import Button from '../../ui/Button';
import useFetch from '@/src/hooks/general/useFetch';
import { toast } from "react-toastify";
import { useGroup } from '@/src/providers/Group';
import { LoaderElement } from '../../elements/Loaders';
import EmptyElement from '../../elements/Empty';
import Typography from '../../ui/Typography';
import { TrashIcon } from "lucide-react";

const AddMilestoneBlock = (props) => {
    const group = useGroup();
    const [addMileStoneModalOpen, setAddMileStoneModalOpen] = useState(false);
    const addMilestone = useFetch({
        method: "POST",
        url: `/api/milestones/${group.id}`,
    });
    const handleModalClose = () => {
        setAddMileStoneModalOpen(prev => !prev);
    }
    const onAddMilestoneFormSubmit = async (formData) => {
        try {
            const { data, error } = await addMilestone.dispatch(formData);
            if (error) {
                throw error;
            }
            if (data) {
                props.milestones.setData(prev => [...prev, data])
                toast.success("Milestone added successfully");
                handleModalClose();
            }
        } catch (error) {
            toast.error("An error occurred while adding milestone");
            console.log(error);
        }
    }
    return (
        <Layout.Row className="items-end">
            <Button onClick={handleModalClose} className="btn-primary">add</Button>
            <Modal open={addMileStoneModalOpen} onClose={handleModalClose} title="Add milestone">
                <Layout.Col className="lg:min-w-[500px]">
                    <Form onSubmit={onAddMilestoneFormSubmit}>
                        <Layout.Col className="p-4 gap-2 items-start">
                            <Form.Input name="description" type="text" placeholder="enter milestone description..." className="w-full" />
                            <Button className="btn-primary" loading={addMilestone.loading}>submit</Button>
                        </Layout.Col>
                    </Form>
                </Layout.Col>
            </Modal>
        </Layout.Row>
    )
}

const RemoveMilestoneBlock = (props) => {
    const group = useGroup();
    const removeMilestone = useFetch({
        method: "DELETE",
        url: `/api/milestones/${group.id}/${props.id}`,
    });
    const handleRemoveMilestone = async () => {
        try {
            const { data, error } = await removeMilestone.dispatch();
            if (error) {
                throw error;
            }
            if (data) {
                props.status.dispatch();
                props.milestones.dispatch();
                toast.success("Milestone removed successfully");
            }
        } catch (error) {
            toast.error("An error occurred while removing milestone");
            console.log(error);
        }
    }
    return <Button onClick={handleRemoveMilestone} className="btn-icon absolute top-4 right-4"><TrashIcon size={20} className='text-red-500' /></Button>
}

const MilestonesBlock = (props) => {
    const progress = (milestone_id) => {
        if (props.progress[milestone_id]) {
            let { completed, total } = props.progress[milestone_id];
            if (total == 0) return `0%`;
            return `${Math.round((completed / total) * 100)}%`;
        }
    }
    if (props.milestones.loading) return <LoaderElement />
    if (!props.milestones.data) return null;
    if (Array.isArray(props.milestones.data) && props.milestones.data.length == 0) return <EmptyElement />
    return <Layout.Grid className="grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
        {props.milestones.data.map(milestone => (
            <Layout.Card key={milestone.id} className="relative p-4 sm:aspect-square border border-gray-200 rounded-md flex flex-col items-center justify-center gap-2">
                <RemoveMilestoneBlock id={milestone.id} milestones={props.milestones} status={props.status} />
                <Typography.Title className="font-semibold">{progress(milestone.id)}</Typography.Title>
                <Layout.Row className="items-center gap-2">
                    <Layout className="w-4 h-4 bg-primary block rounded-full"></Layout>
                    <Typography.Caption className="capitalize">{props.progress[milestone.id].completed} completed</Typography.Caption>
                </Layout.Row>
                <Layout.Row className="items-center gap-2">
                    <Layout className="w-4 h-4 bg-gray-200 block rounded-full"></Layout>
                    <Typography.Caption className="capitalize">{props.progress[milestone.id].total} total</Typography.Caption>
                </Layout.Row>
                <Typography.Caption className="text-lg font-semibold capitalize">{milestone.description}</Typography.Caption>
            </Layout.Card>
        ))}
    </Layout.Grid>
}

const GroupMilestonesBlock = () => {
    const group = useGroup();
    const milestones = useFetch({
        method: "GET",
        url: `/api/milestones/${group.id}`,
        get_autoFetch: true,
    });
    const status = useFetch({
        method: "GET",
        url: `/api/status/${group.id}`,
        get_autoFetch: true,
    });
    const milestonesProgress = useMemo(() => {
        if (milestones.data && status.data) {
            let progress = {};
            milestones.data.forEach(milestone => {
                progress[milestone.id] = {
                    total: 0,
                    completed: 0,
                }
            })
            status.data.forEach(status => {
                if (status.milestone) {
                    progress[status.milestone].total += 1;
                    if (status.type === 3) {
                        progress[status.milestone].completed += 1;
                    }
                }
            })
            return progress;
        }
        return {};
    }, [milestones.data, status.data]);
    return (
        <Layout.Col className="p-4 min-h-screen gap-2">
            <AddMilestoneBlock milestones={milestones} />
            <MilestonesBlock milestones={milestones} progress={milestonesProgress} status={status} />
        </Layout.Col>
    )
}

export default GroupMilestonesBlock;