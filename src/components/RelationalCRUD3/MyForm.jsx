import {Form, Modal} from "antd";
const PopForm = ({
    onSubmit,
    onCancel,
    title,
    children,
    ...props
}) => {
    const { form } = props
    const onModalOk = () => {
        onSubmit()
    }

    return (
        <Modal
            open={true}
            title={title}
            okText="Submit"
            cancelText="Cancel"
            onCancel={onCancel}
            onOk={() => {
                onModalOk()
            }}
        >
            <Form
                form={form}
                layout="vertical"
                name="form_in_modal"
            >
                {children}
            </Form>
        </Modal >
    )
}

export default {
  PopForm,
}
