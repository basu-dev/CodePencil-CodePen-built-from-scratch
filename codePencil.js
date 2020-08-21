"use strict";
(function (w, d) {
   function CodePen() {
    const placeholders={
      html:`<div id="hello">hello</div><hello>element</hello>`,
      css:`body{
        display:flex;
        justify-content:center;
        align-items:center;
        font-size: 25px;
        color: black ;
    }
    #hello{
        color:green
    }`,
    js:`const names=["robot","cat","element","dev","cow","human","world","element"]
    setInterval(_=>document.querySelector("hello").innerText=
    names[Math.floor(Math.random()*8)],1000)`
    };
    //formstate holds the gridTemplateRows for the forms  where true true true means `1fr 1fr 1fr`. this is changed to 
    let formState = [true, true, true];
    const a = new DOMParser();
    const select = (selector, query) => selector.querySelector(query),
      selectAll = (selector, query) => selector.querySelectorAll(query),
      jsDiv = select(d, "#js"),
      cssDiv = select(d, "#css"),
      htmlForm = select(d, "[name=htmlForm]"),
      cssForm = select(d, "[name=cssForm]"),
      jsForm = select(d, "[name=jsForm]"),
      htmlDiv = select(d, "#html"),
      on = (selector, eventtype, fn, evBubbling) =>
        selector.addEventListener(eventtype, fn, evBubbling),
      toggleOrchadian = (e, elem) => {
        const setFormHeight = (condition) => {
          let id = 0;
          switch (condition) {
            case "html":
              formState[0] = !formState[0];
              id = 0;
              break;
            case "js":
              formState[2] = !formState[2];
              id = 2;
              break;
            case "css":
              formState[1] = !formState[1];
              id = 1;
              break;
          }
          return id;
        };
        let div = e ? e.target.parentElement.nextElementSibling : elem;
        let id = setFormHeight(div.getAttribute("id"));
        div.style.display = formState[id] ? "block" : "none";
        calculateFormHeight();
      },
      calculateFormHeight = () => {
        const condn = (x) => (x ? 1 : 0);
        let [html, css, js] = formState.map((x) => condn(x));
          (select(
            d,
            ".forms"
          ).style.gridTemplateRows = `${html}fr ${css}fr ${js}fr`)
        
      },
      parseHTML = (html) => {
        return a.parseFromString(html, "text/html").body.innerHTML;
      },
      fullScreen = () => {
        select(d, "#shadow").shadowRoot.host.requestFullscreen();
      };
    d.addEventListener("DOMContentLoaded", () => {
      const res = select(d, "#shadow");
      res.attachShadow({ mode: "open" });
      res.shadowRoot.innerHTML = parseHTML(`
          <container>
          <style>
          ::--webkit-scrollbar{
            width:0;
          }
          #shadowBody{
            margin:0;
            padding:0;
            position:relative;
            height:100vh;
          }
          </style>
          <style id='userstyle'></style>
            <div id="shadowBody"></div>
          </container>
  `);
      let initialLoad = true;
      d.body.append(res);
      //Adding Functionalities to Dom Elements
      let ev = new Event("ShadowDOMLoaded");
      const saveHTML = (e) => {
          e.preventDefault();
          let value = parseHTML(htmlDiv.value);
          res.shadowRoot.querySelector("#shadowBody").innerHTML = value;
          dbSet("html", value);
          d.dispatchEvent(ev);
        },
        saveCss = (e) => {
          e.preventDefault();
          let value = cssDiv.value;
          dbSet("css", value);
          value = value.replace(/body/g, "#shadowBody");
          res.shadowRoot.querySelector("#userstyle").innerHTML = value;
        },
        saveJS = (e) => {
          "use strict";
          e.preventDefault();
          let value = jsDiv.value;
          dbSet("js", value);
          //  value= value.replace(/d/g, "res.shadowRoot");
          value = value.replace(
            /document.querySelectorAll/g,
            "res.shadowRoot.querySelectorAll"
          );
          value = value.replace(
            /document.querySelector/g,
            "res.shadowRoot.querySelector"
          );
          value = value.replace(
            /document.getElementsByClassName/g,
            "res.shadowRoot.querySelectorAll"
          );
          value = value.replace(/DOMContentLoaded/g, "ShadowDOMLoaded");
          //  value = value.replace(/res.shadowRoot.body/g, "res.shadowRoot.querySelector('#shadowBody')");
          //  value = value.replace(/getElementsByClassName((\w+))/g, "as");
          if (!initialLoad) {
            select(htmlForm, ".btn").click();
            select(cssForm, ".btn").click();
            select(jsForm, "textarea").style.transition = "40s";
            history.replaceState(
              {
                html: htmlDiv.scrollTop,
                css: cssDiv.scrollTop,
                js: jsDiv.scrollTop,
                formState: formState,
              },
              "",
              "/"
            );
            location.reload();
          }
          else{
            eval(value)
          }
          initialLoad = false;
        },
        resizeTexearea = (e) => {
          e.target.height = "70vh";
        };
      //adding Event Listners
      on(select(htmlForm, ".btn"), "click", saveHTML);
      on(select(cssForm, ".btn"), "click", saveCss);
      on(select(jsForm, ".btn"), "click", saveJS);
      on(select(d, "textarea"), "focus", resizeTexearea);
      on(select(d, "#FullScreen"), "click", fullScreen);
      let label = selectAll(d, "label .name");
      for (let i = 0; i < label.length; i++) {
        on(label[i], "click", toggleOrchadian);
      }
      //For Development Purposes .......
      const dbSet = (key, value) => {
        sessionStorage.setItem(key, value);
        return true;
      };
      const dbGet = (key) => {
        let val = sessionStorage.getItem(key)
        if(val==null) val = placeholders[key]
        return val;
      };
      let htmlText = dbGet("html"),
        cssText = dbGet("css"),
        jsText = dbGet("js");
      htmlDiv.value = htmlText;
      cssDiv.value = cssText;
      jsDiv.value = jsText;
      select(htmlForm, ".btn").click();
      select(cssForm, ".btn").click();
      select(jsForm, ".btn").click();
      try {
        let { html, css, js } = history.state;
        htmlDiv.scrollTo(0, html);
        cssDiv.scrollTo(0, css);
        jsDiv.scrollTo(0, js);
        formState = history.state.formState.map((x) => (x ? false : true));
        toggleOrchadian(null, htmlDiv);
        toggleOrchadian(null, cssDiv);
        toggleOrchadian(null, jsDiv);
        history.pushState(
          { html: 0, css: 0, js: 0, formState: [true, true, true] },
          "",
          "/"
        );
      } catch (e) {}

      d.dispatchEvent(ev);
    });
  }
 CodePen();
})(window, document);
