function getCData(string) {
    return string?.split("<![CDATA[")[1]?.split("]]>")[0];
}
function getFirstDescendant(el,tagname) {
    return el.getElementsByTagName(tagname)[0];
}
function createBlogFromElement(el) {
    let blog = {};
    blog.title = getCData(el.querySelector("title")?.innerHTML);
    blog.content = getCData(getFirstDescendant(el,"content:encoded")?.innerHTML);
    blog.date = getFirstDescendant(el,"pubDate")?.innerHTML;
    blog.st_link = getFirstDescendant(el,"link")?.innerHTML;
    blog.image = new window.DOMParser().parseFromString(blog.content, "text/html")
        .querySelector("img")?.src;
    blog.description = el.querySelector("description")?.innerHTML;
    return blog;
}

Vue.component('recentblogs',{
    template : /*html*/`
    <div id="RecentBlogsVueWrapper">
        <div v-if="loading">Loading...</div>
        <div v-else style="display: flex; flex-wrap: wrap;">
            <div v-for="blog in recents" style="flex-grow: 1; display: flex; justify-content: center;">
                <div style="margin: 1em; width:100%; max-width: 20em; min-width: 10em; border: 1px solid #ccc">
                    <div v-if="showThumbs" style="width:100%; height: 8em; display: flex">
                        <img :src="blog.image"
                        style="object-fit: cover;
                            height: 100%;
                            width: 100%;
                            object-position: top;" />
                    </div>
                    <div style="padding:1em">
                        <b>{{blog.title || "No Title"}}</b>
                        <p style="word-break: break-word;">{{blog.description}}</p>    
                    </div>
                </div>
            </div>    
        </div>
    </div>`,

    data: function() {
        return {
            blogEls: [],
            recents: [],
            showThumbs: this.config.SHOW_THUMBNAILS,
            loading: true
        }
    },

    props: ["config"],

    mounted() {
        this.loading = true;
        console.log(this.config)
        fetch(this.config.RSS_URL)
            .then(data => data.text() )
            .then(text => new window.DOMParser().parseFromString(text, "text/xml"))
            .then(doc => {
                this.blogEls = [];
                doc.querySelectorAll('item').forEach(blog=>{
                    this.blogEls.push(blog)
                })
                this.prepareMostRecent();
                this.loading = false;
            });
    },

    methods: {
        prepareMostRecent() {
            this.recents = this.blogEls.splice(0,this.config.QTY)
                .map(el=>createBlogFromElement(el));
            console.log(this.recents)
        }
    }
});
