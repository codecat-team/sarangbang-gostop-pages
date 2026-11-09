# 시장 읍·면 중심 좌표 27곳 (OpenStreetMap)

시골장터(codecat)가 표준데이터에 좌표가 없는 시장 29곳 가운데 27곳의 거리를 재려고 쓰는 점들이다. 시장 자리 자체가 아니라 그 시장이 있는 읍·면·리의 중심이다(오차 약 1~5 km). 앱은 이 점을 '약 ○km' 거리에만 쓰고 지도 핀으로는 쓰지 않는다.

- 파일: `market-coords-osm-27.csv`, `market-coords-osm-27.json` (같은 내용). 열: 시·도, 시·군·구, 시장, 위도, 경도, 근거(읍·면·리 중심), 찾은 이름(OSM 검색어), OSM 장소 종류.
- 앱에서 쓰는 사본: `src/data/market-area-coords.json`. 못 찾은 2곳(안동시 정산장·천지장)은 이 파일에 없다.

## 라이선스 · 출처 표시 (ODbL)

이 파일은 OpenStreetMap 데이터에서 가져온 정보를 담고 있다. © OpenStreetMap contributors. 데이터베이스는 Open Database License (ODbL) 1.0 에 따라 쓸 수 있다: https://opendatacommons.org/licenses/odbl/1-0/ , 저작권 안내: https://www.openstreetmap.org/copyright

- 이 파일을 쓰거나 고쳐 다시 내놓는 사람은 출처('© OpenStreetMap contributors')를 밝히고, 고친 데이터베이스는 같은 ODbL 로 내놓아야 한다.
- 앱에서는 '앱 정보' 맨 아래에 '© OpenStreetMap 기여자' 한 줄과 저작권 안내 링크를 둔다.
- 받는 방법: OpenStreetMap Nominatim 검색(사이트 규칙대로 1초에 1번, 사람 이름·연락처 없음), 2026-11-05 (연하은 QA, B145). 시장 이름·읍·면 이름 외에 개인 정보는 없다.
