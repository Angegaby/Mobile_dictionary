# Dictionary Mobile App — Design Document

## Problem Summary

LexiTech Solutions Ltd needs a cross-platform Dictionary Mobile Application that helps users quickly find English word meanings, pronunciations, and usage examples. The app consumes the Free Dictionary API and must run on Android and iOS with a clean, responsive UI.

## Application Architecture

```mermaid
flowchart TB
  subgraph ui [UI Layer]
    SearchScreen[SearchScreen]
    WordDetailScreen[WordDetailScreen]
    Drawer[DrawerNavigator]
    HistoryList[HistoryDrawer]
  end

  subgraph state [State Layer]
    AppContext[AppContext]
    HistoryStore[historyService AsyncStorage]
  end

  subgraph data [Data Layer]
    DictionaryAPI[dictionaryApi axios]
    AudioPlayer[expo-av Audio]
  end

  SearchScreen -->|submit word| AppContext
  HistoryList -->|tap word| AppContext
  AppContext -->|GET /entries/en/word| DictionaryAPI
  DictionaryAPI -->|JSON| AppContext
  AppContext -->|word data| WordDetailScreen
  AppContext -->|add word| HistoryStore
  WordDetailScreen -->|play/pause| AudioPlayer
  Drawer --> HistoryList
```

## Data Flow

```mermaid
sequenceDiagram
  participant User
  participant SearchScreen
  participant AppContext
  participant DictionaryAPI
  participant HistoryStore
  participant WordDetailScreen

  User->>SearchScreen: Enter word and tap Search
  SearchScreen->>SearchScreen: Validate non-empty input
  SearchScreen->>AppContext: search(word)
  AppContext->>DictionaryAPI: GET /entries/en/{word}
  DictionaryAPI-->>AppContext: JSON response or error
  alt Success
    AppContext->>HistoryStore: addWord(word)
    AppContext->>WordDetailScreen: Render definitions
  else Error
    AppContext->>WordDetailScreen: Show error with retry
  end
```

## Screens

| Screen | Purpose |
|--------|---------|
| Search | Text input, validation, search button, loading state |
| Word Detail | Word title, phonetics, definitions, examples, audio |
| Drawer (History) | List of previously searched words, tap to re-search |

## API Endpoints

| Method | URL | Purpose |
|--------|-----|---------|
| GET | `https://api.dictionaryapi.dev/api/v2/entries/en/{word}` | Fetch word definitions, phonetics, and examples |

No custom backend is required.

## Error Handling Matrix

| Condition | HTTP / Cause | User Message | Recovery |
|-----------|--------------|--------------|----------|
| Word not found | 404 | Word not found | Retry or return to search |
| Network failure | No response / timeout | Network error. Check your connection. | Retry |
| Malformed response | Invalid JSON shape | Unexpected response message | Retry |
| Empty search | Client validation | Please enter a word before searching. | Enter a word |
| Empty history | No stored items | No searches yet | Search a word |
| Other API errors | 5xx / unknown | Something went wrong. Please try again. | Retry |

## Tech Stack

| Technology | Justification |
|------------|---------------|
| Expo (React Native) | Cross-platform Android/iOS development per assignment requirements |
| TypeScript | Type-safe API models and component props |
| axios | Required HTTP client for API integration |
| React Navigation (Drawer + Stack) | Drawer history menu and screen navigation |
| AsyncStorage | Persistent search history across app restarts |
| expo-av | Audio pronunciation playback from API URLs |

## Folder Structure

```
src/
├── components/     # Reusable UI (SearchBar, ErrorView, audio, history)
├── context/        # Global app state (search, loading, errors, history)
├── navigation/     # Drawer + stack navigators
├── screens/        # Search and Word Detail screens
├── services/       # API and AsyncStorage history
├── theme/          # Colors, spacing, shared styles
├── types/          # Dictionary API TypeScript interfaces
└── utils/          # Safe parsing helpers
```
