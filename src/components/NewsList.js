import React, { useEffect, useState } from 'react';
import { Layout, notification, Spin, Menu, Row, Pagination } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import moment from "moment";

import "./NewsList.css";

const { SubMenu, Item } = Menu;

const styles =
{
    newsTitle:
    {
        padding: 5,
        display: "flex",
        position: "relative",
        alignItems: "center"
    }
}

const apiKey = "86e9505ad3424fc3b8de83d09b720aaa";

export default props =>
{
    const [isLoading, setIsLoading] = useState(false);
    const [news, setNews] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);

    const getNewsTitle = article => (
        <section style={styles.newsTitle} title={article.description}>
            <img height="60px" width="60px" src={article.urlToImage} alt={article.title} />
            <div style={{ display: "flex", flexDirection: "column", marginLeft: 30, justifyContent: "center"}}>
                <strong>{article.title}</strong>
                <em>{article.author || "ANONYMOUS"}</em>
            </div>
        </section>
    )

    const fetchNews = async (searchStr = "Nigeria", page = 1) =>
    {
        setIsLoading(true);
        try
        {
            const url = `https://newsapi.org/v2/everything?q=${searchStr}&page=${page}`;
            const resp = await fetch(url,
            {
                headers:
                {
                    "Authorization": `Bearer ${apiKey}`
                }
            });
            const json = await resp.json();
            if (json.status === "error")
                throw new Error(json.message)

            const newsItems = json.articles.map((article, i) => (
                <SubMenu
                    key={`article ${i}`}
                    title={getNewsTitle(article)}
                >
                    <Item 
                        key={`article ${i}items`}
                    >
                        <article>
                            <h2 style={{textAlign: "center"}}>{article.title}</h2>
                            <Row
                                justify="space-between"
                                style={{width: 250, margin: "0 auto", textTransform: "uppercase", fontSize: "smaller"}}
                            >
                                <span>
                                    {article.author || "ANONYMOUS"}
                                </span>
                                <span>|</span>
                                <span>{moment(article.publishedAt).format("Do MMM")}</span>
                            </Row>
                            <p style={{padding: "20px 100px"}}>{article.content}</p>
                            <a style={{padding: "20px 100px"}} href={article.url}>Read more</a>
                        </article>

                    </Item>
                </SubMenu>
            ))
            setNews(newsItems);
            setCurrentPage(page);
            setTotalPages(Math.ceil(json.totalResults / json.articles.length))
        }
        catch(e)
        {
            console.log("Error fetching news: ", e);
            notification.error({ message: `Error fetching news: ${e.message || e}` })
        }
        setTimeout(() => setIsLoading(false), 400);
    }

    useEffect(() =>
    {
        fetchNews();
    }, []);

    const handlePaginationChange = async page =>
    {
        await fetchNews("Nigeria", page);
    }

    return (
        <Layout className="news-list" style={{minHeight: "100vh", padding: "4rem 2rem"}}>
            <Pagination
                total={totalPages}
                current={currentPage}
                onChange={handlePaginationChange}
                style={{marginBottom: 10}}
                showSizeChanger={false}
            />
            {
                isLoading ?
                <Spin 
                    style={{margin: "5rem auto", textAlign: "center", display: "block"}}
                    size="large"
                    indicator={<LoadingOutlined />}
                />
                :
                <Menu
                    mode="inline"
                    multiple={false}
                >
                    {news}
                </Menu>
            }
        </Layout>
    )
}