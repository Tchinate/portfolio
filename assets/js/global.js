const timeline = document.querySelector(".timeline ol"),
      items = document.querySelectorAll(".timeline li > div"),
      arrows = document.querySelectorAll(".timeline .arrows .arrow"),
      arrowPrev = document.querySelector(".timeline .arrows .arrow__prev"),
      arrowNext = document.querySelector(".timeline .arrows .arrow__next"),
      firstItem = document.querySelector(".timeline li:first-child"),
      lastItem = document.querySelector(".timeline li:last-child"),
      xScrolling = 280,
      disabledClass = "disabled";

window.addEventListener("load", init);

/* ------------------------------
   INIT
------------------------------ */
function init() {
  setEqualHeights(items);
  animateTimeline(xScrolling, arrows, timeline);
  setSwipeFn(timeline, arrowPrev, arrowNext);
  setKeyboardFn(arrowPrev, arrowNext);
}

/* ------------------------------
   SET EQUAL HEIGHTS
------------------------------ */
function setEqualHeights(el) {
  let maxHeight = 0;
  el.forEach(item => {
    if (item.offsetHeight > maxHeight) {
      maxHeight = item.offsetHeight;
    }
  });
  el.forEach(item => {
    item.style.height = maxHeight + "px";
  });
}

/* ------------------------------
   CHECK IF ELEMENT IS IN VIEWPORT
------------------------------ */
function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.left >= 0 &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/* ------------------------------
   SET BUTTON STATE
------------------------------ */
function setBtnState(btn, disabled = true) {
  if (disabled) {
    btn.classList.add(disabledClass);
    btn.disabled = true;
  } else {
    btn.classList.remove(disabledClass);
    btn.disabled = false;
  }
}

/* ------------------------------
   ANIMATE TIMELINE
------------------------------ */
function animateTimeline(scrolling, arrows, tl) {
  let counter = 0;

  arrows.forEach(arrow => {
    arrow.addEventListener("click", function () {

      arrowPrev.disabled = true;
      arrowNext.disabled = true;

      const direction = this.classList.contains("arrow__prev") ? 1 : -1;

      if (counter === 0 && direction === -1) {
        tl.style.transform = `translateX(-${scrolling}px)`;
      } else {
        const tlStyle = getComputedStyle(tl);
        const matrix = tlStyle.transform || tlStyle.webkitTransform;
        const currentX = parseInt(matrix.split(",")[4]) || 0;
        const newX = currentX + (direction * scrolling);
        tl.style.transform = `translateX(${newX}px)`;
      }

      counter++;

      setTimeout(() => {
        setBtnState(arrowPrev, isElementInViewport(firstItem));
        setBtnState(arrowNext, isElementInViewport(lastItem));
      }, 1100);
    });
  });
}

/* ------------------------------
   SWIPE SUPPORT
------------------------------ */
function setSwipeFn(tl, prev, next) {
  const hammer = new Hammer(tl);
  hammer.on("swipeleft", () => next.click());
  hammer.on("swiperight", () => prev.click());
}

/* ------------------------------
   KEYBOARD NAVIGATION
------------------------------ */
function setKeyboardFn(prev, next) {
  document.addEventListener("keydown", (e) => {
    if (e.which === 37 || e.which === 39) {

      const timelineTop = timeline.offsetTop;
      if (window.pageYOffset !== timelineTop) {
        window.scrollTo(0, timelineTop);
      }

      if (e.which === 37) prev.click();
      if (e.which === 39) next.click();
    }
  });
}
