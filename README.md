# Beaver Notes
Welcome to the all-encompassing classroom companion!

Beaver Notes is an AI-enhanced note-taking tool that allows the student to focus on learning the material,
rather than scrambling to write everything that the professor spoke about.

Beaver Notes was created using REST API alongside an open source Speech-to-Text API to capture voice recordings and Google Gemini
to craftily compile the text files into easy-to-revise notes!

Inspiration
We were inspired by our struggles in previous classes where some professors went over material too fast to be able to take accurate notes or didn't explain the topic very well. One of the main challenges in these classes is that it's very hard to multitask while listening to the professor and writing notes. Therefore, we wanted to make an app that would listen or take in lectures and display them on a webpage where the user would have access to all their previous notes in a detailed fashion to aid their studying and allow the user to focus on listening.

What it does
Our app specifically works by giving the user the ability to record audio in their surroundings, typically a lecture, and the app transcribes it to text then uses that text with an AI to understand it and return to the user a summary and detailed notes of the audio provided.
How we built it
We built this app by using many different technologies. The app is a Vite + React app built mainly with JSX, JS, and CSS as the front end and Rest API and Express as the back end. We also used Google Gemini API for the summarizing and generation of detailed notes of the provided speech and used a speech-to-text API to be able to transform the speech into text and give it to Gemini. Then, so the user can always access all their notes, we connected a MongoDB database using Mongoose to store all the lecture notes for the user.



In the future: Beaver Notes will aim to expand its scope shortly, introducing a raw text file upload and raw audio file uploads (.mp3/.wav) that can be transcribed and summarized. Another goal will be to add a database of transcribed recordings from various courses at OSU and use the Gemini API to generate study flashcards for students to refine their understanding.

Created by: Pedro Blanco, Stanley Eng, Andy Bui and Brandon Gill - 4/5-6/25 - Oregon State University
