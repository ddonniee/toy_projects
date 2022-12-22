### 📡 API 설계

|  | URL | METHOD | 기능 |
| --- | --- | --- | --- |
| --- | /borad | GET | 게시판 글 읽기 |
| --- | /borad/sort/:category | GET | 카테고리별로 sorting |
| --- | /borad/hits/:num | PATCH | 조회수 카운팅 |
| --- | /borad/write/num | GET | 특정 게시물 정보 읽기 |
| --- | /borad/write | POST | 게시판 글 작성 |
| --- | /borad/write/num | PATCH | 특정 게시물 수정 |
| --- | /borad/delete/num | PATCH | 특정 게시물 삭제 |


### 📋 DB 설계

- 📌 lists

| 이름 | 데이터 유형 | null | 기본값 | 설명 |
| --- | --- | --- | --- | --- |
| num | int | not null | auto_increment | 오름차순으로 자동 설정 |
| writer | varchar | not null | x | 포스팅 작성자 (defult로 설정) |
| title | varchar | not null | x | 사용자 입력값 |
| contents | varchar | not null | x | 사용자 입력값 |
| insert_date | varchar | not null | current_timestmp | 글 생성 시기로 자동 입력 |
| isShown | varchar | not null | 1 | 글 삭제시 0으로 변경하여 가리기 |
| hits | int | not null | 0 | 목록에서 특정게시물 클릭시 바로 카운팅 |

- 📌 users
