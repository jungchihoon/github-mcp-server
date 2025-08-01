# 🚀 GitHub에 GitHub MCP Server 등록하기 - 완전 가이드

## 📋 개요

이 가이드는 GitHub MCP Server를 여러분의 GitHub 계정에 등록하고 npm에 게시하는 완전한 과정을 안내합니다.

## 🎯 단계별 진행

### 1단계: GitHub에서 새 저장소 생성

1. **GitHub.com에 로그인**
2. **우측 상단의 "+" 버튼 클릭 → "New repository"**
3. **저장소 설정:**
   ```
   Repository name: github-mcp-server
   Description: A comprehensive Model Context Protocol (MCP) server that provides Git repository management capabilities for AI assistants and automation tools.
   Visibility: Public (권장) 또는 Private
   ✅ Add a README file: 체크 해제 (이미 있음)
   ✅ Add .gitignore: 체크 해제 (이미 있음)
   ✅ Choose a license: ISC License 선택
   ```
4. **"Create repository" 클릭**

### 2단계: 로컬 저장소 설정

```bash
# 1. 기존 원격 저장소 제거
git remote remove origin

# 2. 새로운 원격 저장소 추가 (YOUR_USERNAME을 실제 GitHub 사용자명으로 변경)
git remote add origin https://github.com/YOUR_USERNAME/github-mcp-server.git

# 3. 변경사항을 GitHub에 푸시
git push -u origin main
```

### 3단계: package.json 업데이트

`package.json` 파일에서 다음 부분을 여러분의 GitHub 사용자명으로 변경:

```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/YOUR_USERNAME/github-mcp-server.git"
  },
  "bugs": {
    "url": "https://github.com/YOUR_USERNAME/github-mcp-server/issues"
  },
  "homepage": "https://github.com/YOUR_USERNAME/github-mcp-server#readme"
}
```

### 4단계: 변경사항 커밋 및 푸시

```bash
# 변경사항 추가
git add package.json

# 커밋
git commit -m "chore: GitHub 저장소 URL 업데이트"

# 푸시
git push
```

## 📦 npm에 게시하기

### 1단계: npm 계정 설정

```bash
# npm에 로그인
npm login

# 사용자 정보 확인
npm whoami
```

### 2단계: 패키지 빌드 및 테스트

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

### 3단계: npm에 게시

```bash
# 패키지 게시
npm publish

# 또는 공개 범위로 게시
npm publish --access public
```

### 4단계: 게시 후 테스트

```bash
# npx로 테스트
npx github-mcp-server list
npx github-mcp-server gstatus
```

## 🏷️ GitHub 릴리스 생성

### 1단계: 태그 생성

```bash
# 버전 태그 생성
git tag v1.8.4

# 태그 푸시
git push origin v1.8.4
```

### 2단계: GitHub 릴리스 생성

1. **GitHub 저장소 페이지에서 "Releases" 클릭**
2. **"Create a new release" 클릭**
3. **릴리스 정보 입력:**
   ```
   Tag version: v1.8.4
   Release title: v1.8.4 - npx 지원 추가
   Description: 
   ## 🚀 새로운 기능
   - npx 지원 추가
   - npm 패키지 설정 완료
   - 33개 CLI 별칭 지원
   - 완전한 문서화
   
   ## 📦 사용법
   ```bash
   npx github-mcp-server gstatus
   npx github-mcp-server gflow "새 기능 구현"
   npx gms gsync
   ```
   ```
4. **"Publish release" 클릭**

## 🔧 GitHub Actions 설정 (선택사항)

### 1단계: GitHub Actions 워크플로우 생성

`.github/workflows/publish.yml` 파일 생성:

```yaml
name: Publish to npm

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci
      - run: npm run build
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{secrets.NPM_TOKEN}}
```

### 2단계: NPM 토큰 설정

1. **npm에서 액세스 토큰 생성:**
   ```bash
   npm token create --read-only
   ```

2. **GitHub 저장소 설정에서 시크릿 추가:**
   - Settings → Secrets and variables → Actions
   - "New repository secret" 클릭
   - Name: `NPM_TOKEN`
   - Value: npm에서 생성한 토큰

## 📚 추가 설정

### 1단계: GitHub 저장소 설명 업데이트

GitHub 저장소 페이지에서:
- **About 섹션에서 설명 추가**
- **Topics 추가:** `git`, `mcp`, `cli`, `npm`, `npx`, `automation`
- **Website URL 추가:** npm 패키지 URL

### 2단계: README.md 업데이트

GitHub 저장소의 README.md에 다음 추가:

```markdown
## 🚀 npx로 즉시 사용

```bash
npx github-mcp-server gstatus
npx github-mcp-server gflow "새 기능 구현"
npx gms gsync
```

## 📦 npm 설치

```bash
npm install -g github-mcp-server
# 또는
pnpm add -g github-mcp-server
```
```

## 🎯 완료 확인

### ✅ 확인 사항

1. **GitHub 저장소 생성 완료**
2. **코드 푸시 완료**
3. **npm 패키지 게시 완료**
4. **npx 테스트 성공**
5. **GitHub 릴리스 생성 완료**

### 🧪 테스트 명령어

```bash
# npx 테스트
npx github-mcp-server list
npx github-mcp-server gstatus

# 글로벌 설치 테스트
npm install -g github-mcp-server
gstatus
gflow "테스트"
```

## 🚨 주의사항

- **패키지 이름 중복 확인**: npm에서 `github-mcp-server` 이름이 사용 가능한지 확인
- **버전 관리**: 새로운 기능 추가 시 버전 번호 업데이트
- **문서 업데이트**: README.md와 가이드 문서 지속적 업데이트

## 📞 문제 해결

### 일반적인 문제

1. **npm 로그인 실패**
   ```bash
   npm logout
   npm login
   ```

2. **패키지 이름 중복**
   - package.json에서 name 필드 변경
   - 예: `@yourusername/github-mcp-server`

3. **GitHub 푸시 실패**
   ```bash
   git remote -v  # 원격 저장소 확인
   git remote set-url origin https://github.com/YOUR_USERNAME/github-mcp-server.git
   ```

## 🎉 완료!

이제 여러분의 GitHub 계정에 GitHub MCP Server가 등록되었고, 누구나 `npx github-mcp-server`로 사용할 수 있습니다! 