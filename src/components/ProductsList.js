import React, { useEffect, useState } from 'react';
import { Table, Layout, Button, notification, Row } from "antd";
import AddEditProductsModal from "./AddEditProductsModal";

const backendUrl = "https://avios-api.herokuapp.com";

export default props =>
{
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [product, setProduct] = useState(null);
    const [showAddEditModal, setShowAddEditModal] = useState(false);

    const fetchProducts = async () =>
    {
        try
        {
        setIsLoading(true);
        const resp = await fetch(backendUrl);
        const products = await resp.json();
        if (Array.isArray(products))
        {
            setProducts(products.map(prod => (
            {
                ...prod,
                editDelete: (
                    <Row justify="space-around">
                        <Button icon="edit" onClick={() => handleEdit(prod)}></Button>
                        <Button icon="delete" onClick={() => handleDelete(prod)}></Button>
                    </Row>)
            })))
        }
        setIsLoading(false);
        }
        catch(e)
        {
            setIsLoading(false);
            console.log("Error fetching products: ", e);
            notification.error({ message: `Error fetching products: ${e}` })
        }
    }

    const handleEdit = prod =>
    {
        setProduct(prod);
        setShowAddEditModal(true);
    }

    const handleDelete = async prod =>
    {
        
    }

    const closeModal = () =>
    {
        setProduct(null);
        setShowAddEditModal(false);
    }

    useEffect(() =>
    {
        fetchProducts();
    }, [])

    const columns =
    [
        { title: "Name", dataIndex: "product_name", key: "product_name" },
        { title: "Description", dataIndex: "product_description", key: "product_description" },
        { title: "Creation Date", dataIndex: "date_uploaded", key: "date_uploaded" },
        { title: "Last Modified Date", dataIndex: "date_edited", key: "date_edited" },
        { title: "*", dataIndex: "editDelete", key: "editDelete" }
    ]
    return (
        <Layout style={{height: "90vh", padding: "4rem 2rem"}}>
            <Row flex="true" justify="end" style={{padding: "0.5rem 0"}}>
                <Button type="primary" onClick={() => setShowAddEditModal(true)}>New Product</Button>
            </Row>
            <Table
                dataSource={products}
                loading={isLoading}
                locale={{emptyText: "No products yet"}}
                columns={columns}
            />
            <AddEditProductsModal
                product={product}
                visible={showAddEditModal}
                cancel={closeModal}
            />
        </Layout>
    )
}