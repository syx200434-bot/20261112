// 宣告 stop 動畫的圖片陣列。
let stopFrames = [];

// 宣告 run 動畫的圖片陣列。
let runFrames = [];

// 宣告 small 動畫的圖片陣列。
let smallFrames = [];

// 宣告 left 動畫的圖片陣列。
let leftFrames = [];

// 宣告 right 動畫的圖片陣列。
let rightFrames = [];

// 設定 stop 動畫的影格數量。
const STOP_FRAME_COUNT = 6;

// 設定 run 動畫的影格數量。
const RUN_FRAME_COUNT = 6;

// 設定 small 動畫的影格數量。
const SMALL_FRAME_COUNT = 5;

// 設定 left 動畫的影格數量。
const LEFT_FRAME_COUNT = 6;

// 設定 right 動畫的影格數量。
const RIGHT_FRAME_COUNT = 6;

// 設定目前播放的動畫狀態。
let currentState = "stop";

// 設定目前播放的動畫影格編號。
let currentFrame = 0;

// 設定動畫換格計時器。
let animationTimer = 0;

// 設定每隔幾次 draw() 切換一次圖片。
const FRAME_DELAY = 8;

// 設定角色每次移動的像素距離。
const MOVE_SPEED = 4;

// 設定角色目前的水平中心座標。
let characterX = 0;

// 設定角色目前的垂直中心座標。
let characterY = 0;

// 預先載入五組動畫的所有獨立圖片。
function preload() {
  // 逐一載入 stop/0.png 到 stop/5.png。
  for (let index = 0; index < STOP_FRAME_COUNT; index++) {
    // 載入目前編號的 stop 動畫圖片。
    stopFrames[index] = loadImage("1/stop/" + index + ".png");
  }

  // 逐一載入 run/0.png 到 run/5.png。
  for (let index = 0; index < RUN_FRAME_COUNT; index++) {
    // 載入目前編號的 run 動畫圖片。
    runFrames[index] = loadImage("1/run/" + index + ".png");
  }

  // 逐一載入 small/0.png 到 small/4.png。
  for (let index = 0; index < SMALL_FRAME_COUNT; index++) {
    // 載入目前編號的 small 動畫圖片。
    smallFrames[index] = loadImage("1/small/" + index + ".png");
  }

  // 逐一載入 left/0.png 到 left/5.png。
  for (let index = 0; index < LEFT_FRAME_COUNT; index++) {
    // 載入目前編號的 left 動畫圖片。
    leftFrames[index] = loadImage("1/left/" + index + ".png");
  }

  // 逐一載入 right/0.png 到 right/5.png。
  for (let index = 0; index < RIGHT_FRAME_COUNT; index++) {
    // 載入目前編號的 right 動畫圖片。
    rightFrames[index] = loadImage("1/right/" + index + ".png");
  }
}

// 建立全螢幕畫布並設定角色初始位置。
function setup() {
  // 建立符合瀏覽器視窗大小的畫布。
  createCanvas(windowWidth, windowHeight);

  // 將圖片繪製基準設定為圖片中心點。
  imageMode(CENTER);

  // 關閉圖片平滑處理以保留像素圖的清晰度。
  noSmooth();

  // 將角色水平中心放在畫布寬度的三分之二位置。
  characterX = width * 2 / 3;

  // 將角色底部貼齊畫布最底端。
  characterY = height - getDisplayHeight() / 2;

  // 依照目前圖片尺寸限制角色不超出畫布。
  keepCharacterInsideCanvas();
}

// 每一幀更新背景、狀態、位置、動畫與圖片。
function draw() {
  // 將背景填滿為指定的米白色。
  background("#f0ebd8");

  // 依照方向鍵優先順序更新目前動畫狀態。
  updateState();

  // 依照目前方向更新角色位置。
  updateMovement();

  // 循環更新目前動畫的影格。
  updateAnimation();

  // 以目前的比例繪製角色圖片。
  drawCharacter();
}

// 依照上、下、左、右的順序判斷目前動畫狀態。
function updateState() {
  // 宣告本次判斷出的新動畫狀態。
  let nextState = "stop";

  // 優先判斷上方向鍵是否被按住。
  if (keyIsDown(UP_ARROW)) {
    // 按住上方向鍵時使用 run 動畫。
    nextState = "run";
  }

  // 只有尚未判定上方向鍵時才判斷下方向鍵。
  else if (keyIsDown(DOWN_ARROW)) {
    // 按住下方向鍵時使用 small 動畫。
    nextState = "small";
  }

  // 只有尚未判定上、下方向鍵時才判斷左方向鍵。
  else if (keyIsDown(LEFT_ARROW)) {
    // 按住左方向鍵時使用 left 動畫。
    nextState = "left";
  }

  // 只有尚未判定其他方向鍵時才判斷右方向鍵。
  else if (keyIsDown(RIGHT_ARROW)) {
    // 按住右方向鍵時使用 right 動畫。
    nextState = "right";
  }

  // 當動畫狀態改變時重新從第零張圖片開始播放。
  if (nextState !== currentState) {
    // 更新目前動畫狀態。
    currentState = nextState;

    // 將新動畫的影格重設為零。
    currentFrame = 0;

    // 將新動畫的計時器重設為零。
    animationTimer = 0;

    // 依照新圖片尺寸重新限制角色位置。
    keepCharacterInsideCanvas();
  }
}

// 依照目前動畫狀態移動角色。
function updateMovement() {
  // 按住上方向鍵時向上移動角色。
  if (currentState === "run") {
    // 減少角色的垂直中心座標。
    characterY -= MOVE_SPEED;
  }

  // 按住下方向鍵時向下移動角色。
  if (currentState === "small") {
    // 增加角色的垂直中心座標。
    characterY += MOVE_SPEED;
  }

  // 按住左方向鍵時向左移動角色。
  if (currentState === "left") {
    // 減少角色的水平中心座標。
    characterX -= MOVE_SPEED;
  }

  // 按住右方向鍵時向右移動角色。
  if (currentState === "right") {
    // 增加角色的水平中心座標。
    characterX += MOVE_SPEED;
  }

  // 將角色限制在畫布範圍內。
  keepCharacterInsideCanvas();
}

// 循環更新目前動畫的影格。
function updateAnimation() {
  // 增加動畫計時器的數值。
  animationTimer++;

  // 當計時器達到換格時間時切換圖片。
  if (animationTimer >= FRAME_DELAY) {
    // 將動畫計時器歸零。
    animationTimer = 0;

    // 播放下一張圖片。
    currentFrame++;

    // 取得目前動畫的影格總數。
    const frameCount = getCurrentFrames().length;

    // 超過最後一張圖片時回到第一張。
    if (currentFrame >= frameCount) {
      // 將動畫影格重設為零。
      currentFrame = 0;
    }
  }
}

// 取得目前狀態所使用的圖片陣列。
function getCurrentFrames() {
  // stop 狀態使用 stop 圖片陣列。
  if (currentState === "stop") {
    // 回傳 stop 動畫圖片陣列。
    return stopFrames;
  }

  // run 狀態使用 run 圖片陣列。
  if (currentState === "run") {
    // 回傳 run 動畫圖片陣列。
    return runFrames;
  }

  // small 狀態使用 small 圖片陣列。
  if (currentState === "small") {
    // 回傳 small 動畫圖片陣列。
    return smallFrames;
  }

  // left 狀態使用 left 圖片陣列。
  if (currentState === "left") {
    // 回傳 left 動畫圖片陣列。
    return leftFrames;
  }

  // 其他情況使用 right 圖片陣列。
  return rightFrames;
}

// 取得目前要繪製的圖片。
function getCurrentImage() {
  // 取得目前狀態的圖片陣列。
  const frames = getCurrentFrames();

  // 取得目前影格的圖片。
  const currentImage = frames[currentFrame];

  // 當目前圖片已載入時回傳目前圖片。
  if (currentImage) {
    // 回傳目前動畫圖片。
    return currentImage;
  }

  // 當目前圖片尚未準備好時回傳第一張圖片。
  return frames[0];
}

// 取得角色圖片在畫布上的顯示高度。
function getDisplayHeight() {
  // 將角色顯示高度設定為畫布高度的三分之一。
  return height / 3;
}

// 依照原始圖片比例取得角色顯示寬度。
function getDisplayWidth() {
  // 取得目前要顯示的圖片。
  const currentImage = getCurrentImage();

  // 當圖片不存在或原始尺寸無效時回傳零。
  if (!currentImage || currentImage.width <= 0 || currentImage.height <= 0) {
    // 回傳零以避免使用無效寬度。
    return 0;
  }

  // 依照原圖寬高比例計算顯示寬度。
  return currentImage.width / currentImage.height * getDisplayHeight();
}

// 將角色限制在畫布的水平與垂直範圍內。
function keepCharacterInsideCanvas() {
  // 取得目前圖片的顯示寬度。
  const displayWidth = getDisplayWidth();

  // 取得目前圖片的顯示高度。
  const displayHeight = getDisplayHeight();

  // 當圖片寬度大於畫布寬度時將角色中心固定在畫布中央。
  if (displayWidth >= width) {
    // 將角色水平中心固定在畫布中央，避免 constrain 的上下界反轉。
    characterX = width / 2;
  }

  // 當圖片寬度小於畫布寬度時限制角色不超出左右邊界。
  else {
    // 以圖片半寬限制角色左側與右側不超出畫布。
    characterX = constrain(characterX, displayWidth / 2, width - displayWidth / 2);
  }

  // 當圖片高度大於畫布高度時將角色中心固定在畫布中央。
  if (displayHeight >= height) {
    // 將角色垂直中心固定在畫布中央，避免 constrain 的上下界反轉。
    characterY = height / 2;
  }

  // 當圖片高度小於畫布高度時限制角色不超出上下邊界。
  else {
    // 以圖片半高限制角色上側與下側不超出畫布。
    characterY = constrain(characterY, displayHeight / 2, height - displayHeight / 2);
  }
}

// 繪製目前動畫的圖片並保持原始寬高比例。
function drawCharacter() {
  // 取得目前要繪製的圖片。
  const currentImage = getCurrentImage();

  // 當圖片尚未載入完成時不進行繪製。
  if (!currentImage || currentImage.width <= 0 || currentImage.height <= 0) {
    // 結束本次繪製函式。
    return;
  }

  // 取得目前圖片依比例計算出的顯示寬度。
  const displayWidth = getDisplayWidth();

  // 取得目前圖片固定的顯示高度。
  const displayHeight = getDisplayHeight();

  // 以角色中心點繪製目前圖片。
  image(currentImage, characterX, characterY, displayWidth, displayHeight);
}

// 當瀏覽器視窗尺寸改變時重新調整畫布與角色位置。
function windowResized() {
  // 將畫布調整為新的瀏覽器視窗大小。
  resizeCanvas(windowWidth, windowHeight);

  // 讓角色在調整後仍依照目前位置保持可見。
  keepCharacterInsideCanvas();
}
