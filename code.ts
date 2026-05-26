type PluginMessage =
  | { type: "apply-random"; values: string[]; successLabel: string }
  | {
      type: "apply-image-random";
      successLabel: string;
      imageAssets: Array<{
        name: string;
        bytes: Uint8Array;
      }>;
    }
  | { type: "show-toast"; message: string }
  | { type: "request-selection-state" }
  | { type: "close" };

type FillableNode = SceneNode & MinimalFillsMixin;

const NOTIFY_TIMEOUT = 800;

figma.showUI(__html__, {
  width: 320,
  height: 480,
  themeColors: true
});

figma.ui.onmessage = async (message: PluginMessage) => {
  try {
    if (message.type === "apply-random") {
      await applyTextData(message.values, message.successLabel);
      return;
    }

    if (message.type === "apply-image-random") {
      await applyImageData(message.imageAssets, message.successLabel);
      return;
    }

    if (message.type === "request-selection-state") {
      postSelectionState();
      return;
    }

    if (message.type === "show-toast") {
      showToast(message.message);
      return;
    }

    if (message.type === "close") {
      figma.closePlugin();
    }
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "알 수 없는 오류";
    showToast("데이터 적용 오류: " + errorMessage);
  }
};

async function applyTextData(values: string[], successLabel: string) {
  const selectedTextNodes = getSelectedTextNodes();

  if (selectedTextNodes.length === 0) {
    showToast("텍스트 레이어를 1개 이상 선택해 주세요.");
    return;
  }

  if (!values || values.length === 0) {
    showToast("선택한 데이터 유형에 사용할 값이 없어요.");
    return;
  }

  for (const selectedTextNode of selectedTextNodes) {
    const nextValue = getRandomValue(values);
    await loadFonts(selectedTextNode);
    selectedTextNode.characters = nextValue;
  }

  showToast(
    successLabel + " 데이터가 " + String(selectedTextNodes.length) + "개 텍스트 레이어에 적용됐어요."
  );
}

async function applyImageData(
  imageAssets: Array<{
    name: string;
    bytes: Uint8Array;
  }>,
  successLabel: string
) {
  const selectedImageNodes = getSelectedImageNodes();

  if (selectedImageNodes.length === 0) {
    showToast("이미지를 적용할 레이어를 1개 이상 선택해 주세요.");
    return;
  }

  if (!imageAssets || imageAssets.length === 0) {
    showToast("선택한 데이터 유형에 사용할 이미지가 없어요.");
    return;
  }

  const paintCache: Record<string, ImagePaint> = {};

  for (const selectedImageNode of selectedImageNodes) {
    const imageAsset = getRandomValue(imageAssets);

    if (!paintCache[imageAsset.name]) {
      const bytes =
        imageAsset.bytes instanceof Uint8Array
          ? imageAsset.bytes
          : new Uint8Array(imageAsset.bytes);

      if (bytes.byteLength === 0) {
        throw new Error("이미지 바이트가 비어 있어요.");
      }

      const image = figma.createImage(bytes);
      paintCache[imageAsset.name] = {
        type: "IMAGE",
        imageHash: image.hash,
        scaleMode: "FILL"
      };
    }

    selectedImageNode.fills = [paintCache[imageAsset.name]];
  }

  showToast(
    successLabel + " 데이터가 " + String(selectedImageNodes.length) + "개 이미지 레이어에 적용됐어요."
  );
}

function getSelectedTextNodes() {
  const selection = figma.currentPage.selection;
  const textNodes: TextNode[] = [];

  for (const selectedNode of selection) {
    if (selectedNode.type === "TEXT") {
      textNodes.push(selectedNode);
    }
  }

  return textNodes;
}

function getSelectedImageNodes() {
  const selection = figma.currentPage.selection;
  const imageNodes: FillableNode[] = [];

  for (const selectedNode of selection) {
    if (isImageFillTarget(selectedNode)) {
      imageNodes.push(selectedNode);
    }
  }

  return imageNodes;
}

function isImageFillTarget(node: SceneNode): node is FillableNode {
  if (node.type === "TEXT" || node.type === "GROUP" || node.type === "SLICE") {
    return false;
  }

  return "fills" in node;
}

function getRandomValue<T>(values: T[]) {
  const randomIndex = Math.floor(Math.random() * values.length);
  return values[randomIndex];
}

function showToast(message: string) {
  figma.notify(message, { timeout: NOTIFY_TIMEOUT });
}

function postSelectionState() {
  figma.ui.postMessage({
    type: "selection-state",
    imageCount: getSelectedImageNodes().length,
    textCount: getSelectedTextNodes().length
  });
}

async function loadFonts(node: TextNode) {
  if (node.fontName === figma.mixed) {
    const segments = node.getStyledTextSegments(["fontName"]);
    const loadedFonts: Record<string, boolean> = {};

    for (const segment of segments) {
      const font = segment.fontName as FontName;
      const fontKey = font.family + "::" + font.style;

      if (!loadedFonts[fontKey]) {
        await figma.loadFontAsync(font);
        loadedFonts[fontKey] = true;
      }
    }

    return;
  }

  await figma.loadFontAsync(node.fontName as FontName);
}

figma.on("selectionchange", () => {
  postSelectionState();
});

postSelectionState();
