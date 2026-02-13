/* eslint-disable no-self-assign */
/* eslint-disable no-var */
(window._iconfont_svg_string_ =
  '<svg><symbol id="icon-informationLine" viewBox="0 0 1024 1024"><path d="M512 64a448 448 0 1 1 0 896A448 448 0 0 1 512 64z m0 89.6a358.4 358.4 0 1 0 0 716.8A358.4 358.4 0 0 0 512 153.6z m0 313.6a44.8 44.8 0 0 1 44.48 39.552L556.8 512v179.2a44.8 44.8 0 0 1-89.28 5.248L467.2 691.2V512a44.8 44.8 0 0 1 44.8-44.8z m0-192.64a58.24 58.24 0 1 1 0 116.48 58.24 58.24 0 0 1 0-116.48z"  ></path></symbol></svg>'),
  ((n) => {
    var t = (e = (e = document.getElementsByTagName('script'))[e.length - 1]).getAttribute(
        'data-injectcss',
      ),
      e = e.getAttribute('data-disable-injectsvg');
    if (!e) {
      var o,
        i,
        a,
        d,
        c,
        s = function (t, e) {
          e.parentNode.insertBefore(t, e);
        };
      if (t && !n.__iconfont__svg__cssinject__) {
        n.__iconfont__svg__cssinject__ = !0;
        try {
          document.write(
            '<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>',
          );
        } catch (t) {
          console && console.log(t);
        }
      }
      (o = function () {
        let t,
          e = document.createElement('div');
        (e.innerHTML = n._iconfont_svg_string_),
          (e = e.getElementsByTagName('svg')[0]) &&
            (e.setAttribute('aria-hidden', 'true'),
            (e.style.position = 'absolute'),
            (e.style.width = 0),
            (e.style.height = 0),
            (e.style.overflow = 'hidden'),
            (e = e),
            (t = document.body).firstChild ? s(e, t.firstChild) : t.appendChild(e));
      }),
        document.addEventListener
          ? ~['complete', 'loaded', 'interactive'].indexOf(document.readyState)
            ? setTimeout(o, 0)
            : ((i = function () {
                document.removeEventListener('DOMContentLoaded', i, !1), o();
              }),
              document.addEventListener('DOMContentLoaded', i, !1))
          : document.attachEvent &&
            ((a = o),
            (d = n.document),
            (c = !1),
            l(),
            (d.onreadystatechange = function () {
              'complete' == d.readyState && ((d.onreadystatechange = null), r());
            }));
    }
    function r() {
      c || ((c = !0), a());
    }
    function l() {
      try {
        d.documentElement.doScroll('left');
      } catch (t) {
        return void setTimeout(l, 50);
      }
      r();
    }
  })(window);
