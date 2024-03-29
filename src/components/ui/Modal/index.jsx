import React, { Fragment, useState, useEffect } from "react";
import CloseIcon from "@heroicons/react/24/solid/XMarkIcon";
import { Dialog, Transition } from "@headlessui/react";
import Layout from "../Layout";
import Button from "../Button";
import Typography from "../Typography";

const Modal = (props) => {
  return (
    <Dialog
      onClose={props.onClose}
      open={props.open}
      className="bg-black bg-opacity-90 fixed inset-0 justify-end sm:justify-center z-2 items-center"
      as={Layout.Col}
      style={props.style}
    >
      <Transition
        appear
        show={props.open}
        as={Fragment}
        enter="transform transition duration-[400ms]"
        enterFrom="opacity-0 translate-y-20 sm:translate-y-0 sm:scale-0"
        enterTo="opacity-100 translate-y-0 sm:scale-100"
        leave="transform duration-[400ms] transition ease-in-out"
        leaveFrom="opacity-100 sm:scale-100"
        leaveTo="opacity-0 sm:scale-0"
      >
        <Dialog.Panel className="bg-background-light dark:bg-background-dark text-black border rounded-t-xl sm:rounded-xl overflow-hidden border-secondary dark:border-white/10">
          <Layout.Row className="items-center justify-between border-b border-secondary dark:border-white/10 py-1 px-2">
            <Typography.Body className="font-semibold text-black dark:text-white">
              {props.title}
            </Typography.Body>
            <Button onClick={props.onClose} className="btn-icon">
              <CloseIcon className="text-black dark:text-white w-5 h-5" />
            </Button>
          </Layout.Row>
          {props.children}
        </Dialog.Panel>
      </Transition>
    </Dialog>
  );
};

Modal.defaultProps = {
  title: "",
  style: {},
};

export default Modal;
