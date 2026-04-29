# 🎵 music-rag

A local, end-to-end RAG (Retrieval-Augmented Generation) learning project that turns your personal music library into a semantic search engine.

---

## What this project does

Music files  
→ metadata scan  
→ text chunks  
→ embeddings  
→ semantic search  

You can search your music by meaning instead of exact keywords.

---

## Key Concepts

- Metadata extraction
- Chunking
- Embeddings
- Vector similarity search
- RAG pipeline basics

---

## Project Structure

music-rag/  
  data/  
    library.json  
    chunks.json  
    embeddings.json  
    artwork/  

  src/  
    scanner/  
    core/  
    types/  
    utilities/  

---

## Setup

Install dependencies:
```
npm install
```
Create .env:
```
OPENAI_API_KEY=your_api_key_here
EMBEDDING_MODEL=text-embedding-3-small
```
---

## Usage

Scan music:
```
npm run scan -- "PATH_TO_YOUR_MUSIC"
```
Chunk data:
```
npm run chunk
```
Generate embeddings:
```
npm run embed
```
Search:
```
npm run search -- "mellow 70s rock"
```
---

## Tech Stack

- Node.js
- TypeScript
- OpenAI API
- music-metadata

---

## Notes

- embeddings.json is large and should not be committed
- file paths reflect the scan machine

---

## Purpose

Learn RAG systems using real personal data.

---

## Status

- Scanning complete
- Chunking complete
- Embeddings complete
- Search working
