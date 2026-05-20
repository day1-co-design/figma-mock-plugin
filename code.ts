type CourseCategory = 'video' | 'illust' | 'baking';
type ImageType =
  | 'creator'
  | 'thumbnail_cover_mobile'
  | 'thumbnail_cover_pc'
  | 'thumbnail_list'
  | 'thumbnail_product';

type PluginMessage =
  | { type: 'apply-random'; values: string[]; successLabel: string }
  | { type: 'show-toast'; message: string }
  | { type: 'image-apply-start'; requestId: number }
  | { type: 'image-apply-prep-error'; requestId: number; message: string }
  | {
      type: 'apply-image-random';
      requestId: number;
      imageType: ImageType;
      imageCategory: CourseCategory;
      imageAssets: Array<{
        url: string;
        bytes: Uint8Array;
      }>;
    }
  | { type: 'close' };

const NOTIFY_TIMEOUT = 800;
let activeImageRequestId = 0;
let imageLoadingNotification: NotificationHandler | null = null;

figma.showUI(__html__, {
  width: 320,
  height: 520,
  themeColors: true
});

figma.ui.onmessage = async (message: PluginMessage) => {
  try {
    if (message.type === 'close') {
      figma.closePlugin();
      return;
    }

    if (message.type === 'apply-random') {
      await applyTextData(message.values, message.successLabel);
      return;
    }

    if (message.type === 'show-toast') {
      showToast(message.message);
      return;
    }

    if (message.type === 'image-apply-start') {
      activeImageRequestId = message.requestId;
      replaceImageLoadingToast();
      return;
    }

    if (message.type === 'image-apply-prep-error') {
      if (message.requestId !== activeImageRequestId) {
        return;
      }

      clearImageLoadingToast();
      showToast('이미지 준비 단계 오류: ' + message.message);
      postImageApplyState(message.requestId, 'error');
      return;
    }

    if (message.type === 'apply-image-random') {
      try {
        const appliedCount = await applyImageData(
          message.requestId,
          message.imageType,
          message.imageCategory,
          message.imageAssets
        );

        if (message.requestId !== activeImageRequestId) {
          return;
        }

        clearImageLoadingToast();
        showToast('이미지가 ' + String(appliedCount) + '개 레이어에 적용됐어요.');
        postImageApplyState(message.requestId, 'complete');
      } catch (error) {
        if (message.requestId !== activeImageRequestId) {
          return;
        }

        clearImageLoadingToast();
        const messageText = error instanceof Error ? error.message : '알 수 없는 오류';
        showToast('데이터 적용 오류: ' + messageText);
        postImageApplyState(message.requestId, 'error');
      }
      return;
    }
  } catch (error) {
    console.error(error);
    const messageText = error instanceof Error ? error.message : '알 수 없는 오류';
    showToast('데이터 적용 오류: ' + messageText);
  }
};

async function applyTextData(values: string[], successLabel: string) {
  const selectedTextNodes = getSelectedTextNodes();

  if (selectedTextNodes.length === 0) {
    showToast('텍스트 레이어를 1개 이상 선택해 주세요.');
    return;
  }

  if (!values || values.length === 0) {
    showToast('선택한 데이터 유형에 사용할 값이 없어요.');
    return;
  }

  for (const selectedTextNode of selectedTextNodes) {
    const nextValue = getRandomValue(values);
    await loadFonts(selectedTextNode);
    selectedTextNode.characters = nextValue;
  }

  showToast(successLabel + ' 데이터가 ' + String(selectedTextNodes.length) + '개 텍스트 레이어에 적용됐어요.');
}

function getSelectedTextNodes() {
  const selection = figma.currentPage.selection;
  const textNodes: TextNode[] = [];

  for (const selectedNode of selection) {
    if (selectedNode.type === 'TEXT') {
      textNodes.push(selectedNode);
    }
  }

  return textNodes;
}

function getRandomValue(values: string[]) {
  const randomIndex = Math.floor(Math.random() * values.length);
  return values[randomIndex];
}

function createDateRangeValues(textType: 'date_yyyy' | 'date_yy') {
  const startDate = getTodayDate();
  const endDate = new Date(startDate.getTime());
  endDate.setMonth(endDate.getMonth() + 3);

  const dates: string[] = [];
  const currentDate = new Date(startDate.getTime());

  while (currentDate.getTime() <= endDate.getTime()) {
    dates.push(formatDate(currentDate, textType));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

function getTodayDate() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0, 0);
}

function formatDate(date: Date, textType: 'date_yyyy' | 'date_yy') {
  const year = date.getFullYear();
  const shortYear = String(year).slice(-2);
  const month = padNumber(date.getMonth() + 1);
  const day = padNumber(date.getDate());

  if (textType === 'date_yy') {
    return shortYear + '.' + month + '.' + day;
  }

  return String(year) + '.' + month + '.' + day;
}

function padNumber(value: number) {
  if (value < 10) {
    return '0' + String(value);
  }

  return String(value);
}

function showToast(message: string) {
  figma.notify(message, { timeout: NOTIFY_TIMEOUT });
}

function replaceImageLoadingToast() {
  clearImageLoadingToast();
  imageLoadingNotification = figma.notify('이미지 불러오는 중이에요.', { timeout: Infinity });
}

function clearImageLoadingToast() {
  if (imageLoadingNotification) {
    imageLoadingNotification.cancel();
    imageLoadingNotification = null;
  }
}

function postImageApplyState(requestId: number, status: 'complete' | 'error') {
  figma.ui.postMessage({
    type: 'image-apply-state',
    requestId: requestId,
    status: status
  });
}

async function applyImageData(
  requestId: number,
  imageType: ImageType,
  imageCategory: CourseCategory,
  imageAssets: Array<{
    url: string;
    bytes: Uint8Array;
  }>
) {
  const selectedImageNodes = getSelectedImageNodes();

  if (selectedImageNodes.length === 0) {
    throw new Error('이미지를 적용할 레이어를 1개 이상 선택해 주세요.');
  }

  if (!imageAssets || imageAssets.length === 0) {
    throw new Error('적용할 이미지 데이터가 없어요.');
  }
  const paintCache: Record<string, ImagePaint> = {};

  for (const selectedImageNode of selectedImageNodes) {
    if (requestId !== activeImageRequestId) {
      return 0;
    }

    const imageAsset = imageAssets[Math.floor(Math.random() * imageAssets.length)];
    const imageUrl = imageAsset.url;

    if (!paintCache[imageUrl]) {
      try {
        const bytes =
          imageAsset.bytes instanceof Uint8Array
            ? imageAsset.bytes
            : new Uint8Array(imageAsset.bytes);

        if (bytes.byteLength === 0) {
          throw new Error('이미지 바이트가 비어 있어요.');
        }

        const image = figma.createImage(bytes);
        paintCache[imageUrl] = {
          type: 'IMAGE',
          imageHash: image.hash,
          scaleMode: 'FILL'
        } as ImagePaint;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
        throw new Error('이미지 에셋 생성 실패: ' + imageUrl + ' / ' + errorMessage);
      }
    }

    selectedImageNode.fills = [paintCache[imageUrl]];
  }

  return selectedImageNodes.length;
}

function getSelectedImageNodes() {
  const selection = figma.currentPage.selection;
  const imageNodes: Array<SceneNode & MinimalFillsMixin> = [];

  for (const selectedNode of selection) {
    if (isImageFillTarget(selectedNode)) {
      imageNodes.push(selectedNode);
    }
  }

  return imageNodes;
}

function isImageFillTarget(node: SceneNode): node is SceneNode & MinimalFillsMixin {
  if (node.type === 'TEXT' || node.type === 'GROUP' || node.type === 'SLICE') {
    return false;
  }

  return 'fills' in node;
}

async function loadFonts(node: TextNode) {
  if (node.fontName === figma.mixed) {
    const segments = node.getStyledTextSegments(['fontName']);
    const loadedFonts: Record<string, boolean> = {};

    for (const segment of segments) {
      const font = segment.fontName as FontName;
      const fontKey = font.family + '::' + font.style;
      if (!loadedFonts[fontKey]) {
        await figma.loadFontAsync(font);
        loadedFonts[fontKey] = true;
      }
    }

    return;
  }

  await figma.loadFontAsync(node.fontName as FontName);
}
