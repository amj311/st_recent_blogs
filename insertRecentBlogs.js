function insertRecentBlogs(elId,version="latest") {
    let anchorEl = document.getElementById(elId);
    let html = /*html*/`
        <script src="https://cdn.jsdelivr.net/gh/amj311/st_recent_blogs@${version}/RecentBlogs.vue.js"></script>
        <div id="RecentBlogInsert"><recentblogs :config="CONFIG.RECENT_BLOGS"></recentblogs></div>
        <script>new Vue({el:"#RecentBlogInsert",data:{CONFIG}});</script>
    `
    anchorEl.outerHTML = html;
}