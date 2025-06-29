# **App Name**: QuizWhiz

## Core Features:

- Presenter Dashboard: Implements presenter view for quiz control using SockJS and STOMP for WebSocket communication.
- Player Connection: Establishes player connection to WebSocket server using SockJS and STOMP.
- Waiting Screen: Shows waiting screen on player side until questions arrive.
- Question Display: Receives and shows quiz questions (question content, options, time) via WebSocket from presenter.
- Question Control: Allows presenter to proceed to the next question via a UI button that triggers a WebSocket request.
- Leaderboard Updates: Receives and shows leaderboard updates from the server via WebSocket in the presenter dashboard.

## Style Guidelines:

- Primary color: Use a vibrant blue (#29ABE2) to evoke a sense of excitement and competition. 
- Background color: A very light blue (#F0F8FF), desaturated to create a calm and focused environment for quizzes.
- Accent color: A contrasting orange (#FF8C00) for CTAs, highlights, and important notifications, drawing user attention.
- Font pairing: 'Space Grotesk' (sans-serif) for headlines to convey a techy, modern feel and 'Inter' (sans-serif) for body text to ensure readability and a neutral appearance.
- Use clear, simple icons to represent different quiz categories, actions, and status indicators.
- A clean and organized layout is required with clear divisions for presenter controls, question display, and player answer options to enhance the user experience and functionality.
- Use subtle animations (e.g., a slide-in animation for questions, a progress bar indicating time) to provide visual feedback and engagement.