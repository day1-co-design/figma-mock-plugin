# Coloso Mock Data Plugin 설치 가이드

이 문서는 GitHub에서 플러그인 파일을 내려받아 Figma Desktop에서 직접 실행하는 방법을 안내합니다.

## 준비물
- Figma Desktop App
- 인터넷 연결
- GitHub에서 받은 플러그인 zip 파일

이 플러그인은 Figma 웹 브라우저 버전이 아니라 Figma Desktop App에서 설치해야 합니다.

## 1. 플러그인 zip 파일 다운로드
1. 아래 링크를 엽니다.
   - https://github.com/day1-co-design/figma-mock-plugin/archive/refs/heads/main.zip
2. zip 파일이 자동으로 다운로드됩니다.
3. 다운로드된 zip 파일의 압축을 풉니다.

압축을 풀면 보통 `figma-mock-plugin-main` 같은 이름의 폴더가 생깁니다.

## 2. Figma에서 플러그인 불러오기
1. Figma Desktop App을 실행합니다.
2. 아무 Figma 파일이나 엽니다.
3. 상단 메뉴에서 `Plugins > Development > Import plugin from manifest...`를 선택합니다.
4. 압축을 푼 `figma-mock-plugin-main` 폴더를 엽니다.
5. 폴더 안의 `manifest.json` 파일을 선택합니다.
6. 플러그인이 Development 메뉴에 추가됩니다.

## 3. 플러그인 실행하기
1. Figma 파일에서 데이터를 넣을 레이어를 선택합니다.
2. 상단 메뉴에서 `Plugins > Development > Coloso - Mock Data`를 실행합니다.
3. 플러그인에서 탭, 데이터 종류, 데이터 유형, 카테고리를 선택합니다.
4. 하단 적용 버튼을 누릅니다.
