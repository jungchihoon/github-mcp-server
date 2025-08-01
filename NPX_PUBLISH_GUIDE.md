# 🚀 npx로 GitHub MCP Server 사용하기 - 완전 가이드

## 📋 개요

이 프로젝트는 **npx**를 통해 즉시 실행할 수 있도록 설정되어 있습니다. 설치 없이 바로 사용할 수 있습니다!

## 🎯 npx 사용법

### 🚀 기본 사용법

```bash
# 기본 Git 작업
npx github-mcp-server gstatus
npx github-mcp-server gadd
npx github-mcp-server gcommit "커밋 메시지"
npx github-mcp-server gpush

# 고급 워크플로우
npx github-mcp-server gflow "새 기능 구현"
npx github-mcp-server gsync
npx github-mcp-server gbackup

# 짧은 별칭 사용
npx gms gstatus
npx gms gflow "빠른 수정"
```

### 📁 기본 Git 작업

```bash
# 저장소 상태 확인
npx github-mcp-server gstatus

# 파일 추가 및 커밋
npx github-mcp-server gadd
npx github-mcp-server gcommit "버그 수정"

# 원격 저장소에 푸시
npx github-mcp-server gpush

# 원격 저장소에서 풀
npx github-mcp-server gpull

# 브랜치 작업
npx github-mcp-server gbranch feature-auth
npx github-mcp-server gcheckout feature-auth

# 히스토리 및 차이점 보기
npx github-mcp-server glog 5
npx github-mcp-server gdiff main
```

### 🚀 고급 워크플로우

```bash
# 완전한 워크플로우 (추가 → 커밋 → 푸시)
npx github-mcp-server gflow "새 기능 구현"

# 빠른 커밋 (푸시 없음)
npx github-mcp-server gquick "오타 수정"

# 원격과 동기화 (풀 → 푸시)
npx github-mcp-server gsync

# 개발 세션 관리
npx github-mcp-server gdev feature-auth

# 백업 및 안전성
npx github-mcp-server gbackup --emergency

# 저장소 정리
npx github-mcp-server gclean --optimize
```

### 🔧 특수 Git 작업

```bash
# 태그 관리
npx github-mcp-server gtag create v1.0.0 "릴리스 버전"

# 머지 작업
npx github-mcp-server gmerge feature-branch

# 리베이스 작업
npx github-mcp-server grebase main

# 특정 커밋 체리픽
npx github-mcp-server gcherry abc1234

# 라인별 작성자 정보
npx github-mcp-server gblame src/app.js
```

### 📚 도움말 및 발견

```bash
# 사용 가능한 모든 작업 나열
npx github-mcp-server list

# 특정 작업에 대한 도움말
npx github-mcp-server help

# 기본 작업 보기
npx github-mcp-server glist basic

# 고급 워크플로우 보기
npx github-mcp-server glist advanced
```

## 📦 npm에 게시하기

### 1. npm 계정 설정

```bash
# npm에 로그인
npm login

# 사용자 정보 확인
npm whoami
```

### 2. 패키지 빌드 및 테스트

```bash
# 의존성 설치
pnpm install

# TypeScript 빌드
pnpm run build

# 패키지 테스트
npm pack

# 로컬에서 npx 테스트
npx ./github-mcp-server-1.8.4.tgz list
```

### 3. npm에 게시

```bash
# 패키지 게시
npm publish

# 또는 공개 범위로 게시
npm publish --access public
```

### 4. 게시 후 테스트

```bash
# npx로 테스트
npx github-mcp-server list
npx github-mcp-server gstatus
```

## 🔧 개발 환경 설정

### 로컬 개발

```bash
# 저장소 클론
git clone https://github.com/yourusername/github-mcp-server.git
cd github-mcp-server

# 의존성 설치
pnpm install

# 개발 모드 실행
pnpm run dev

# 빌드
pnpm run build
```

### 글로벌 설치 (선택사항)

```bash
# 글로벌 설치
npm install -g github-mcp-server

# 또는 pnpm 사용
pnpm add -g github-mcp-server

# 직접 사용
gstatus
gflow "메시지"
gsync
```

## 📁 프로젝트 구조

```
github-mcp-server/
├── src/
│   ├── index.ts              # MCP 서버 (29개 도구 등록)
│   └── github.ts             # Git 작업 엔진
├── bin/
│   ├── basic/                # 📁 17개 기본 Git 작업
│   └── advanced/             # 🚀 13개 고급 워크플로우
├── mcp-cli.js               # CLI 래퍼
├── package.json             # npm 설정
└── README.md                # 문서
```

## 🛠️ 사용 가능한 명령어

### 📁 기본 작업 (17개)
- `gstatus` - 저장소 상태 확인
- `gadd` - 파일 스테이징
- `gcommit` - 커밋 생성
- `gpush` - 원격에 푸시
- `gpull` - 원격에서 풀
- `gbranch` - 브랜치 관리
- `gcheckout` - 브랜치 전환
- `glog` - 커밋 히스토리
- `gdiff` - 차이점 보기
- `gstash` - 스태시 작업
- `gpop` - 스태시 적용
- `greset` - 리셋 작업
- `gclone` - 저장소 클론
- `ginit` - Git 초기화
- `gremote` - 원격 관리

### 🚀 고급 워크플로우 (13개)
- `gflow` - 완전한 워크플로우
- `gquick` - 빠른 커밋
- `gsync` - 동기화
- `gdev` - 개발 세션
- `gworkflow` - 전문 워크플로우
- `gfix` - 스마트 수정
- `gfresh` - 새로 시작
- `gbackup` - 백업
- `gclean` - 정리
- `gsave` - 저장
- `glist` - 도구 발견
- `grelease` - 릴리스 관리

### 🔧 특수 Git 작업 (6개)
- `gtag` - 태그 관리
- `gmerge` - 머지 작업
- `grebase` - 리베이스
- `gcherry` - 체리픽
- `gblame` - 라인별 작성자
- `gbisect` - 이진 검색

## 🎯 장점

1. **🚀 즉시 사용**: 설치 없이 npx로 바로 실행
2. **📦 가벼움**: 필요한 파일만 포함
3. **🛡️ 안전성**: 검증된 Git 작업
4. **📚 완전한 문서**: 상세한 가이드 제공
5. **🔧 유연성**: 글로벌 설치 또는 npx 사용 선택 가능

## 🚨 주의사항

- Node.js 18+ 필요
- Git 저장소 내에서 실행해야 함 (일부 명령어 제외)
- npm에 게시하기 전에 충분히 테스트

## 📞 지원

문제가 있거나 개선 사항이 있으면 GitHub 이슈를 생성해주세요! 