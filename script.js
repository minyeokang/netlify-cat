//default
const defaultCat = document.getElementById("lottie-home");
const catPath = "cat.json";
const pawPath = "https://assets2.lottiefiles.com/packages/lf20_ypqxhono.json";
const button = document.querySelector("button");
const viewWidth = window.innerWidth;
const PAW_CURSOR = "fa-paw.png";
const randomDuration = Math.floor(Math.random() * 8) + 3;
const randomX = Math.floor(Math.random() * 200) + 200;

//load paw button animation
const pawAnim = lottie.loadAnimation({
  container: button,
  renderer: "svg",
  loop: false,
  autoplay: true,
  path: pawPath,
});

//init
button.addEventListener("click", handleButtonClick);

//functions
function handleButtonClick() {
  showDefaultCat();
  setCursor();
  hideButton().then(() => {
    window.addEventListener("click", handleWindowClick);
  });//prevent event fire if button is still visible 
}

function handleWindowClick(e) {
  createCatAnim(e.clientX, e.clientY);
}

function createCatAnim(x, y) {
  const catContainer = document.createElement("div");
  catContainer.style.cssText = `position: absolute; width: 150px; left: ${x}px; top: ${y}px`;
  document.body.appendChild(catContainer);

  const catAnim = lottie.loadAnimation({
    container: catContainer,
    renderer: "svg",
    loop: false,
    autoplay: true,
    path: catPath,
  });

  const isLeftSide = x < viewWidth / 2;
  const direction = isLeftSide ? 1 : -1;
  moveCat(catContainer, direction);

  if (!isLeftSide) {
    catContainer.style.transform = "rotateY(180deg)";
  }

  catAnim.addEventListener("DOMLoaded", function () {
    //get path
    const svgGroup = catAnim.wrapper.childNodes[0].childNodes[1];
    changeColor(svgGroup)
  });
}

function changeColor(parent){

  const randomRGB = () => Math.floor(Math.random() * 106) + 150;
  const [r, g, b] = [randomRGB(), randomRGB(), randomRGB()];
  //const eachFill = () => `rgb(${randomRGB()},${randomRGB()},${randomRGB()})`; //this get's each random value for each array

  const bodyNode = parent.childNodes[0];
  const headNode = parent.childNodes[1];

  //body
  const bodyPath = bodyNode.childNodes;
  const bodyArray = [];
  bodyPath.forEach((child) => {
    const childNodes = child.childNodes;
    for (let i = 0; i < childNodes.length; i++) {
      bodyArray.push(childNodes[i]);
    }
  });

  //exclude certain parts of body
  const filteredBody = bodyArray.filter(
    (_, index) =>
      index === bodyArray.length - 1 ||
      index === bodyArray.length - 2 ||
      index === 1 ||
      index === 2
  );
  const certainColorOfBody = bodyArray.filter(
    (_, index) => !filteredBody.includes(bodyArray[index])
  );

  certainColorOfBody.forEach((node) =>
    node.setAttribute("fill", `rgb(${r},${g},${b})`)
  );

  //head
  const headPath = headNode.childNodes;
  const headArray = [];
  headPath.forEach((child) => {
    const childNodes = child.childNodes;
    for (let i = 0; i < childNodes.length; i++) {
      headArray.push(childNodes[i]);
    }
  });

  //only face color
  headArray[4].setAttribute("fill", `rgb(${r},${g},${b})`); 
}

function showDefaultCat() {
  const defaultAnim = lottie.loadAnimation({
    container: defaultCat,
    renderer: "svg",
    loop: false,
    autoplay: false,
    path: catPath,
  });

  //set initial position
  defaultCat.style.cssText = `position: absolute; width: 150px; left: ${
    viewWidth / 2
  }px`;

  defaultAnim.play();

  moveCat(defaultCat, 1);
}

function setCursor() {
  const element = document.body;
  element.style.cursor = `url(${PAW_CURSOR}), auto`;
  button.style.cursor = `url(${PAW_CURSOR}), auto`;
}

function hideButton() {
  return new Promise((resolve) => {
    gsap.to(button, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        button.style.visibility = "hidden";
        resolve();
      },
    });
  });
}

const moveCat = (element, int) => {
  gsap.to(element, {
    duration: randomDuration,
    x: randomX * int,
    onComplete: () => gsap.to(element, { opacity: 0 }),
  });
};
