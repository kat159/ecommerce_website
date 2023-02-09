import { Tag } from 'antd';
import React from 'react'

/**
 * Used for CRUD on foreign table in one to many relationship
 *  Not selective
 *  insert: popup form, insert immediately the new record into database 
 *  update: popup form, update immediately the record in database
 *  delete: delete when confirmed
 *  directly delete the record in database when deleted
 */

export default function MyCRUDTagGroup({
    name,
    form
}) {
    const initialValue = form.getFieldValue(name);
    const [data, setData] = useState(initialValue);

    return (
        <div>
            {
                data.map((item, index) => {
                    return <Tag key={index}>
                        {item.name}
                    </Tag>
                })
            }
        </div>
    )
}
