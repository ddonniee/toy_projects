## 게시판 프로젝트

### 📡 API 명세서

- 📌 lists

| URL | METHOD | 기능 | params |
| --- | --- | --- | --- |
| /borad | GET | 게시판 글 읽기 | none |
| /borad/sort/:category | GET | 카테고리별로 sorting | url:category name |
| /borad/hits/:num | PATCH | 조회수 카운팅 | url:posting num |
| /borad/write/num | GET | 특정 게시물 정보 읽기 | url:posting num |
| /borad/write | POST | 게시판 글 작성 | body : { num, writer, title, contents, category}|
| /borad/write/num | PATCH | 특정 게시물 수정 | body:{title, contents, category} url:posting num |
| /borad/delete/num | PATCH | 특정 게시물 삭제 | url:posting num |

- 📌 users

| URL | METHOD | 기능 | params |
| --- | --- | --- | --- |
| /users | POST | token 발급 | body: {user_id, user_pw} |
| /users/add | POST | 회원가입 | body: {id, pw, name} |
| /users/logout| POST | 로그아웃 | 토큰 삭제 |

- 📌 posts

| URL | METHOD | 기능 | params |
| --- | --- | --- | --- |
| /posts | GET | 해당 게시글 댓글 목룍 읽기 | params.id로 게시글의 댓글 조회 |
| /posts/add | POST | 댓글 작성 | body: {bid, cgroup, cref, corder, cdepth, replier, content} |

### 📋 DB 설계

- 📌 lists

| 이름 | 데이터 유형 | null | 기본값 | 설명 |
| --- | --- | --- | --- | --- |
| num | int | not null | auto_increment | 오름차순으로 자동 설정 |
| user_num | int | not null | x | users table pk value |
| writer | varchar | not null | x | 포스팅 작성자 (defult로 설정) |
| title | varchar | not null | x | 사용자 입력값 |
| contents | varchar | not null | x | 사용자 입력값 |
| insert_date | varchar | not null | current_timestmp | 글 생성 시기로 자동 입력 |
| isShown | varchar | not null | 1 | 글 삭제시 0으로 변경하여 가리기 |
| hits | int | not null | 0 | 목록에서 특정게시물 클릭시 바로 카운팅 |

- 📌 users

| 이름 | 데이터 유형 | null | 기본값 | 설명 |
| --- | --- | --- | --- | --- |
| user_num | int | not null | auto_increment | 유저 생성시 자동 입력 |
| user_id | varchar | not null | x | 사용자 입력값 |
| user_pw | varchar | not null | x | 사용자 입력값 |
| user_name | varchar | not null | x | 사용자 입력값 |
| user_status | int | not null | default = 1 | 0 = inactive, 1=active |

- 📌 comments

| 이름 | 데이터 유형 | null | 기본값 | 설명 |
| --- | --- | --- | --- | --- |
| cid | int | not null | auto_increment | 댓글 작성시 자동 입력 |
| bid | varchar | not null | x | 게시글번호 |
| cgroup | int | not null | x | parent-cid |
| cref | int | not null | x | 대댓글 = 댓글+1 |
| corder | int | not null | default = 1 | group내 순서 |
| cdepth | int | not null | x | 댓글=1, 대댓글=2 |
| replier | varchar | not null | x | 사용자 id |
| content | varchar | not null | x | 사용자 입력값 |
| date | datetime | not null | current_timestamp() | 자동 입력 |