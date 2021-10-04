export default drawCanvas
function drawCanvas(ideology, moderate, radical, leftunity, libunity, centralized, decentralized, localist, globalist, traditionalist, progressive, reform, revolution, markets, planning) {
    var version = "Test Edition #2.1"
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        var bg = "#141414"
        var fg = "#EEEEEE"
    } else {
        var bg = "#EEEEEE"
        var fg = "#141414" 
    }
        var c = document.createElement("canvas")
        var ctx = c.getContext("2d")
        c.width = 800;
        c.height = 1000;
        ctx.fillStyle = bg
        ctx.fillRect(0,0,800,1000);

        var img = document.getElementById("img-moderate")
        ctx.drawImage(img, 20, 170, 100, 100);
        var img = document.getElementById("img-radical")
        ctx.drawImage(img, 680, 170, 100, 100)
        var img = document.getElementById("img-leftunity")
        ctx.drawImage(img, 20, 290, 100, 100)
        var img = document.getElementById("img-libunity")
        ctx.drawImage(img, 680, 290, 100, 100)
        var img = document.getElementById("img-centralized")
        ctx.drawImage(img, 20, 410, 100, 100)
        var img = document.getElementById("img-decentralized")
        ctx.drawImage(img, 680, 410, 100, 100)
        var img = document.getElementById("img-localist")
        ctx.drawImage(img, 20, 530, 100, 100)
        var img = document.getElementById("img-globalist")
        ctx.drawImage(img, 680, 530, 100, 100)
        var img = document.getElementById("img-traditionalist")
        ctx.drawImage(img, 20, 650, 100, 100)
        var img = document.getElementById("img-progressive")
        ctx.drawImage(img, 680, 650, 100, 100)
        var img = document.getElementById("img-reform")
        ctx.drawImage(img, 20, 770, 100, 100)
        var img = document.getElementById("img-revolution")
        ctx.drawImage(img, 680, 770, 100, 100)
        var img = document.getElementById("img-markets")
        ctx.drawImage(img, 20, 890, 100, 100)
        var img = document.getElementById("img-planning")
        ctx.drawImage(img, 680, 890, 100, 100)

        ctx.fillStyle= "#222222"
        ctx.fillRect(120, 180, 560, 80)
        ctx.fillRect(120, 300, 560, 80)
        ctx.fillRect(120, 420, 560, 80)
        ctx.fillRect(120, 540, 560, 80)
        ctx.fillRect(120, 660, 560, 80)
        ctx.fillRect(120, 780, 560, 80)
        ctx.fillRect(120, 900, 560, 80)
        ctx.fillStyle="#006aa7"
        ctx.fillRect(120, 184, 5.6*moderate-2, 72)
        ctx.fillStyle="#ff0000"
        ctx.fillRect(682-5.6*radical, 184, 5.6*radical-2, 72)
        ctx.fillStyle="#cd0000"
        ctx.fillRect(120, 304, 5.6*leftunity-2, 72)
        ctx.fillStyle="#ff6600"
        ctx.fillRect(682-5.6*libunity, 304, 5.6*libunity-2, 72)
        ctx.fillStyle="#ffe000"
        ctx.fillRect(120, 424, 5.6*centralized-2, 72)
        ctx.fillStyle="#ffffff"
        ctx.fillRect(682-5.6*decentralized, 424, 5.6*decentralized-2, 72)
        ctx.fillStyle="#ff9800"
        ctx.fillRect(120, 544, 5.6*localist-2, 72)
        ctx.fillStyle="#03a9f4"
        ctx.fillRect(682-5.6*globalist, 544, 5.6*globalist-2, 72)
        ctx.fillStyle="#6c9569"
        ctx.fillRect(120, 664, 5.6*traditionalist-2, 72)
        ctx.fillStyle="#ff42ff"
        ctx.fillRect(682-5.6*progressive, 664, 5.6*progressive-2, 72)
        ctx.fillStyle="#ffafe4"
        ctx.fillRect(120, 784, 5.6*reform-2, 72)
        ctx.fillStyle="#890000"
        ctx.fillRect(682-5.6*revolution, 784, 5.6*revolution-2, 72)
        ctx.fillStyle="#21b8e7"
        ctx.fillRect(120, 904, 5.6*markets-2, 72)
        ctx.fillStyle="#ff4900"
        ctx.fillRect(682-5.6*planning, 904, 5.6*planning-2, 72)
        ctx.fillStyle=fg
        ctx.font="700 60px Montserrat"
        ctx.textAlign="left"
        ctx.fillText("liberationvalues", 20, 90)
        ctx.font="50px Montserrat"
        ctx.fillText(ideology, 20, 140)
        ctx.fillStyle= "#222222"
        ctx.textAlign="left"
        if (moderate       > 30) {ctx.fillText(moderate + "%", 130, 237.5)}
        if (leftunity      > 30) {ctx.fillText(leftunity + "%", 130, 357.5)}
        if (centralized    > 30) {ctx.fillText(centralized + "%", 130, 477.5)}
        if (localist       > 30) {ctx.fillText(localist + "%", 130, 597.5)}
        if (traditionalist > 30) {ctx.fillText(traditionalist + "%", 130, 717.5)}
        if (reform         > 30) {ctx.fillText(reform + "%", 130, 837.5)}
        if (markets        > 30) {ctx.fillText(markets + "%", 130, 957.5)}
        ctx.textAlign="right"
        if (radical        > 30) {ctx.fillText(radical + "%", 670, 237.5)}
        if (libunity       > 30) {ctx.fillText(libunity + "%", 670, 357.5)}
        if (decentralized  > 30) {ctx.fillText(decentralized + "%", 670, 477.5)}
        if (globalist      > 30) {ctx.fillText(globalist + "%", 670, 597.5)}
        if (progressive    > 30) {ctx.fillText(progressive + "%", 670, 717.5)}
        if (revolution     > 30) {ctx.fillText(revolution + "%", 670, 837.5)}
        if (planning       > 30) {ctx.fillText(planning + "%", 670, 957.5)}
        ctx.fillStyle=fg
        ctx.font="300 25px Montserrat"
        ctx.fillText("liberationvalues.github.io", 780, 40)
        ctx.fillText(version, 780, 70)
        ctx.textAlign="center"
        ctx.fillText("Radicality Axis: " + document.getElementById("radicality-label").innerHTML, 400, 175)
        ctx.fillText("Co-operation Axis: " + document.getElementById("co-operation-label").innerHTML, 400, 295)
        ctx.fillText("Ownership Axis: " + document.getElementById("ownership-label").innerHTML, 400, 415)
        ctx.fillText("World Axis: " + document.getElementById("world-label").innerHTML, 400, 535)
        ctx.fillText("Culture Axis: " + document.getElementById("culture-label").innerHTML, 400, 655)
        ctx.fillText("Rebelliousness Axis: " + document.getElementById("rebelliousness-label").innerHTML, 400, 775)
        ctx.fillText("Markets Axis: " + document.getElementById("markets-label").innerHTML, 400, 895)

        document.getElementById("banner").src = c.toDataURL();
}