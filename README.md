# express generator - typescript

2023.01.16

## 개선 내용

### 23-01-16(THOR)

- 약 12종의 타입정의 라이브러리가 추가되었습니다.
- typescript 및 ts-node 라이브러리가 추가되었습니다.
- MongoDB 접속 uri가 변경되었습니다. (.env)
- Monoose 연결 코드를 정리했습니다. (db.ts)
- Package.json의 서버 컴파일러를 babel에서 typescript로 변경했습니다. (package.json)
- CommonJS의 모듈화를 ES6+로 변경하였습니다. ( required("...") => import \* from ) (webpack.config.ts , csp.ts)
- S3Client의 파라미터를 타입에 맞게 정리하고, 미들웨어의 파라미터 타입을 추가했습니다. (middlewares.js)
- tsconfig.json이 추가되었습니다.

## 미완료 사항

- passport 및 OAuth 관련 컨트롤러 ts로 변환해야함
