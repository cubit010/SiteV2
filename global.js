fetch("/components/webring.html")
    .then(response => response.text())
    .then(html => {
        document.getElementById("webring").innerHTML = html;
    });