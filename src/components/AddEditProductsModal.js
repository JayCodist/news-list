import React, { useEffect, useState } from 'react';
import { Modal, Input, Row, Button, notification } from "antd";

const backendUrl = "https://avios-api.herokuapp.com";

export default props =>
{
    const { visible, product, cancel, refresh } = props;

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [varieties, setVarieties] = useState([]);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() =>
    {
        if (product)
        {
            setName(product.product_name || "");
            setDescription(product.product_description || "");
            setVarieties(product.product_varieties || []);
        }
    }, [product])

    const handleCancel = () =>
    {
        setName("");
        setDescription("");
        setVarieties([]);
        cancel();
    }

    const handleSubmit = async () =>
    {
        setIsSaving(true);
        try
        {
            if (product && product.id)
            {
                const resp = await fetch(backendUrl,
                {
                    method: "PUT",
                    headers:
                    {
                        'Content-Type': 'application/json',
                        'Origin': 'test-client'
                    },
                    body: JSON.stringify(
                    {
                        id: product.id,
                        product_name: name,
                        product_description: description,
                        product_varieties: varieties
                    })
                });
                const json = await resp.json();
                if (json.error)
                {
                    console.log("error: ", json.error)
                    notification.error({ message: `Error occured: ${json.error}` });
                }
                else
                {
                    notification.success({ message: "Product successfully saved" });
                    refresh();
                    setTimeout(() => handleCancel(), 300)
                }
            }
            else
            {
                const resp = await fetch(backendUrl,
                {
                    method: "POST",
                    headers:
                    {
                        'Content-Type': 'application/json',
                        'Origin': 'test-client'
                    },
                    body: JSON.stringify(
                    {
                        product_name: name,
                        product_description: description,
                        product_varieties: varieties
                    }),
                });
                const json = await resp.json();
                if (json.error)
                {
                    console.log("error: ", json.error)
                    notification.error({ message: `Error occured: ${json.error}` });
                }
                else
                {
                    notification.success({ message: "Product successfully saved" });
                    refresh();
                    setTimeout(() => handleCancel(), 300)
                }
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
            onCancel={handleCancel}
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