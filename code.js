var NOTIFY_TIMEOUT = 800;
var activeImageRequestId = 0;
var imageLoadingNotification = null;

figma.showUI(__html__, {
  width: 320,
  height: 520,
  themeColors: true
});

figma.ui.onmessage = async function (message) {
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
        var appliedCount = await applyImageData(
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
        var messageText = error && error.message ? error.message : '알 수 없는 오류';
        showToast('데이터 적용 오류: ' + messageText);
        postImageApplyState(message.requestId, 'error');
      }
      return;
    }
  } catch (error) {
    console.error(error);
    var messageText = error && error.message ? error.message : '알 수 없는 오류';
    showToast('데이터 적용 오류: ' + messageText);
  }
};

async function applyTextData(values, successLabel) {
  var selectedTextNodes = getSelectedTextNodes();

  if (selectedTextNodes.length === 0) {
    showToast('텍스트 레이어를 1개 이상 선택해 주세요.');
    return;
  }

  if (!values || values.length === 0) {
    showToast('선택한 데이터 유형에 사용할 값이 없어요.');
    return;
  }

  for (var i = 0; i < selectedTextNodes.length; i += 1) {
    var selectedTextNode = selectedTextNodes[i];
    var nextValue = getRandomValue(values);
    await loadFonts(selectedTextNode);
    selectedTextNode.characters = nextValue;
  }

  showToast(successLabel + ' 데이터가 ' + String(selectedTextNodes.length) + '개 텍스트 레이어에 적용됐어요.');
}

function getSelectedTextNodes() {
  var selection = figma.currentPage.selection;
  var textNodes = [];

  for (var i = 0; i < selection.length; i += 1) {
    var selectedNode = selection[i];
    if (selectedNode.type === 'TEXT') {
      textNodes.push(selectedNode);
    }
  }

  return textNodes;
}

function getRandomValue(values) {
  var randomIndex = Math.floor(Math.random() * values.length);
  return values[randomIndex];
}

function createDateRangeValues(textType) {
  var startDate = getTodayDate();
  var endDate = new Date(startDate.getTime());
  endDate.setMonth(endDate.getMonth() + 3);

  var dates = [];
  var currentDate = new Date(startDate.getTime());

  while (currentDate.getTime() <= endDate.getTime()) {
    dates.push(formatDate(currentDate, textType));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

function getTodayDate() {
  var now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0, 0);
}

function formatDate(date, textType) {
  var year = date.getFullYear();
  var shortYear = String(year).slice(-2);
  var month = padNumber(date.getMonth() + 1);
  var day = padNumber(date.getDate());

  if (textType === 'date_yy') {
    return shortYear + '.' + month + '.' + day;
  }

  return String(year) + '.' + month + '.' + day;
}

function padNumber(value) {
  if (value < 10) {
    return '0' + String(value);
  }

  return String(value);
}

function showToast(message) {
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

function postImageApplyState(requestId, status) {
  figma.ui.postMessage({
    type: 'image-apply-state',
    requestId: requestId,
    status: status
  });
}

async function applyImageData(requestId, imageType, imageCategory, imageAssets) {
  var selectedImageNodes = getSelectedImageNodes();

  if (selectedImageNodes.length === 0) {
    throw new Error('이미지를 적용할 레이어를 1개 이상 선택해 주세요.');
  }

  if (!imageAssets || imageAssets.length === 0) {
    throw new Error('적용할 이미지 데이터가 없어요.');
  }
  var paintCache = {};

  for (var i = 0; i < selectedImageNodes.length; i += 1) {
    if (requestId !== activeImageRequestId) {
      return 0;
    }

    var selectedImageNode = selectedImageNodes[i];
    var imageAsset = imageAssets[Math.floor(Math.random() * imageAssets.length)];
    var imageUrl = imageAsset.url;

    if (!paintCache[imageUrl]) {
      try {
        var bytes =
          imageAsset.bytes instanceof Uint8Array ? imageAsset.bytes : new Uint8Array(imageAsset.bytes);

        if (bytes.byteLength === 0) {
          throw new Error('이미지 바이트가 비어 있어요.');
        }

        var image = figma.createImage(bytes);
        paintCache[imageUrl] = {
          type: 'IMAGE',
          imageHash: image.hash,
          scaleMode: 'FILL'
        };
      } catch (error) {
        var errorMessage = error && error.message ? error.message : '알 수 없는 오류';
        throw new Error('이미지 에셋 생성 실패: ' + imageUrl + ' / ' + errorMessage);
      }
    }

    selectedImageNode.fills = [paintCache[imageUrl]];
  }

  return selectedImageNodes.length;
}

function getSelectedImageNodes() {
  var selection = figma.currentPage.selection;
  var imageNodes = [];

  for (var i = 0; i < selection.length; i += 1) {
    var selectedNode = selection[i];
    if (isImageFillTarget(selectedNode)) {
      imageNodes.push(selectedNode);
    }
  }

  return imageNodes;
}

function isImageFillTarget(node) {
  if (node.type === 'TEXT' || node.type === 'GROUP' || node.type === 'SLICE') {
    return false;
  }

  return 'fills' in node;
}

async function loadFonts(node) {
  if (node.fontName === figma.mixed) {
    var segments = node.getStyledTextSegments(['fontName']);
    var loadedFonts = {};

    for (var i = 0; i < segments.length; i += 1) {
      var font = segments[i].fontName;
      var fontKey = font.family + '::' + font.style;
      if (!loadedFonts[fontKey]) {
        await figma.loadFontAsync(font);
        loadedFonts[fontKey] = true;
      }
    }

    return;
  }

  await figma.loadFontAsync(node.fontName);
}
