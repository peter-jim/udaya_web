const express = require('express');
const https = require('https');
const fs = require('fs');
const app = express();


// const privateKey = fs.readFileSync('/root/generated-private-key.key', 'utf8');
// const certificate = fs.readFileSync('/root/test2.crt', 'utf8');

const { Client } = require("@notionhq/client");
// const NotionPageToHtml = require('notion-page-to-html');



// Initializing a client

const notion = new Client({
    auth: 'secret_iC2VMEQ7v73UcXcXQSTdBLhxRp0W08qlCXSbhSOVYmG',
})

//https://www.notion.so/udaya-4f3a3951bb864666b2d3d7b047384abd?pvs=4



app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.get('/getTitile', async (req, res) => {

    try {
        const response = await notion.pages.retrieve({
            page_id: '4f3a3951bb864666b2d3d7b047384abd', // Replace with the actual page ID
        });


        // Extract the title


        const title = response.properties.title.title[0];

        // Extract the content
        let content = '';
        if (response.properties.content) {
            content = response.properties.content.rich_text[0].plain_text;
            console.log("2131", content);
        }

        console.log('Title:', title);
        console.log('Content:', response);
        let id = response.id;
        console.log('id:', id);


        const response_id = await notion.blocks.children.list({
            block_id: id,
            page_size: 1000,
        });

        const blog_item = response_id.results;

        console.log('blog_item', blog_item);

        let ids = [];
        for (const item in blog_item) {

            // console.log("blog_item",blog_item[item]);
            if (blog_item[item].type == "child_page") {
                ids.push(blog_item[item].id);
            }
        }

        console.log("ids", ids);

        //here return all blog title.
        let title_info = [];
        for (const i in ids) {
            console.log(ids[i]);
            const title_response = await notion.pages.retrieve({
                page_id: ids[i], // Replace with the actual page ID
            });
            console.log("title_response", title_response.properties.title.title[0].text.content);
            title_info.push({
                title: title_response.properties.title.title[0].text.content,
                id: ids[i]
            });
        }


        res.json(title_info);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

});


app.get('/notion-data', async (req, res) => {
    try {


        const id = req.query.id;
        // const response = await fetch('https://api.notion.com/v1/pages/'+id, {
        //   method: 'GET',
        //   headers: {
        //     'Authorization': 'secret_phgiQzAcp66vKL0rpMZofkaICuGE2xG2ynMFEKczOkO',
        //     'Content-Type': 'application/json',
        //     'Notion-Version': '2021-08-16'
        //   }
        // });


        // const blockId = 'dedfc261-d77d-4eab-96ec-1bc74386b190';
        const content = await notion.blocks.children.list({
            block_id: id,
            page_size: 1000,
        });

        // console.log("content",content.results);

        res.json(content.results);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});


// // 创建 HTTPS 服务器
// const server = https.createServer({
//   key: privateKey,
//   cert: certificate
// }, app);

// // 启动服务器
// server.listen(3001, () => {
//   console.log('Server is running on port 3001');
// });

