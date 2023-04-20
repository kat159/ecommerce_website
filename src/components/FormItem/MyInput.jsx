export default {
    Text: ({ itemProps, entryProps }) => (
        <Form.Item {...itemProps}>
            <Input {...entryProps} />
        </Form.Item>
    ),
    TextArea: ({ itemProps, entryProps }) => (
        <Form.Item {...itemProps}>
            <Input.TextArea {...entryProps} />
        </Form.Item>
    ),
    [INTEGER]: ({ itemProps, entryProps }) => (
        <Form.Item {...itemProps}
            rules={[
                {
                    pattern: /^-?\d+$/,
                    required: true,
                    validator: (rule, value) => {
                        if (value === undefined || value === null || value === '') {
                            return Promise.resolve();
                        }
                        if (value > 2147483647 || value < -2147483648) {
                            return Promise.reject('Value is out of range');
                        }
                        return Promise.resolve();
                    },
                    message: 'Must be an integer',
                },
            ]}
        >
            <Input {...entryProps} />
        </Form.Item>
    ),
    [NUMBER]: ({ itemProps, entryProps }) => (
        <Form.Item {...itemProps}
            rules={[
                {
                    pattern: /^-?\d+(\.\d+)?$/,
                    required: true,
                    validator: (rule, value) => {
                        if (value === undefined || value === null || value === '') {
                            return Promise.resolve();
                        }
                        if (value > 2147483647 || value < -2147483648) {
                            return Promise.reject('Value is out of range');
                        }
                        return Promise.resolve();
                    },
                    message: 'Must be a number',
                },
            ]}
        >
            <InputNumber {...entryProps}
            />
        </Form.Item>
    ),
    [POSTIVE_INTEGER]: ({ itemProps, entryProps }) => (
        <Form.Item {...itemProps}
            rules={[
                {
                    // must be positive integer, not overflow, no leading zero
                    pattern: /^[1-9]\d*$/,
                    message: 'Must be a positive integer',
                },
                {
                    validator: (rule, valueStr) => {
                        if (valueStr === undefined || valueStr === null || valueStr === '') {
                            return Promise.resolve();
                        }
                        // convert value to number
                        let value = Number(valueStr);
                        if (value > 2147483647 || value < 0) {
                            return Promise.reject('Value is out of range');
                        }
                        return Promise.resolve();
                    },
                    message: 'Must between 1 and 2147483647',
                },
                ...itemProps.rules,
            ]}
        >
            <Input {...entryProps} />
        </Form.Item>
    ),
    [MULTI_INPUT]: ({ itemProps, entryProps }) => (
        <Form.List {...itemProps}
            rules={[
                {
                    validator: async (_, values) => {
                        if (!values || values.length < 1) {
                            return Promise.reject(new Error('Must have at least one item'));
                        }
                    },
                },
            ]}
        >
            {(fields, { add, remove }, { errors }) => {
                return <>
                    {fields.map((field, index) => (
                        <Form.Item
                            label={index !== 0 ? '' : <MySpace>
                                {itemProps.label}
                                <PlusOutlined onClick={() => add()} />
                            </MySpace>

                            }
                            required={true}
                            key={field.key}
                        >
                            <Form.Item
                                {...field}
                                validateTrigger={['onChange', 'onBlur']}
                                rules={[
                                    {
                                        required: true,
                                        whitespace: true,
                                        message: "Cannot be empty",
                                    },
                                ]}
                                noStyle
                            >
                                <Input
                                    style={{
                                        width: '60%',
                                    }}
                                />
                            </Form.Item>
                            {fields.length > 1 ? (
                                <MinusCircleOutlined
                                    className="dynamic-delete-button"
                                    onClick={() => remove(field.name)}
                                />
                            ) : null}
                        </Form.Item>
                    ))}
                    {/* <Form.Item>
                        <Form.ErrorList errors={errors} />
                    </Form.Item> */}
                </>
            }}
        </Form.List>
    ),
}