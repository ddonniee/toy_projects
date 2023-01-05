## 게시판 만들기
### `npm start`
/package.json 
"scripts"/"start"에 8081 port로 명시

### 컴포넌트 사용법

- Button component props

| 이름 | 기능 | 예시 |
| -- | -- | -- |
| title | 버튼명 | "작성하기" |
| url | 버튼 클릭시 링크 이동 | /write |

- Header component props

| 이름 | 기능 | 예시 |
| -- | -- | -- |
| isShown | 버튼보이기 | true |
| title | 버튼명 | "로그인하기" |
| url | 버튼 클릭시 링크 이동 | /write |
| onReadUrl | paramId 읽기| setParamID |