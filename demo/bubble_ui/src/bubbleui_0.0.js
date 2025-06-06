/*
    A bubble style user interface based on d3.js
*/
class BubbleUI {

    constructor(div_id, options = {
        "focalEnlargeFactor": 2.0,
        "margins": [20, 20, 20, 20], // top, left, bottom, right margins to the DIV
        "responsiveSetting": (p) => {
            if (p >= 1080) return 4;
            else if (p >= 600) return 2;
            else return 1;
        },
    }) {
        this.div = d3.select(div_id);
        this.options = options;

        this.initR = 0;
        this.shrinkR = 0;
        this.nTop = 0;
        this.maxSubN = 9;
        this.colNum = 0;
        this.rowNum = 0;

        this.el = options.focalEnlargeFactor;

        this.svg = null;
    }

    init() {
        this.svg = this.div
            .append("svg")
            .attr("class", "mainBubbleSVG")
            .on("mouseleave", () => this.reset());
    }

    addData(dat) {
        let root = dat;

        var bubbleObj = this.svg
            .selectAll(".topBubble")
            .data(root.children)
            .enter()
            .append("g")
            .attr("id", (d, i) => "topBubbleAndText_" + i);

        this.nTop = root.children.length;
        var colVals = d3.scale.category10();

        bubbleObj
            .append("circle")
            .attr("class", "topBubble")
            .attr("id", (d, i) => "topBubble" + i)
            .style("fill", (d, i) => colVals(i))
            .style("opacity", 0.3)
            .on("mouseover", (d, i) => this.activate(i));

        bubbleObj
            .append("text")
            .attr("class", "topBubbleText")
            .text((d) => d.name)
            .style("fill", (d, i) => colVals(i))
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .attr("alignment-baseline", "middle")
            .on("mouseover", (d, i) => this.activate(i));

        for (var iB = 0; iB < this.nTop; iB++) {
            var childBubbles = this.svg
                .selectAll(".childBubble" + iB)
                .data(root.children[iB].children)
                .enter()
                .append("g");

            childBubbles
                .append("circle")
                .attr("class", "childBubble" + iB)
                .attr("id", (d, i) => "childBubble_" + iB + "sub_" + i)
                .attr("cursor", "pointer")
                .style("opacity", 0.5)
                .style("fill", "#eee")
                .on("click", (d, i) => window.open(d.address))
                .on("mouseover", (d, i) => {
                    var noteText = "";
                    if (d.note == null || d.note == "") {
                        noteText = d.address;
                    } else {
                        noteText = d.note;
                    }
                    d3.select("#bubbleItemNote").text(noteText);
                })
                .append("svg:title")
                .text((d) => d.address);

            childBubbles
                .append("text")
                .attr("class", "childBubbleText" + iB)
                .attr("text-anchor", "middle")
                .style("fill", (d, i) => colVals(iB))
                .attr("cursor", "pointer")
                .attr("dominant-baseline", "middle")
                .attr("alignment-baseline", "middle")
                .text((d) => d.name)
                .on("click", (d, i) => window.open(d.address));
        }
    }

    /*
    m: the number of columns
    */
    staticBubbleCenters(m) {
        /*
            n: total # of top level bubbles
            w: width of the DIV
            l: left margin
            r: right margin
        */
        return (n, w, l = 20, r = 20, t = 20, b = 20) => {
            let wi = w - l - r, // the inner width
                rd = wi / 4 / m,
                cXs = new Array(n),
                cYs = new Array(n);

            for (let j = 0, rr = 0, cc = 0; j < n; ++j) {

                rr = Math.floor(j / m); // row
                cc = j % m; // column

                cXs[j] = l + (2 + 4 * cc) * rd;
                cYs[j] = t + (2 + 4 * rr) * rd;
            }

            return { "x": cXs, "y": cYs };
        };
    }

    /* m: the nubmer of columns */
    focalBubbleCenters(m) {
        /*
            i: ith top bubble
            n: total # of top level bubbles
            w: width of the DIV
            l: left margin
            r: right margin
            el: enlarge factor to the normal top level bubble
        */
        return (i, n, w, l = 20, r = 20, t = 20, b = 20, el = 2) => {

            let wi = w - l - r, // the inner width
                x = wi / 4 / (m - 1 + el); // the size of shrinked circle when normal circle enlarged

            let cXs = new Array(n), cYs = new Array(n), cRs = new Array(n);

            let ir = Math.floor(i / m), ic = i % m;

            let rr = 0, cc = 0;

            for (let j = 0; j < n; ++j) {

                rr = Math.floor(j / m); // row
                cc = j % m; // column

                if (ic == cc) cXs[j] = l + 4 * x * cc + 2 * el * x;
                else if (cc < ic) cXs[j] = l + x * (4 * cc + 2);
                else cXs[j] = l + x * (4 * cc - 2 + 4 * el);

                if (ir == rr) cYs[j] = t + 4 * x * rr + 2 * el * x;
                else if (rr < ir) cYs[j] = t + x * (rr * 4 + 2);
                else cYs[j] = t + x * (rr * 4 - 2 + 4 * el);

                if (i == j) cRs[j] = el * x;
                else cRs[j] = x;
            }

            return { "x": cXs, "y": cYs, "r": cRs, "sr": x };
        }
    }

    resize() {

        let w = this.div.node().offsetWidth,
            tm = this.options.margins[0],
            lm = this.options.margins[1],
            bm = this.options.margins[2],
            rm = this.options.margins[3];

        this.colNum = this.options.responsiveSetting(w);
        this.rowNum = Math.ceil(this.nTop / this.colNum);

        this.initR = w / 4 / this.colNum;
        this.shrinkR = (w - lm - rm) / 4 / (this.colNum - 1 + this.el);
        let h = tm + bm + this.shrinkR * 4 * (this.el + this.rowNum - 1);

        this.div.style("height", h + "px");

        this.svg.attr("width", w);
        this.svg.attr("height", h);


        this.reset();
    }


    reset() {
        let w = document.getElementById("mainBubble").offsetWidth,
            m = this.colNum,
            oR = this.initR,
            tm = this.options.margins[0],
            lm = this.options.margins[1],
            bm = this.options.margins[2],
            rm = this.options.margins[3];

        let centerFunctions = this.staticBubbleCenters(m),
            centers = centerFunctions(this.nTop, w, lm, rm, tm, bm),
            centerXs = centers.x, centerYs = centers.y;

        let t = this.svg.transition().duration(650);

        t.selectAll(".topBubble")
            .attr("r", oR)
            .attr("cx", (d, i) => centerXs[i])
            .attr("cy", (d, i) => centerYs[i]);

        t.selectAll(".topBubbleText")
            .attr("x", (d, i) => centerXs[i])
            .attr("y", (d, i) => centerYs[i])
            .attr("font-size", 30);

        for (var iB = 0; iB < this.nTop; iB++) {
            t.selectAll(".childBubbleText" + iB)
                .attr("x", (d, i) => centerXs[iB] + oR * 1.5 * Math.cos((i - 1) * 360 / this.maxSubN / 180 * Math.PI))
                .attr("y", (d, i) => centerYs[iB] + oR * 1.5 * Math.sin((i - 1) * 360 / this.maxSubN / 180 * Math.PI))
                .style("opacity", 0.5)
                .attr("font-size", 6);

            t.selectAll(".childBubble" + iB)
                .attr("r", (d) => oR / 4.0)
                .attr("cx", (d, i) => centerXs[iB] + oR * 1.5 * Math.cos((i - 1) * 360 / this.maxSubN / 180 * Math.PI))
                .attr("cy", (d, i) => centerYs[iB] + oR * 1.5 * Math.sin((i - 1) * 360 / this.maxSubN / 180 * Math.PI))
                .style("opacity", 0.5);
        }

    }

    activate(i) {
        let w = document.getElementById("mainBubble").offsetWidth,
            m = this.colNum,
            tm = this.options.margins[0],
            lm = this.options.margins[1],
            bm = this.options.margins[2],
            rm = this.options.margins[3];

        // increase this bubble and decrease others
        let t = this.svg.transition().duration(d3.event.altKey ? 7500 : 350);

        let centerFunctions = this.focalBubbleCenters(m),
            centers = centerFunctions(i, this.nTop, w, lm, rm, tm, bm, this.el),
            centerXs = centers.x, centerYs = centers.y, centerRs = centers.r, sr = centers.sr;

        t.selectAll(".topBubble")
            .attr("cx", (d, ii) => centerXs[ii])
            .attr("cy", (d, ii) => centerYs[ii])
            .attr("r", (d, ii) => centerRs[ii]);

        t.selectAll(".topBubbleText")
            .attr("x", (d, ii) => centerXs[ii])
            .attr("y", (d, ii) => centerYs[ii])
            .attr("font-size", (d, ii) => (i == ii) ? 30 * 1.5 : 30 * 0.6);

        for (let k = 0; k < this.nTop; k++) {

            t.selectAll(".childBubbleText" + k)
                .attr("x", (d, i) => centerXs[k] + centerRs[k] * 1.5 * Math.cos((i - 1) * 360 / this.maxSubN / 180 * Math.PI))
                .attr("y", (d, i) => centerYs[k] + centerRs[k] * 1.5 * Math.sin((i - 1) * 360 / this.maxSubN / 180 * Math.PI))
                .attr("font-size", () => k == i ? 12 : 6)
                .style("opacity", () => k == i ? 1 : 0);

            t.selectAll(".childBubble" + k)
                .attr("cx", (d, i) => centerXs[k] + sr * 1.5 * this.el * Math.cos((i - 1) * 360 / this.maxSubN / 180 * Math.PI))
                .attr("cy", (d, i) => centerYs[k] + sr * 1.5 * this.el * Math.sin((i - 1) * 360 / this.maxSubN / 180 * Math.PI))
                .attr("r", () => k == i ? sr : centerRs[k] / 5.0)
                .style("opacity", () => k == i ? 1 : 0);

        }

    }

}