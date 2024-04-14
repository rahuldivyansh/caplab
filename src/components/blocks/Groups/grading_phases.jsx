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

const AddPhaseBlock = (props) => {
    const group = useGroup();
    const [addPhaseModalOpen, setAddPhaseModalOpen] = useState(false);
    const addPhase = useFetch({
        method: "POST",
        url: `/api/grades/${group.id}/phases`,
    });
    const handleModalClose = () => {
        setAddPhaseModalOpen(prev => !prev);
    }
    const onAddPhaseFormSubmit = async (formData) => {
        try {
            const { data, error } = await addPhase.dispatch({ ...formData, group: group.id });
            if (error) {
                throw error;
            }
            if (data) {
                props.phases.setData(prev => [...prev, data])
                toast.success("Phase added successfully");
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
            <Modal open={addPhaseModalOpen} onClose={handleModalClose} title="Add phase">
                <Layout.Col className="lg:min-w-[500px]">
                    <Form onSubmit={onAddPhaseFormSubmit}>
                        <Layout.Col className="p-4 gap-2 items-start">
                            <Form.Input name="name" type="text" placeholder="enter phase name..." className="w-full" />
                            <Button className="btn-primary" loading={addPhase.loading}>submit</Button>
                        </Layout.Col>
                    </Form>
                </Layout.Col>
            </Modal>
        </Layout.Row>
    )
}

const RemovePhaseBlock = (props) => {
    const group = useGroup();
    const removePhase = useFetch({
        method: "DELETE",
        url: `/api/grades/${group.id}/phases/${props.id}`,
    });
    const handleRemovePhase = async () => {
        try {
            const { data, error } = await removePhase.dispatch();
            if (error) {
                throw error;
            }
            if (data) {
                props.phases.dispatch();
                toast.success("Phase removed successfully");
            }
        } catch (error) {
            toast.error("An error occurred while removing milestone");
            console.log(error);
        }
    }
    return <Button onClick={handleRemovePhase} className="btn-icon "><TrashIcon size={20} className='text-red-500' /></Button>
}

const PhasesBlock = (props) => {

    if (props.phases.loading) return <LoaderElement />
    if (!props.phases.data) return null;
    if (Array.isArray(props.phases.data) && props.phases.data.length == 0) return <EmptyElement />
    return <Layout.Grid className="grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
        {props.phases.data.map(phase => (
            <Layout.Card key={phase.id} className="relative p-4 border border-gray-200 rounded-md flex flex-col items-center justify-center gap-2">
                <RemovePhaseBlock id={phase.id} phases={props.phases} />
                <Typography.Caption className="text-lg font-semibold capitalize">{phase.name}</Typography.Caption>
            </Layout.Card>
        ))}
    </Layout.Grid>
}

const GradingPhasesBlock = () => {
    const group = useGroup();
    const phases = useFetch({
        method: "GET",
        url: `/api/grades/${group.id}/phases`,
        get_autoFetch: true,
    });

    return (
        <Layout.Col className="p-4 min-h-screen gap-2">
            <AddPhaseBlock phases={phases} />
            <PhasesBlock phases={phases} />
        </Layout.Col>
    )
}

export default GradingPhasesBlock;