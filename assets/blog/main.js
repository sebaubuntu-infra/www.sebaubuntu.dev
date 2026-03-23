//
// SPDX-FileCopyrightText: Sebastiano Barezzi <seba@sebaubuntu.dev>
// SPDX-License-Identifier: MIT
//

const POSTS_JSON_PATH = "assets/blog/posts.json";

const mainPageElement = document.getElementById("main-page");

class Post {
    /**
     * Post constructor.
     * @param {number} id The ID of the post
     * @param {string} title The title of the post
     * @param {string} description The description of the post
     * @param {string} author The author of the post
     * @param {number} timestamp The timestamp of the post
     */
    constructor(id, title, description, author, timestamp) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.author = author;
        this.timestamp = timestamp;
    }

    /**
     * Create a Post from a JSON object.
     * @param {object} json A JSON object representing the post
     * @returns {Post} The post object
     */
    static fromJson(json) {
        return new Post(json.id, json.title, json.description, json.author, json.timestamp);
    }

    /**
     * Get a human readable date from the timestamp.
     * @returns {string} The formatted date
     */
    getFormattedDate() {
        var date = new Date(this.timestamp);
        return date.toLocaleDateString("en-US", {year: "numeric", month: "long", day: "numeric"});
    }

    /**
     * Get a button to let the user open the post.
     * @returns {HTMLElement} The HTML representation of the post
     */
    getButtonHtml() {
        const card = document.createElement("mdui-card");
        card.href = `blog.html?post=${this.id}`;
        card.classList.add("post-card");
        card.innerHTML = `
            <h5 class="post-card-description">${this.description}</h5>
            <h2 class="post-card-title">${this.title}</h2>
            <p class="info">
                <mdui-icon name="calendar_month--outlined" alt="Date"></mdui-icon>
                <a>${this.getFormattedDate()}</a>

                <mdui-icon name="account_circle--outlined" alt="Author"></mdui-icon>
                <a>${this.author}</a>
            </p>
        `;

        return card;
    }

    /**
     * Get the HTML content of the post.
     * @returns {Promise<string>} The HTML content of the post
     */
    async getContentHtml() {
        var response = await fetch(`assets/blog/posts/${this.id}.html`);
        var text = await response.text();
        return text;
    }
}

/**
 * Get the posts from the JSON file.
 * @returns {Promise<Post[]?>} The posts, or null if the request failed
 */
async function getPosts() {
    let response = await fetch(POSTS_JSON_PATH);
    if (!response.ok) {
        return null;
    }

    let data = await response.json();

    return data.map(post => Post.fromJson(post));
}

async function main() {
    mainPageElement.innerHTML = "";

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    let posts = await getPosts();
    if (!posts) {
        // Add a warning to the user
        mainPageElement.innerHTML += `
            <h1 class="warning">Failed to load the blog posts.</h1>
        `;
        return;
    }

    // If the user requested a specific post, show it
    if (urlParams.has('post')) {
        let requestedPost = urlParams.get('post');
        let post = posts.find(post => post.id == requestedPost);
        if (!post) {
            // Add a warning to the user
            mainPageElement.innerHTML += `
                <h1 class="warning">The requested post does not exist.</h1>
                <a href="blog.html" class="back-button">Back</a>
            `;
            return;
        }

        // Replace the blog content with the requested post
        let contentHtml = await post.getContentHtml();

        // Add title, description and date
        mainPageElement.innerHTML += `
            <mdui-card id="post-header">
                <h1 id="post-header-title">${post.title}</h1>
                <h4 id="post-header-info">Written on ${post.getFormattedDate()} by ${post.author}</h4>
            </mdui-card>
            <div id="post-content">
                ${contentHtml}
            </div>
        `;
    } else {
        // The user didn't request a specific post, show the list of posts
        const postsListElement = document.createElement("div");
        postsListElement.classList.add("posts-list");

        posts.forEach(post => {
            postsListElement.appendChild(post.getButtonHtml());
        });

        mainPageElement.appendChild(postsListElement);
    }
}

main();
