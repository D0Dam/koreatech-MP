# 장바구니 협업 미션

## step1 요구사항

- [ ] 클라이언트 - 서버 연동을 통해 상품 목록을 보여준다.
  - [ ] 사용자 별 장바구니 기능이 정상적으로 동작하게 만든다.
  - [x] 장바구니에 담긴 아이템 목록을 확인할 수 있다. (장바구니 아이템 목록 조회)
  - [x] 상품을 장바구니에 추가할 수 있다. (장바구니 아이템 추가)
  - [x] 장바구니에 담긴 아이템의 수량을 변경할 수 있다. (장바구니 아이템 수량 변경)
  - [x] 장바구니에 담긴 아이템을 삭제할 수 있다. (장바구니 아이템 삭제)
  - [x] 상품, 장바구니 기능은 API 명세를 따라야 한다. https://techcourse.woowahan.com/s/7TbGiSZS/ls/qhueURZ9

## 프론트 요구사항

- [x] 사용자는 여러 서버 중 하나를 선택할 수 있다.

## 기능 구현 목록

- [x] 헤더에 사용자 선택창 추가 (selector)
  - [x] 선택된 사용자에 따라 장바구니 정보와 주문 상세가 달라짐.
- [ ] 사용자의 정보(id,pw)를 담은 객체가 존재한다.
- [ ] 상황에 맞는 에러처리하기
