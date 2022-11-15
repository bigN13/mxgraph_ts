import { Dialog, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/24/outline";
import React, { Fragment, useEffect, useRef, useState } from "react";

const FormItemLayout = {
    labelCol: {
        xs: { span: 4 },
        sm: { span: 3 }
    },
    wrapperCol: {
        xs: { span: 4 },
        sm: { span: 16 }
    }
};

const CreateTaskNode = (props: { currentTask: any; visible: any; handleCancel: any; handleConfirm: any; }) => {
    const { currentTask, visible, handleCancel, handleConfirm } = props;
    const [open, setOpen] = useState(false)

    // const { getFieldDecorator } = form;
    const [taskDesc, setTaskDesc] = useState("");
    const [confirmLoading, setConfirmLoading] = useState(false);
    const cancelButtonRef = useRef(null)


    const hideModal = () => {
        handleCancel();
    };

    const locHandleConfirm = () => {
        let error = false;
        // form.validateFields((err:any) => {
        //     if (err) {
        //         error = true;
        //         return null;
        //     }
        // });
        if (error) {
            return null;
        }
        // const taskName = form.getFieldValue("taskName");
        // const { taskDesc } = this.state;
        setConfirmLoading(true);

        setTimeout(() => {
            setConfirmLoading(false);

            const id = Math.ceil(Math.random() * 100);
            handleConfirm({
                type: currentTask,
                // taskName,
                taskDesc,
                id
            });
        }, 1000);
    };

    const handleDescChange = (e: any) => {
        setTaskDesc(e.target.value);
    }

    useEffect(() => {
        setOpen(visible);
      }, [visible]);

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={setOpen}>
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                        &#8203;
                    </span>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                        <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
                            <div>
                                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                                    <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                                </div>
                                <div className="mt-3 text-center sm:mt-5">
                                    <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                                        Add Description
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <div>
                                            <label htmlFor="currentTask" className="block text-sm font-medium text-gray-700">
                                                Task type
                                            </label>
                                            <div className="mt-1">
                                                <input
                                                    id="currentTask"
                                                    name="currentTask"
                                                    type="currentTask"
                                                    autoComplete="currentTask"
                                                    required
                                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="taskName" className="block text-sm font-medium text-gray-700">
                                                Mision name
                                            </label>
                                            <div className="mt-1">
                                                <input
                                                    id="taskName"
                                                    name="taskName"
                                                    type="taskName"
                                                    autoComplete="taskName"
                                                    required
                                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="taskDesc" className="block text-sm font-medium text-gray-700">
                                                Mission details
                                            </label>
                                            <div className="mt-1">
                                                <textarea
                                                    id="taskDesc"
                                                    name="taskDesc"
                                                    rows={4}
                                                    autoComplete="taskDesc"
                                                    onChange={e => handleDescChange(e)}
                                                    required
                                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                />
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                                    onClick={() => setOpen(false)}
                                >
                                    Submit
                                </button>
                                <button
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                                    onClick={() => setOpen(false)}
                                    ref={cancelButtonRef}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    );
}

export default CreateTaskNode;
