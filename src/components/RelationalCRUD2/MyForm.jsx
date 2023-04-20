
export default {
    PopForm,
}

const PopForm = (
    onSubmit,
    onCancel,
    title,
    editableFields,
    editingNode,
    children,
    ...props
) => {
    const { form } = props
    const onModalOk = async () => {
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
            </Form>
        </Modal >
    )
}