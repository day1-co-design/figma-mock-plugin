# Coloso Mock Data Plugin

## 1. 프로젝트 개요
Coloso Mock Data Plugin은 디자이너가 Figma에서 목업 제작에 필요한 텍스트와 이미지를 선택한 레이어에 빠르게 주입할 수 있도록 돕는 플러그인이다.

현재 구현은 복잡한 컴포넌트 자동 매핑보다 실무 속도에 초점을 둔다. 사용자는 데이터 종류, 데이터 유형, 카테고리를 고른 뒤 Figma에서 선택한 텍스트 레이어 또는 이미지 fill 적용 가능 레이어에 랜덤 데이터를 적용한다.

## 2. 목표
- 반복적인 목업 데이터 입력 작업을 줄인다.
- 프로필/클래스 맥락에 맞춰 텍스트와 이미지를 분리해 적용한다.
- 외부 JSON과 이미지 asset만 갱신해도 플러그인 데이터가 업데이트되도록 한다.
- 여러 Figma 파일에서 같은 데이터 소스를 안정적으로 공유한다.

## 3. 대상 사용자
- Coloso 디자인팀 디자이너
- 크리에이터/강의 목업 데이터를 반복 적용하는 작업자
- Figma 플러그인을 팀 단위로 운영하려는 사용자

## 4. 현재 플러그인 구조
### 4.1 화면 구조
- 플러그인 크기: `320 x 480`
- 상단 탭: `프로필`, `클래스`
- 공통 입력 영역:
  - `데이터 종류`
  - `데이터 유형 선택`
  - `카테고리 선택`
- 하단 footer:
  - 선택 레이어 안내 문구
  - 적용 버튼

### 4.2 데이터 종류
`프로필` 탭:
- `아바타`: 이미지 데이터
- `크리에이터 정보`: 텍스트 데이터

`클래스` 탭:
- `코스 이미지`: 이미지 데이터
- `강의 정보`: 텍스트 데이터

### 4.3 데이터 유형
`프로필 > 아바타`:
- 데이터 유형 선택 영역을 숨긴다.
- 프로필 이미지 데이터셋을 사용한다.

`프로필 > 크리에이터 정보`:
- `creator_name`: 크리에이터명
- `job_creator`: 직업 + 크리에이터명
- `job_title`: 직업명

`클래스 > 코스 이미지`:
- `thumbnail_list`: 코스 카드 썸네일
- `thumbnail_product`: 상품 썸네일(1:1)
- `thumbnail_cover_pc`: 상세페이지 커버 - PC
- `thumbnail_cover_mobile`: 상세페이지 커버 - Mobile

`클래스 > 강의 정보`:
- `course_title`: 강의 제목
- 현재 UI에서는 단일 텍스트 유형이므로 select trigger는 disabled 상태로 표시한다.

### 4.4 카테고리
카테고리 select 옵션:
- `all`: 전체
- `illust`: 드로잉
- `video`: 영상 디자인
- `baking`: 베이킹

`전체` 선택 시 `illust`, `video`, `baking` 데이터를 합쳐 랜덤 pool로 사용한다.

## 5. 핵심 사용자 시나리오
### 5.1 프로필 아바타 적용
1. 사용자가 Figma에서 이미지 fill 적용 가능 레이어를 1개 이상 선택한다.
2. `프로필` 탭에서 `아바타`를 선택한다.
3. 카테고리를 선택한다.
4. `선택한 N 이미지 레이어에 적용` 버튼을 누른다.
5. 선택한 카테고리의 프로필 이미지가 레이어별로 랜덤 적용된다.

### 5.2 프로필 텍스트 적용
1. 사용자가 Figma에서 텍스트 레이어를 1개 이상 선택한다.
2. `프로필` 탭에서 `크리에이터 정보`를 선택한다.
3. 데이터 유형과 카테고리를 선택한다.
4. `선택한 N 텍스트 레이어에 적용` 버튼을 누른다.
5. 선택한 텍스트 데이터가 레이어별로 랜덤 적용된다.

### 5.3 클래스 이미지 적용
1. 사용자가 Figma에서 이미지 fill 적용 가능 레이어를 1개 이상 선택한다.
2. `클래스` 탭에서 `코스 이미지`를 선택한다.
3. 썸네일 유형과 카테고리를 선택한다.
4. 적용 버튼을 누른다.
5. 선택한 썸네일 variant가 레이어별로 랜덤 적용된다.

### 5.4 클래스 텍스트 적용
1. 사용자가 Figma에서 텍스트 레이어를 1개 이상 선택한다.
2. `클래스` 탭에서 `강의 정보`를 선택한다.
3. 카테고리를 선택한다.
4. 적용 버튼을 누른다.
5. 선택한 카테고리의 강의 제목이 레이어별로 랜덤 적용된다.

## 6. 선택 레이어 상태 규칙
- Figma selection 상태는 `selectionchange` 이벤트와 `request-selection-state` 메시지로 UI에 전달한다.
- UI는 `imageCount`, `textCount`를 분리해 가진다.
- 현재 데이터 종류가 이미지 데이터면 `imageCount`를 기준으로 버튼과 안내 문구를 판단한다.
- 현재 데이터 종류가 텍스트 데이터면 `textCount`를 기준으로 버튼과 안내 문구를 판단한다.
- 현재 데이터 종류에 맞는 레이어가 1개 이상 선택되면 안내 문구는 영역까지 접혀 사라진다.
- 현재 데이터 종류에 맞는 레이어가 없으면 footer에 다음 문구를 표시한다.
  - 이미지 데이터: `적용할 이미지 레이어를 선택하세요`
  - 텍스트 데이터: `적용할 텍스트 레이어를 선택하세요`

## 7. 적용 버튼 상태
- 데이터 로드 중 또는 적용 중: disabled, `불러오는 중...`
- 데이터 로드 실패: disabled, `데이터 로드 실패`
- 현재 데이터 종류에 맞는 레이어 미선택: disabled, `선택된 레이어 없음`
- 적용 가능한 데이터와 레이어가 있음:
  - 이미지: `선택한 N 이미지 레이어에 적용`
  - 텍스트: `선택한 N 텍스트 레이어에 적용`
- 선택한 카테고리/유형에 사용할 값이 없으면 버튼은 disabled 상태가 된다.

## 8. UI 컴포넌트 기준
### 8.1 데이터 종류 칩
- 선택된 칩은 red border/background/text를 사용한다.
- 선택된 칩에는 15px SVG check icon을 표시한다.
- 칩 스타일은 공통 `.chip` 컴포넌트에 반영해 전체 데이터 종류 버튼에 동일하게 적용한다.

### 8.2 Select
- select trigger와 dropdown은 공통 `renderSelect` 함수로 생성한다.
- trigger radius는 `12px`이다.
- chevron은 18px SVG 아이콘을 사용하며 open 상태에서 180도 회전한다.
- dropdown은 trigger와 `4px` 간격을 둔다.
- dropdown padding은 `6px 8px`, item gap은 `2px`이다.
- dropdown item hover는 `#f4f4f5` 배경과 `4px` radius를 사용한다.
- 선택된 item은 18px SVG check icon을 표시한다.

### 8.3 Footer
- footer 상단 고정 line은 사용하지 않는다.
- 내부 콘텐츠가 길어져 `.scroll-area`에 스크롤이 생기면 footer에 `0 -5px 10px 0 rgba(0, 0, 0, 0.05)` shadow를 표시한다.
- 안내 문구가 숨겨질 때는 공간도 함께 사라져 footer 높이가 자연스럽게 줄어든다.

## 9. 데이터 요구사항
### 9.1 텍스트 데이터
파일:
- `data/text-course-info.json`

구조:
```json
{
  "baking": [
    {
      "courseId": "course-301",
      "creator_name": "최유정",
      "job_title": "파티셰",
      "course_title": "..."
    }
  ]
}
```

필드:
- `courseId`: 강의 식별자
- `creator_name`: 크리에이터명
- `job_title`: 직업명
- `course_title`: 강의 제목

### 9.2 이미지 데이터
파일:
- `data/image-assets.json`

구조:
```json
{
  "profile": {
    "baking": [
      {
        "courseId": "course-301",
        "name": "최유정",
        "url": "https://.../assets/images/profile/baking/choi-yujeong.png"
      }
    ]
  },
  "thumbnail": {
    "baking": [
      {
        "courseId": "course-301",
        "variants": {
          "thumbnail_cover_mobile": "https://.../cover-mobile.png",
          "thumbnail_cover_pc": "https://.../cover-pc.png",
          "thumbnail_list": "https://.../list.png",
          "thumbnail_product": "https://.../product.png"
        }
      }
    ]
  }
}
```

### 9.3 데이터 연결 규칙
- 텍스트와 이미지 데이터는 `courseId` 기준으로 연결 가능해야 한다.
- 카테고리 키는 `baking`, `video`, `illust`를 사용한다.
- UI 라벨은 사용자 친화적으로 `베이킹`, `영상 디자인`, `드로잉`으로 표시한다.

## 10. 외부 데이터 운영 방식
### 10.1 배포 방식
- 데이터와 이미지는 GitHub Pages를 통해 공개 URL로 서빙한다.
- Figma plugin manifest의 `networkAccess.allowedDomains`는 `https://day1-co-design.github.io`를 허용한다.
- 현재 manifest에는 localhost 개발 도메인을 포함하지 않는다.

### 10.2 현재 외부 데이터 URL
- 텍스트: `https://day1-co-design.github.io/figma-mock-plugin/data/text-course-info.json`
- 이미지: `https://day1-co-design.github.io/figma-mock-plugin/data/image-assets.json`

### 10.3 운영 방법
데이터 수정 시:
1. JSON 수정
2. 이미지 파일 추가/교체
3. URL 경로 확인
4. git commit
5. git push
6. GitHub Pages 반영 후 플러그인에서 자동 사용

## 11. 이미지 파일 구조
프로필 이미지:
```text
assets/images/profile/
  baking/
  illustration/
  Video/
```

강의 썸네일:
```text
assets/images/thumbnail/
  baking/course-301/
  illustration/course-101/
  video/course-201/
```

썸네일 파일 규칙:
- `cover-mobile.png`
- `cover-pc.png`
- `list.png`
- `product.png`

## 12. 예외 처리 요구사항
- 텍스트 데이터에서 텍스트 레이어가 없으면 Figma toast로 `텍스트 레이어를 1개 이상 선택해 주세요.`를 표시한다.
- 이미지 데이터에서 이미지 fill 적용 가능 레이어가 없으면 Figma toast로 `이미지를 적용할 레이어를 1개 이상 선택해 주세요.`를 표시한다.
- 선택한 데이터 유형에 값이 없으면 Figma toast로 `선택한 데이터 유형에 사용할 값이 없어요.`를 표시한다.
- 선택한 데이터 유형에 이미지가 없으면 Figma toast로 `선택한 데이터 유형에 사용할 이미지가 없어요.`를 표시한다.
- 이미지 bytes가 비어 있으면 `이미지 바이트가 비어 있어요.` 에러를 발생시킨다.
- UI에서 JSON 또는 이미지 fetch에 실패하면 `데이터를 불러오지 못했어요. Pages 설정을 확인해 주세요.` toast를 요청한다.
- toast 노출 시간은 `800ms`이다.

## 13. 코드 구조
- `manifest.json`: Figma plugin 설정, UI/main entry, 네트워크 허용 도메인
- `code.ts`: Figma plugin main thread TypeScript 소스
- `code.js`: Figma가 실행하는 main thread JavaScript
- `ui.html`: 플러그인 UI, 상태 관리, 데이터 fetch, main thread 메시지 전송
- `data/text-course-info.json`: 텍스트 목업 데이터
- `data/image-assets.json`: 이미지 asset URL 데이터
- `assets/images/`: GitHub Pages로 배포되는 이미지 파일

## 14. 현재 구현 완료 범위
완료:
- 프로필/클래스 탭 기반 UI
- 데이터 종류 칩 UI와 선택 상태 표시
- 공통 select trigger/dropdown UI
- 프로필 아바타 랜덤 적용
- 프로필 크리에이터 정보 텍스트 랜덤 적용
- 클래스 코스 이미지 랜덤 적용
- 클래스 강의 제목 랜덤 적용
- 카테고리별/전체 데이터 pool 구성
- Figma selection 상태 기반 안내 문구와 버튼 상태 처리
- 이미지 fill 적용 가능 레이어 필터링
- 텍스트 레이어 font load 후 characters 변경
- 외부 JSON 데이터 fetch
- GitHub Pages 기반 데이터/이미지 URL 사용

## 15. 현재 미지원 또는 제거된 범위
- 날짜 랜덤 데이터(`date_yyyy`, `date_yy`)는 현재 UI에서 제공하지 않는다.
- 크리에이터 리스트에서 특정 1명을 직접 선택해 적용하는 별도 페이지는 현재 제공하지 않는다.
- 카테고리 다중 선택은 현재 제공하지 않는다.
- 텍스트와 이미지를 `courseId` 기준으로 세트 동시 적용하는 기능은 현재 제공하지 않는다.
- localhost fallback은 현재 manifest와 UI 데이터 소스에 포함되어 있지 않다.

## 16. 다음 확장 후보
- `courseId` 기준 텍스트 + 썸네일 세트 동시 적용
- 크리에이터 직접 선택 적용
- 카테고리 다중 선택
- 날짜/가격/수강생 수 등 일반 데이터 타입 추가
- 데이터 검색 또는 필터링
- JSON 스키마 검증
- 운영자용 데이터 업데이트 가이드
- 플러그인 설치/사용법 문서
