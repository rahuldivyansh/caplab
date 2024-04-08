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

const MilestonesBlock = (props) => {
    const progress = (milestone_id) => {
        if (props.progress[milestone_id]) {
            let { completed, total } = props.progress[milestone_id];
            return `${completed}/${total}`;
        }
    }
    if (props.milestones.loading) return <LoaderElement />
    if (!props.milestones.data) return null;
    if (Array.isArray(props.milestones.data) && props.milestones.data.length == 0) return <EmptyElement />
    return <Layout.Grid className="grid-cols-1 md:grid-cols-2 gap-2">
        {props.milestones.data.map(milestone => (
            <Layout.Card key={milestone.id} className="p-4 border border-gray-200 rounded-md flex justify-between">
                <Typography.Caption className="text-lg font-semibold">{milestone.description}</Typography.Caption>
                <Typography.Caption className="text-sm font-semibold">{progress(milestone.id)}</Typography.Caption>
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
            <MilestonesBlock milestones={milestones} progress={milestonesProgress} />
        </Layout.Col>
    )
}

export default GroupMilestonesBlock;