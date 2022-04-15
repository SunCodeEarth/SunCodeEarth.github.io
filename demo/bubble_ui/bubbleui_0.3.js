
/**
 * A bubble style user interface based on d3.js
 * @author Shipeng Sun
 * @github SunCodeEarth
 */
class BubbleUI {
    /**
     * 
     * @param {*} div_id 
     * @param {*} options 
     */
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
        this.sR = 0; //shrinked or smaller Radius for circles not being clicked/focused
        this.nTop = 0;
        this.maxSubN = 9;
        this.colN = 0;
        this.rowN = 0;

        this.el = options.focalEnlargeFactor;

        this.svg = null;
    }

    get colnum() {
        return this.colN;
    }

    init() {
        this.svg = this.div
            .append("svg")
            .attr("class", "mainBubbleSVG")
            .on("mouseleave", () => this.reset());
    }

    addData(root) {

        let bubbleObj = this.svg
            .selectAll(".topBubble")
            .data(root.children)
            .enter()
            .append("g")
            .attr("id", (d, i) => "topBubbleAndText_" + i);

        this.nTop = root.children.length;
        let colVals = d3.scale.category10();

        bubbleObj
            .append("circle")
            .attr("class", "topBubble")
            .attr("id", (d, i) => "topBubble" + i)
            .style("fill", (d, i) => colVals(i))
            .on("mouseover", (d, i) => this.activate(i));

        bubbleObj
            .append("text")
            .attr("class", "topBubbleText")
            .text((d) => d.name)
            .style("fill", (d, i) => colVals(i))
            //.attr("text-anchor", "middle")
            //.attr("dominant-baseline", "middle")
            //.attr("alignment-baseline", "middle")
            .on("mouseover", (d, i) => this.activate(i));

        for (var iB = 0; iB < this.nTop; iB++) {
            let childBubbles = this.svg
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

    /**
     * Determin the position of i th child bubble position
     * @param {*} i index of the child bubble
     * @param {*} cx center X of the parent bubble
     * @param {*} cy center Y of the parent bubble
     * @param {*} r  radius of the main bubble, diameter of the max child bubble
     * @param {*} n the arranged number of child bubbles
     * @param {*} br child bubble shrink ratio
     */
    subBubblePos(i, cx, cy, r, n, br = 0.88, t = 'all', rotateI = -1) {
        i += rotateI;
        if (t == 'all') {
            // shrink the R so that bubbles will not overlap
            let maxR = Math.min(r * br * 0.5, br * 2 * Math.PI * 1.5 * r / 2 / n);
            return [cx + Math.cos(2 * Math.PI * i / (n + 1)) * (r + r / 2.0), cy + Math.sin(2 * Math.PI * i / (n + 1)) * (r + r / 2.0), maxR];
        } else if (t == 'x') {
            let maxR = Math.min(r * br * 0.5, br * 2 * Math.PI * 1.5 * r / 2 / n);
            return cx + Math.cos(2 * Math.PI * i / (n + 1)) * (r + r / 2.0);
        } else if (t == 'y') {
            let maxR = Math.min(r * br * 0.5, br * 2 * Math.PI * 1.5 * r / 2 / n);
            return cy + Math.sin(2 * Math.PI * i / (n + 1)) * (r + r / 2.0);
        } else if (t == 'r') {
            return Math.min(r * br * 0.5, br * 2 * Math.PI * 1.5 * r / 2 / n);
        } else {
            return null;
        }
    }

    /**
     * 
     */
    resize() {

        let w = this.div.node().offsetWidth,
            tm = this.options.margins[0],
            lm = this.options.margins[1],
            bm = this.options.margins[2],
            rm = this.options.margins[3];

        this.colN = this.options.responsiveSetting(w);
        this.rowN = Math.ceil(this.nTop / this.colN);

        this.initR = (w - lm - rm) / 4 / this.colN;
        this.sR = (w - lm - rm) / 4 / (this.colN - 1 + this.el);
        let h = tm + bm + this.sR * 4 * (this.el + this.rowN - 1);

        this.div.style("height", h + "px");

        this.svg.attr("width", w);
        this.svg.attr("height", h);


        this.reset();
    }


    reset() {
        let w = document.getElementById("mainBubble").offsetWidth,
            m = this.colN,
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
                .style("opacity", 0.5)
                .attr("font-size", 6)
                .attr("x", (d, i) => {
                    return this.subBubblePos(i, centerXs[iB], centerYs[iB], oR, this.maxSubN, 0.88, 'x')
                })
                .attr("y", (d, i) => {
                    return this.subBubblePos(i, centerXs[iB], centerYs[iB], oR, this.maxSubN, 0.88, 'y')
                });
            /* // have to figure to how to refer this correctly inside a class definition
            .each((d, i, n) => {
                let xy = this.subBubblePos(i, centerXs[iB], centerYs[iB], oR, this.maxSubN, 0.88);

                d3.select(this)
                    .attr("x", xy[0])
                    .attr("y", xy[1])
            });
            */
            t.selectAll(".childBubble" + iB)
                .attr("r", (d, i) => {
                    return this.subBubblePos(i, centerXs[iB], centerYs[iB], oR, this.maxSubN, 0.68, 'r')
                })
                .attr("cx", (d, i) => {
                    return this.subBubblePos(i, centerXs[iB], centerYs[iB], oR, this.maxSubN, 0.88, 'x')
                })
                .attr("cy", (d, i) => {
                    return this.subBubblePos(i, centerXs[iB], centerYs[iB], oR, this.maxSubN, 0.88, 'y')
                })
                .style("opacity", 0.5);
        }

    }

    /**
     * 
     * @param {*} i 
     */
    activate(i) {
        let w = document.getElementById("mainBubble").offsetWidth,
            m = this.colN,
            tm = this.options.margins[0],
            lm = this.options.margins[1],
            bm = this.options.margins[2],
            rm = this.options.margins[3];

        // increase this bubble and decrease others
        let t = this.svg.transition().duration(d3.event && d3.event.altKey ? 7500 : 350);

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
                .attr("x", (d, i) => {
                    return this.subBubblePos(i, centerXs[k], centerYs[k], centerRs[k], this.maxSubN, 0.68, 'x');
                })
                .attr("y", (d, i) => {
                    return this.subBubblePos(i, centerXs[k], centerYs[k], centerRs[k], this.maxSubN, 0.68, 'y');
                })
                .attr("font-size", () => k == i ? 12 : 6)
                .style("opacity", () => k == i ? 1 : 0);

            t.selectAll(".childBubble" + k)
                .attr("cx", (d, i) => {
                    return this.subBubblePos(i, centerXs[k], centerYs[k], centerRs[k], this.maxSubN, 0.68, 'x');
                })
                .attr("cy", (d, i) => {
                    return this.subBubblePos(i, centerXs[k], centerYs[k], centerRs[k], this.maxSubN, 0.68, 'y');
                })
                .attr("r", (d, i) => {
                    return this.subBubblePos(i, centerXs[k], centerYs[k], centerRs[k], this.maxSubN, 0.78, 'r');
                })
                .style("opacity", () => k == i ? 1 : 0);
        }

    }

}