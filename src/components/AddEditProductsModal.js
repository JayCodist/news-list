import React, { useEffect, useState } from 'react';
import { Modal, Input, Row, Button, notification } from "antd";

const corsShortFix = "https://cors-anywhere.herokuapp.com/";

const backendUrl = "https://avios-api.herokuapp.com";

export default props =>
{
    const { visible, product, cancel } = props;

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [varieties, setVarieties] = useState([]);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() =>
    {
        if (product)
        {
            setName(product.name || "");
            setDescription(product.description || "");
            setVarieties(product.varieties || []);
        }
    }, [product])

    const handleSubmit = async () =>
    {
        setIsSaving(true);
        try
        {
            if (product)
            {
                const resp = await fetch(`${corsShortFix}/${backendUrl}`,
                {
                    method: "PUT",
                    headers:
                    {
                        'Content-Type': 'application/json',
                        'Origin': 'test-client'
                    },
                    body:
                    {
                        product_name: name,
                        product_description: description,
                        product_varieties: varieties
                    }
                });
                const json = await resp.json();
                console.log(json);
            }
            else
            {
                const resp = await fetch(`${corsShortFix}/${backendUrl}`,
                {
                    method: "POST",
                    headers:
                    {
                        'Content-Type': 'application/json',
                        'Origin': 'test-client'
                    },
                    body:
                    {
                        product_name: name,
                        product_description: description,
                        product_varieties: varieties
                    }
                });
                const json = await resp.json();
                console.log(json);
            }
        }
        catch(e)
        {
            console.log("Error saving product: ", e);
            notification.error({ message: `Error fetching products: ${e}` })
        }
        setIsSaving(false)
    }

    return (
        <Modal
            destroyOnClose
            visible={visible}
            onCancel={cancel}
            footer={null}
        >
            <Row style={{margin: "1rem 0"}}>
                <label>Product Name</label>
                <Input
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
            </Row>

            <Row style={{margin: "1rem 0"}}>
                <label>Product Description</label>
                <Input
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                />
            </Row>

            <Row style={{margin: "1rem 0"}}>
                <label>Product Varieties</label>
            </Row>

            <Button loading={isSaving} type="primary" onClick={handleSubmit}>SAVE</Button>
        </Modal>
    )
}