type CourseCategory = 'video' | 'illust' | 'baking';
type TextType =
  | 'creator_name'
  | 'job_title'
  | 'job_creator'
  | 'course_title'
  | 'date_yyyy'
  | 'date_yy';

type ImageType =
  | 'creator'
  | 'thumbnail_cover_mobile'
  | 'thumbnail_cover_pc'
  | 'thumbnail_list'
  | 'thumbnail_product';

type PluginMessage =
  | { type: 'apply-random'; textType: TextType; courseCategory: CourseCategory | null }
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

type CourseInfoItem = {
  courseId?: string;
  creator_name: string;
  job_title: string;
  course_title?: string;
};

const COURSE_INFO_DATA: Record<CourseCategory, CourseInfoItem[]> = {
  video: [
    {
      courseId: 'course-201',
      job_title: '3D 아티스트',
      creator_name: '키무네',
      course_title: '키치한 감각의 아트피스, 블렌더 모델링부터 실물 제작까지'
    },
    {
      courseId: 'course-202',
      job_title: '3D 아티스트',
      creator_name: '김승철',
      course_title: '유니티로 손쉽게 만드는 메타버스: VR Chat 월드와 아바타까지'
    },
    {
      courseId: 'course-203',
      job_title: '3D 아티스트',
      creator_name: '채디',
      course_title: '미드저니와 블렌더로 완성하는 마법같은 3D 캐릭터 연출'
    },
    {
      courseId: 'course-204',
      job_title: '3D 아티스트',
      creator_name: 'Yorsh',
      course_title: '블렌더로 완성하는 스타일라이즈드 3D 아트 씬 제작 노하우'
    },
    {
      courseId: 'course-205',
      job_title: '모션그래픽디자이너',
      creator_name: '신승섭',
      course_title: '극강의 작업 효율을 위한 Ae 익스프레션 입문'
    },
    {
      courseId: 'course-206',
      job_title: '모션그래픽디자이너',
      creator_name: 'MANZA',
      course_title: '애프터 이펙트를 활용한 방송 타이틀 패키지 제작 프로세스'
    },
    {
      courseId: 'course-207',
      job_title: '모션그래픽디자이너',
      creator_name: '김지수',
      course_title: '2D와 3D의 경계를 뛰어넘는 블렌더 모션그래픽 포트폴리오 완성'
    },
    {
      courseId: 'course-208',
      job_title: '모션그래픽디자이너',
      creator_name: '이재연',
      course_title: '옥테인을 활용한 간단하면서 수준 높은 텍스처링 & 라이팅'
    },
    {
      courseId: 'course-209',
      job_title: '애니메이터',
      creator_name: 'Owen Kim',
      course_title: '장비나 촬영 없이 쉽게 만드는 AAA급 인게임&시네마틱 애니메이션'
    },
    {
      courseId: 'course-210',
      job_title: '애니메이터',
      creator_name: '유은',
      course_title: '나만의 캐릭터로 만드는 쫄깃한 2D 애니메이션'
    },
    {
      courseId: 'course-211',
      job_title: '애니메이터',
      creator_name: '파닭',
      course_title: '구독자 팬덤을 끌어모으는 고효율 1인 애니메이션 완성 파이프라인'
    },
    {
      courseId: 'course-212',
      job_title: '애니메이터',
      creator_name: '조약돌',
      course_title: '한 컷의 임팩트를 극대화하는 액션 애니메이션 연출 입문'
    },
    {
      courseId: 'course-213',
      job_title: '3D 모션그래픽 디자이너',
      creator_name: '장혜진',
      course_title: '모션그래퍼의 경쟁력을 키우는 차별화된 C4D 애니메이션 훈련법'
    },
    {
      courseId: 'course-214',
      job_title: 'CG 아티스트',
      creator_name: '이동영',
      course_title: '청량한 빛과 색을 담아내는 1인 3D 애니메이션 제작 가이드'
    },
    {
      courseId: 'course-215',
      job_title: '3D CG 모델러',
      creator_name: 'Lorde',
      course_title: '입문부터 에셋 수익화까지, 돋보이는 3D 버츄얼 의상 모델링'
    },
    {
      courseId: 'course-216',
      job_title: '2D 애니메이터',
      creator_name: '윤성원',
      course_title: '장삐쭈 스튜디오 윤성원에게 배우는 MOHO 애니메이션 액팅 입문'
    },
    {
      courseId: 'course-217',
      job_title: '2D 애니메이터',
      creator_name: '감자만세',
      course_title: '1년 만에 감독 데뷔까지, 100강으로 완성하는 애니메이션 제작 올인원'
    }
  ],
  illust: [
    {
      courseId: 'course-101',
      job_title: '일러스트레이터',
      creator_name: '웅돼지',
      course_title: '남캐&여캐를 한 번에 정복하는 매력 폭발 실전 일러스트 독학법'
    },
    {
      courseId: 'course-102',
      job_title: '일러스트레이터',
      creator_name: '샤가무',
      course_title: '실전에 강한 해법 중심 일러스트 독학 솔루션'
    },
    {
      courseId: 'course-103',
      job_title: '일러스트레이터',
      creator_name: 'Mark.J',
      course_title: '취미부터 실무까지 인체 크로키 마스터'
    },
    {
      courseId: 'course-104',
      job_title: '일러스트레이터',
      creator_name: '초연',
      course_title: '매혹적인 데포르메&연출로 만드는 인기 캐릭터 일러스트'
    },
    {
      courseId: 'course-105',
      job_title: '일러스트레이터',
      creator_name: 'M1Z',
      course_title: '과감한 투시와 정교한 손맛으로 완성하는 풀 배경 일러스트'
    },
    {
      courseId: 'course-106',
      job_title: '일러스트레이터',
      creator_name: '소금이',
      course_title: '아이패드로 완성하는 동화 같은 캐릭터와 일러스트'
    },
    {
      courseId: 'course-107',
      job_title: '일러스트레이터',
      creator_name: '시와',
      course_title: '심플한 인체 해석으로 완성, 무너지지 않는 선화와 채색'
    },
    {
      courseId: 'course-108',
      job_title: 'Live2D일러스트레이터',
      creator_name: 'Kiru',
      course_title: '포토샵과 Live2D로 완성하는 몽글몽글한 버튜버 디자인'
    },
    {
      courseId: 'course-109',
      job_title: '3D일러스트레이터',
      creator_name: 'Smiley Jo',
      course_title: '3D 일러스트 입문자들을 위한 C4D & 랜더링 핵심 공략서'
    },
    {
      courseId: 'course-110',
      job_title: '일러스트레이터',
      creator_name: '띵구',
      course_title: '배경과 캐릭터가 맑고 선명하게 살아나는 수분화 색감 설계 가이드'
    },
    {
      courseId: 'course-111',
      job_title: '웹툰 작가',
      creator_name: '용사',
      course_title: '스케치업, 고퀄리티 웹툰 제작의 비밀'
    },
    {
      courseId: 'course-112',
      job_title: '웹툰 작가',
      creator_name: '홍작가',
      course_title: '웹툰의 분위기를 압도하는 임팩트 컷 연출과 작화'
    },
    {
      courseId: 'course-113',
      job_title: '웹툰 작가',
      creator_name: '영모',
      course_title: '한눈에 꽂히는 캐릭터와 선의 강약으로 완성하는 웹툰 작화'
    },
    {
      courseId: 'course-114',
      job_title: '컨셉 아티스트',
      creator_name: 'Okku',
      course_title: '세련되고 감각적인 캐릭터 디자인과 일러스트 응용법'
    },
    {
      courseId: 'course-115',
      job_title: '컨셉 아티스트',
      creator_name: '케토',
      course_title: '탄탄한 세계관으로 완성하는 개성 있는 캐릭터 디자인'
    },
    {
      courseId: 'course-116',
      job_title: '컨셉 아티스트',
      creator_name: '소융',
      course_title: '내 그림으로 수익 실현까지, 프로 데뷔를 위한 외주&포폴 가이드'
    }
  ],
  baking: [
    {
      courseId: 'course-301',
      job_title: '파티셰',
      creator_name: '최유정',
      course_title: '여름 매출 치트키, 쿰베오의 시그니처 빙수&디저트 30종'
    },
    {
      courseId: 'course-302',
      job_title: '파티셰',
      creator_name: '최지혜',
      course_title: '사계절 라인업 완성, 1인 매장 최적화 케이크 17종 클래스'
    },
    {
      courseId: 'course-303',
      job_title: '파티셰',
      creator_name: '장효비',
      course_title: '누적 판매 10만 개, 한알의 인생 에그타르트와 스테디셀러 레시피북'
    },
    {
      courseId: 'course-304',
      job_title: '파티셰',
      creator_name: '제로',
      course_title: '화제성과 생산성을 동시에! SNS에서 주목받는 제로의 시그니처 20종'
    },
    {
      courseId: 'course-305',
      job_title: '파티셰',
      creator_name: '고나훈',
      course_title: '재료와 배합으로 완성하는 KONA의 특별한 구움과자 레시피북'
    },
    {
      courseId: 'course-306',
      job_title: '베이커',
      creator_name: '최은영',
      course_title: "초이고야'의 5가지 반죽으로 만드는 빵"
    },
    {
      courseId: 'course-307',
      job_title: '베이커',
      creator_name: '신민경',
      course_title: '누구나 쉽게 따라하는 미미숲의 트렌디 모던 비에누아즈리 28종'
    },
    {
      courseId: 'course-308',
      job_title: '베이커',
      creator_name: '이준희',
      course_title: '잠실 빵 맛집 밀빛의 시그니처 식빵과 쫀득빵&맘모스 23종'
    },
    {
      courseId: 'course-309',
      job_title: '베이커',
      creator_name: '홍상기',
      course_title: '베이커리와 브런치 카페를 위한 조리빵&샌드위치'
    },
    {
      courseId: 'course-310',
      job_title: '베이커',
      creator_name: '박혜령',
      course_title: '전국구 베이글 맛집 훕훕베이글의 시그니처 레시피 19종'
    },
    {
      courseId: 'course-311',
      job_title: '카페 파이브 대표',
      creator_name: '김다나',
      course_title: '월 매출 4천, 카페 파이프의 실전 판매 케이크&구움과자 21종'
    },
    {
      courseId: 'course-312',
      job_title: '밀 카페',
      creator_name: '바통',
      course_title: '용리단길 블루리본 맛집 바통의 시그니처 브런치 레시피 41종'
    },
    {
      courseId: 'course-313',
      job_title: '노버든 대표',
      creator_name: '박웅종',
      course_title: '매달 7백 개씩 팔리는 노버든 바스크치즈케이크&떠먹케 레시피북'
    },
    {
      courseId: 'course-314',
      job_title: '문스타케이크 대표',
      creator_name: '이지민',
      course_title: '1인 공방 최적화, 상시판매 한식 디저트 & 고단가 케이크 50종'
    },
    {
      courseId: 'course-315',
      job_title: '아일 대표',
      creator_name: '김지현',
      course_title: '1시간에 100개 완성, 아일의 컵케이크&파운드&케이크 25종'
    }
  ]
};

const TEXT_TYPE_LABELS: Record<TextType, string> = {
  creator_name: '연사명',
  job_title: '직업명',
  job_creator: '직업명 + 연사명',
  course_title: '코스 타이틀',
  date_yyyy: '날짜형 YYYY.MM.DD',
  date_yy: '날짜형 YY.MM.DD'
};

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
      await applyTextData(message.textType, message.courseCategory);
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

async function applyTextData(textType: TextType, courseCategory: CourseCategory | null) {
  const selectedTextNodes = getSelectedTextNodes();

  if (selectedTextNodes.length === 0) {
    showToast('텍스트 레이어를 1개 이상 선택해 주세요.');
    return;
  }

  if (isCourseInfoType(textType) && !courseCategory) {
    showToast('코스 정보 타입은 코스 카테고리를 먼저 선택해 주세요.');
    return;
  }

  const values = getTextValues(textType, courseCategory);
  if (!values || values.length === 0) {
    showToast('선택한 데이터 유형에 사용할 값이 없어요.');
    return;
  }

  for (const selectedTextNode of selectedTextNodes) {
    const nextValue = getRandomValue(values);
    await loadFonts(selectedTextNode);
    selectedTextNode.characters = nextValue;
  }

  showToast(
    TEXT_TYPE_LABELS[textType] +
      ' 데이터가 ' +
      String(selectedTextNodes.length) +
      '개 텍스트 레이어에 적용됐어요.'
  );
}

function isCourseInfoType(textType: TextType) {
  return (
    textType === 'creator_name' ||
    textType === 'job_title' ||
    textType === 'job_creator' ||
    textType === 'course_title'
  );
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

function getTextValues(textType: TextType, courseCategory: CourseCategory | null) {
  if (textType === 'date_yyyy' || textType === 'date_yy') {
    return createDateRangeValues(textType);
  }

  if (!courseCategory) {
    return null;
  }

  const rows = COURSE_INFO_DATA[courseCategory];

  if (textType === 'creator_name') {
    return rows.map((item) => item.creator_name);
  }

  if (textType === 'job_title') {
    return rows.map((item) => item.job_title);
  }

  if (textType === 'job_creator') {
    return rows.map((item) => item.job_title + ' ' + item.creator_name);
  }

  return rows
    .map((item) => item.course_title || '')
    .filter((value) => value.length > 0);
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
