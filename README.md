# Workout Session Runner

백엔드 없이 동작하는 client-side only 운동 세션 앱입니다. React, TypeScript, Vite 기반이며 운동 루틴은 정적 TypeScript 파일로 관리합니다.

사용자는 운동 프로그램을 선택하고 세션을 시작합니다. 세션 중에는 전체 운동 시간, 세트 수행 시간, 휴식 시간, 완료 기록을 브라우저 상태와 `localStorage`로 관리합니다.

## 핵심 방향

- 서버 API 없음
- 로그인 없음
- DB 없음
- 루틴 데이터는 프론트 코드에 포함
- 설정과 세션 상태는 `localStorage`에 저장
- 운동 중 휴식 시간은 세션 시작 시점의 설정 스냅샷을 사용
- PWA로 패키징 가능

## 실행

```bash
npm install
npm run dev
```

모바일 기기에서 같은 네트워크로 테스트하려면:

```bash
npm run dev:mobile
```

빌드:

```bash
npm run build
```

빌드 결과는 `dist/`에 생성됩니다.

## 배포

Vercel 기준 설정:

- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

PWA 캐시 관련 설정은 `public/sw.js`와 `vercel.json`에 있습니다. Vite 빌드 해시가 바뀔 때 stale `index.html`이 오래 남지 않도록 navigation 요청은 network-first 전략을 사용합니다.

## 주요 폴더

```text
src/
  app/
    App.tsx

  routines/
    index.ts
    shoulderTricepsRoutine.ts

  features/
    workout/
      pages/
        HomePage.tsx
        SettingsPage.tsx
        WorkoutSessionPage.tsx
        WorkoutSummaryPage.tsx

      components/
        RoutineCard.tsx
        CurrentExercisePanel.tsx
        RestTimerPanel.tsx
        WorkoutProgress.tsx
        PrimaryWorkoutButton.tsx

      hooks/
        useNow.ts
        useWorkoutSession.ts

      model/
        workoutTypes.ts
        workoutSessionCalculations.ts
        workoutSessionTransition.ts
        workoutSessionUtils.ts

      settings/
        workoutSettings.ts
        workoutSettingsStorage.ts
        useWorkoutSettings.ts

      storage/
        workoutSessionStorage.ts

  shared/
    storage/
      localStorageClient.ts

    utils/
      timeFormat.ts
```

## 루틴 추가 방법

새 루틴은 `src/routines/` 아래에 파일을 추가하고 `src/routines/index.ts`의 `workoutRoutines` 배열에 넣으면 됩니다.

예:

```ts
import { shoulderTricepsRoutine } from "./shoulderTricepsRoutine";
import { newRoutine } from "./newRoutine";

export const workoutRoutines = [
  shoulderTricepsRoutine,
  newRoutine,
];
```

앱의 메인 화면은 `workoutRoutines` 배열을 기준으로 자동 렌더링합니다.

## 설정 정책

공통 쉬는시간은 `WorkoutSettings.globalRestSeconds`로 관리합니다.

기본값:

```ts
export const DEFAULT_WORKOUT_SETTINGS = {
  globalRestSeconds: 90,
};
```

저장 위치:

```text
localStorage key: workout.settings
```

설정값 접근은 컴포넌트에서 직접 하지 않습니다. 반드시 아래 계층을 통해 접근합니다.

- `workoutSettingsStorage.ts`
- `useWorkoutSettings.ts`

세션 시작 시 현재 설정값은 `WorkoutSession.settingsSnapshot`에 복사됩니다. 운동 도중 설정을 변경해도 이미 진행 중인 세션에는 즉시 반영되지 않아야 합니다.

## 세션 진행 규칙

세션 상태:

```ts
type WorkoutSessionStatus =
  | "idle"
  | "exercising"
  | "resting"
  | "paused"
  | "completed";
```

기본 흐름:

```text
exercising
  -> 세트 종료
  -> 마지막 세트가 아니면 resting
  -> 휴식 종료 또는 다음 세트 시작
  -> exercising
  -> ...
  -> completed
```

휴식 시간 계산:

```ts
effectiveRestSeconds =
  session.settingsSnapshot.globalRestSeconds
  ?? exercise.restSeconds
  ?? DEFAULT_REST_SECONDS;
```

현재 MVP에서는 `settingsSnapshot.globalRestSeconds`가 항상 존재하도록 설계되어 있습니다.

## 시간 계산 정책

여러 타이머를 각 컴포넌트에서 돌리지 않습니다. `useNow(1000)` 하나로 현재 시간을 갱신하고, 세션의 ISO string 시간값과 비교해 파생값을 계산합니다.

시간 계산은 `workoutSessionCalculations.ts`에 둡니다.

상태 전환은 `workoutSessionTransition.ts`에 둡니다.

컴포넌트는 가능한 한 현재 상태와 액션만 받아서 표시합니다.

## localStorage 정책

직접 `window.localStorage`를 호출하지 말고 `shared/storage/localStorageClient.ts`를 사용합니다.

세션 저장 위치:

```text
workout:activeSession
workout:lastRoutineId
workout:recentCompletions
```

설정 저장 위치:

```text
workout.settings
```

세션은 1초마다 저장하지 않습니다. 운동 시작, 세트 종료, 휴식 종료, 일시정지, 재개, 완료 같은 상태 전환 시점에만 저장합니다.

## PWA

관련 파일:

- `public/manifest.webmanifest`
- `public/sw.js`
- `public/icons/*`
- `vercel.json`

PWA 캐시 문제가 의심될 때는 브라우저에서 site data 또는 service worker를 제거한 뒤 다시 접속합니다.

## Code Assistant Notes

이 저장소에서 작업하는 CLI 코드 어시스턴트는 아래 원칙을 지켜주세요.

- 백엔드, 로그인, DB를 추가하지 마세요.
- 루틴 데이터와 세션 실행 로직을 섞지 마세요.
- 루틴 추가는 `src/routines/*`와 `routines/index.ts` 변경만으로 가능하게 유지하세요.
- 세션 전환 규칙은 UI 컴포넌트에 넣지 마세요.
- 시간 계산은 `workoutSessionCalculations.ts`에 둡니다.
- 상태 전환은 `workoutSessionTransition.ts`에 둡니다.
- 설정 저장/조회는 `settings/*`와 storage adapter를 통해 처리하세요.
- 컴포넌트에서 `localStorage`를 직접 호출하지 마세요.
- 세트 시작, 세트 종료, 휴식 시작 버튼을 여러 개로 늘리지 마세요. 메인 액션은 `PrimaryWorkoutButton` 하나를 중심으로 유지하세요.
- 큰 리팩터링보다 현재 구조에 맞는 작은 변경을 선호하세요.

## 현재 주의점

- `Exercise.restSeconds`는 타입에 남아 있지만 MVP에서는 공통 쉬는시간 설정이 우선입니다.
- `useCountdownTimer.ts`는 이전 구조의 훅입니다. 새 세션 타이머는 `useNow.ts`와 계산 유틸을 기준으로 동작합니다.
- `dist/`와 `node_modules/`는 git에 올리지 않습니다.
